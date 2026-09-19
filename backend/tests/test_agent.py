import pytest
import os
from fastapi.testclient import TestClient
from main import app
from database import Base, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from agent.tools import secure_path, AgentTools

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

def test_secure_path():
    base = "/tmp/workspace"
    safe = secure_path(base, "src/main.js")
    assert safe == os.path.abspath("/tmp/workspace/src/main.js")

    with pytest.raises(PermissionError):
        secure_path(base, "../../../etc/passwd")

def test_agent_chat_api():
    task_id = create_task()
    token = get_auth_token("CANDIDATE")
    
    # Init Session
    res_session = client.post("/agent/session", headers={"Authorization": f"Bearer {token}"}, json={"task_id": task_id})
    assert res_session.status_code == 201
    session_id = res_session.json()["id"]

    # Chat
    res_chat = client.post("/agent/chat", headers={"Authorization": f"Bearer {token}"}, json={"session_id": session_id, "message": "Please list files"})
    assert res_chat.status_code == 200
    
    data = res_chat.json()
    assert "response" in data
    assert len(data["tool_calls"]) > 0
    assert data["tool_calls"][0]["tool_name"] == "list_files"
