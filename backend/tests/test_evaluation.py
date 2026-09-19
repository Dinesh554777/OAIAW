import pytest
from fastapi.testclient import TestClient
from main import app
from database import Base, get_db
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
    client.post("/auth/register", json={"name": "Test", "email": f"{role}@test.com", "password": "pass", "role": role})
    res = client.post("/auth/login", json={"email": f"{role}@test.com", "password": "pass"})
    return res.json()["access_token"]

def test_evaluation_pipeline():
    # Setup test data
    token_assessor = get_auth_token("ASSESSOR")
    res = client.post("/assessments", headers={"Authorization": f"Bearer {token_assessor}"}, json={"title": "Test Assessment", "status": "PUBLISHED"})
    a_id = res.json()["id"]
    res_task = client.post(f"/assessments/{a_id}/tasks", headers={"Authorization": f"Bearer {token_assessor}"}, json={"title": "Task 1", "task_type": "FEATURE"})
    task_id = res_task.json()["id"]

    token_candidate = get_auth_token("CANDIDATE")
    
    # 1. Access workspace and save file
    client.get(f"/workspace/{task_id}/files", headers={"Authorization": f"Bearer {token_candidate}"})
    res_save = client.post(f"/workspace/{task_id}/save", headers={"Authorization": f"Bearer {token_candidate}"}, json={"path": "src/main.py", "content": "print('hello')"})
    session_id = res_save.json()["assessment_session_id"]
    
    # 2. Trigger evaluate
    res_eval = client.post(f"/sessions/{session_id}/evaluate", headers={"Authorization": f"Bearer {token_candidate}"})
    assert res_eval.status_code == 200
    run_data = res_eval.json()
    assert run_data["status"] == "COMPLETED"
    
    # 3. Check that saving is now locked
    res_locked = client.post(f"/workspace/{task_id}/save", headers={"Authorization": f"Bearer {token_candidate}"}, json={"path": "src/main.py", "content": "print('hacked')"})
    assert res_locked.status_code == 403
    
    # 4. Fetch evaluation timeline
    res_fetch = client.get(f"/sessions/{session_id}/evaluation", headers={"Authorization": f"Bearer {token_assessor}"})
    assert res_fetch.status_code == 200
    fetch_data = res_fetch.json()
    assert len(fetch_data) == 1
    assert len(fetch_data[0]["results"]) == 3 # 3 mocked tests
