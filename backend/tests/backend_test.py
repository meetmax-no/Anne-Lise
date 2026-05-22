"""Backend tests for Norwegian date invitation API."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://date-decision.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Health endpoint
class TestHealth:
    def test_health_returns_200(self, client):
        r = client.get(f"{API}/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "telegram_configured" in data
        assert isinstance(data["telegram_configured"], bool)
        # token empty -> should be False
        assert data["telegram_configured"] is False


# /respond endpoint
class TestRespond:
    def _check_response(self, r, choice, expected_label):
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data["choice"] == choice
        assert data["label"] == expected_label
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        # Telegram token empty in env => telegram_sent should be False with error
        assert data["telegram_sent"] is False
        assert data["telegram_error"]
        assert "not configured" in data["telegram_error"].lower() or "token" in data["telegram_error"].lower()

    def test_respond_choice_A(self, client):
        r = client.post(f"{API}/respond", json={"choice": "A"}, timeout=20)
        self._check_response(r, "A", "Ja, gleder meg!")

    def test_respond_choice_B(self, client):
        r = client.post(f"{API}/respond", json={"choice": "B"}, timeout=20)
        self._check_response(r, "B", "Kanskje, fortell meg mer")

    def test_respond_choice_C(self, client):
        r = client.post(f"{API}/respond", json={"choice": "C"}, timeout=20)
        self._check_response(r, "C", "Nei takk")

    def test_respond_invalid_choice(self, client):
        r = client.post(f"{API}/respond", json={"choice": "D"}, timeout=15)
        assert r.status_code == 422

    def test_respond_with_note(self, client):
        note = "TEST_note_optional_field_stored"
        r = client.post(f"{API}/respond", json={"choice": "A", "note": note}, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data["ok"] is True
        assert data["choice"] == "A"

    def test_respond_missing_choice(self, client):
        r = client.post(f"{API}/respond", json={}, timeout=15)
        assert r.status_code == 422


# Persistence verification via direct mongo
class TestPersistence:
    def test_records_persisted_to_mongo(self, client):
        # Issue a unique note so we can identify it
        unique_note = f"TEST_persist_{os.urandom(4).hex()}"
        r = client.post(f"{API}/respond", json={"choice": "B", "note": unique_note}, timeout=20)
        assert r.status_code == 200
        record_id = r.json()["id"]

        # Verify via pymongo
        from pymongo import MongoClient
        from dotenv import load_dotenv
        load_dotenv('/app/backend/.env')
        mc = MongoClient(os.environ['MONGO_URL'])
        db = mc[os.environ['DB_NAME']]
        doc = db.invitation_responses.find_one({"id": record_id})
        assert doc is not None
        assert doc["choice"] == "B"
        assert doc["label"] == "Kanskje, fortell meg mer"
        assert doc["note"] == unique_note
        assert doc["telegram_sent"] is False
        mc.close()
