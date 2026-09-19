import pytest
from fastapi.testclient import TestClient
from main import app
from database import Base, get_db
from models import Role
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def get_auth_token(role: str):
    client.post("/auth/register", json={"name": "Test", "email": f"{role}@test.com", "password": "pass", "role": role})
    res = client.post("/auth/login", json={"email": f"{role}@test.com", "password": "pass"})
    return res.json()["access_token"]

def create_task():
    token = get_auth_token("ASSESSOR")
    res = client.post("/assessments", headers={"Authorization": f"Bearer {token}"}, json={"title": "Test Assessment", "status": "PUBLISHED"})
    a_id = res.json()["id"]
    res_task = client.post(f"/assessments/{a_id}/tasks", headers={"Authorization": f"Bearer {token}"}, json={"title": "Task 1", "task_type": "FEATURE"})
    return res_task.json()["id"]

def test_get_files():
    task_id = create_task()
    token = get_auth_token("CANDIDATE")
    res = client.get(f"/workspace/{task_id}/files", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "src" in res.json()

def test_save_file():
    task_id = create_task()
    token = get_auth_token("CANDIDATE")
    res = client.post(f"/workspace/{task_id}/save", headers={"Authorization": f"Bearer {token}"}, json={"path": "src/index.js", "content": "test"})
    assert res.status_code == 200
    assert res.json()["event_type"] == "FILE_SAVED"

def test_run_tests():
    task_id = create_task()
    token = get_auth_token("CANDIDATE")
    res = client.post(f"/workspace/{task_id}/run-tests", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["event_type"] == "TEST_RUN"

def test_agent_chat():
    task_id = create_task()
    token = get_auth_token("CANDIDATE")
    res = client.post(f"/workspace/{task_id}/agent/chat", headers={"Authorization": f"Bearer {token}"}, json={"message": "help"})
    assert res.status_code == 200
    assert res.json()["event_type"] == "AGENT_MESSAGE"
