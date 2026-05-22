# PRD — Date Invitation Site

## Original problem statement
> I need to make a very simple site for a date. Im not ready yet and it should be possible to send a answer to My Telegram account. There is going to be three options to click on A + B and C (No). Maybe a picture of a very fancy sushi restaurant with a text overlay.

## Architecture
- **Frontend**: React (CRA + craco), Tailwind CSS, Framer Motion, lucide-react
- **Backend**: FastAPI + httpx + Motor (MongoDB async)
- **DB**: MongoDB collection `invitation_responses`
- **Integration**: Telegram Bot API (sendMessage)

## User persona
A recipient who opens the link on their phone, reads the romantic invitation, and clicks one of three answers. Sender (Michael, chat id `8892942985`) receives the response on Telegram.

## Core requirements (static)
- Single page, mobile-first
- Norwegian Bokmål copy
- Three answer buttons (A=yes, B=maybe, C=no)
- Push answer to sender's Telegram
- Elegant, dark, candlelit sushi-restaurant aesthetic

## What's been implemented (2026-02)
- ✅ Frontend `Invitation.jsx` — hero sushi image, "Her kommer det en invitasjon" heading, A/B/C buttons, success state, reset
- ✅ Cormorant Garamond + Manrope fonts via Google Fonts
- ✅ Framer Motion staggered entrances + AnimatePresence success transition
- ✅ Backend `POST /api/respond` — validates choice, persists to Mongo, sends Telegram message
- ✅ Backend `GET /api/health` — exposes `telegram_configured` flag
- ✅ Backend tests 8/8 passing, frontend e2e passing
- ⏳ Telegram bot token — placeholder in `.env`, user must fill `TELEGRAM_BOT_TOKEN`

## Prioritized backlog
- **P0**: User adds Telegram bot token to `backend/.env` (`TELEGRAM_BOT_TOKEN=...`) and restarts backend
- **P0**: Push code to GitHub
- **P0**: Deploy to Vercel (note: backend needs separate host; Vercel is frontend-only by default)
- **P1**: Add free-text "personal note" field on choice B so recipient can ask follow-up questions
- **P1**: Rate limiting on `/api/respond` (anti-abuse before sharing publicly)
- **P2**: Animated confetti/heart burst on choice A
- **P2**: Admin view of past responses
- **P2**: Custom invitation parameters via URL (recipient name, date, place)
