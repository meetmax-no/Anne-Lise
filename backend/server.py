from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Literal, Optional
import uuid
from datetime import datetime, timezone
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Telegram config
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID', '')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Models
class InvitationResponse(BaseModel):
    choice: Literal['A', 'B', 'C']
    note: Optional[str] = None


class InvitationResponseRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    choice: str
    label: str
    note: Optional[str] = None
    telegram_sent: bool = False
    telegram_error: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


CHOICE_LABELS = {
    'A': 'Ja, gleder meg!',
    'B': 'Kanskje, fortell meg mer',
    'C': 'Nei takk',
}

CHOICE_EMOJI = {
    'A': '🥂',
    'B': '🤔',
    'C': '🙅',
}


async def send_telegram_message(text: str) -> tuple[bool, Optional[str]]:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return False, 'Telegram bot token or chat id not configured'
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': 'HTML',
    }
    try:
        async with httpx.AsyncClient(timeout=10) as http_client:
            r = await http_client.post(url, json=payload)
            if r.status_code == 200 and r.json().get('ok'):
                return True, None
            return False, f'Telegram API responded: {r.status_code} {r.text[:200]}'
    except Exception as e:
        return False, str(e)


@api_router.get("/")
async def root():
    return {"message": "Date invitation API"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "telegram_configured": bool(TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID),
    }


@api_router.post("/respond")
async def submit_response(payload: InvitationResponse):
    label = CHOICE_LABELS.get(payload.choice, payload.choice)
    emoji = CHOICE_EMOJI.get(payload.choice, '✉️')

    message_lines = [
        f'{emoji} <b>Nytt svar på date-invitasjonen</b>',
        '',
        f'Valg: <b>{payload.choice}</b> — {label}',
    ]
    if payload.note:
        message_lines.append(f'Beskjed: {payload.note}')
    message_lines.append('')
    message_lines.append(f'Tidspunkt: {datetime.now(timezone.utc).isoformat()}')
    telegram_text = '\n'.join(message_lines)

    sent, err = await send_telegram_message(telegram_text)

    record = InvitationResponseRecord(
        choice=payload.choice,
        label=label,
        note=payload.note,
        telegram_sent=sent,
        telegram_error=err,
    )
    doc = record.model_dump()
    await db.invitation_responses.insert_one(doc)

    return {
        "ok": True,
        "id": record.id,
        "choice": record.choice,
        "label": record.label,
        "telegram_sent": sent,
        "telegram_error": err,
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
