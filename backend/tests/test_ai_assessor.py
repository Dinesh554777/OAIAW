import pytest
from fastapi.testclient import TestClient
from main import app
from database import get_db
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

def get_auth_token(role: str):
    client.post("/auth/register", json={"name": "Test", "email": f"{role}@ai.com", "password": "pass", "role": role})
    res = client.post("/auth/login", json={"email": f"{role}@ai.com", "password": "pass"})
    return res.json()["access_token"]

def test_ai_assessor():
    token_assessor = get_auth_token("ASSESSOR")
    res = client.post("/assessments", headers={"Authorization": f"Bearer {token_assessor}"}, json={"title": "Test Assessment", "status": "PUBLISHED"})
    a_id = res.json()["id"]
    res_task = client.post(f"/assessments/{a_id}/tasks", headers={"Authorization": f"Bearer {token_assessor}"}, json={"title": "Task 1", "task_type": "FEATURE"})
    task_id = res_task.json()["id"]

    token_candidate = get_auth_token("CANDIDATE")
    
    # 1. Edit a file to start session
    client.get(f"/workspace/{task_id}/files", headers={"Authorization": f"Bearer {token_candidate}"})
    res_save = client.post(f"/workspace/{task_id}/save", headers={"Authorization": f"Bearer {token_candidate}"}, json={"path": "src/main.py", "content": "print('hello')"})
    session_id = res_save.json()["assessment_session_id"]
    
    # 2. Evaluate
    client.post(f"/sessions/{session_id}/evaluate", headers={"Authorization": f"Bearer {token_candidate}"})
    
    # 3. Generate AI Summary
    res_ai = client.post(f"/sessions/{session_id}/generate-ai-summary", headers={"Authorization": f"Bearer {token_assessor}"})
    assert res_ai.status_code == 200
    ai_data = res_ai.json()
    assert "task_summary" in ai_data
    assert "evidence_points" in ai_data
    
    # 4. Check Report
    res_report = client.get(f"/sessions/{session_id}/report", headers={"Authorization": f"Bearer {token_assessor}"})
    assert res_report.status_code == 200
    report_data = res_report.json()
    assert report_data["ai_summary"] is not None
    assert report_data["ai_summary"]["id"] == ai_data["id"]
