import pytest
import os
import shutil
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

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup temp workspace dirs
    for d in os.listdir("/tmp"):
        if d.startswith("workspace_"):
            try:
                shutil.rmtree(os.path.join("/tmp", d))
            except:
                pass

def get_auth_token(role: str):
    client.post("/auth/register", json={"name": "Test", "email": f"{role}@test.com", "password": "pass", "role": role})
    res = client.post("/auth/login", json={"email": f"{role}@test.com", "password": "pass"})
    return res.json()["access_token"]

def test_git_history_and_events():
    # Setup test data
    token_assessor = get_auth_token("ASSESSOR")
    res = client.post("/assessments", headers={"Authorization": f"Bearer {token_assessor}"}, json={"title": "Test Assessment", "status": "PUBLISHED"})
    a_id = res.json()["id"]
    res_task = client.post(f"/assessments/{a_id}/tasks", headers={"Authorization": f"Bearer {token_assessor}"}, json={"title": "Task 1", "task_type": "FEATURE"})
    task_id = res_task.json()["id"]

    token_candidate = get_auth_token("CANDIDATE")
    
    # 1. Access workspace (creates session implicitly via get_files)
    client.get(f"/workspace/{task_id}/files", headers={"Authorization": f"Bearer {token_candidate}"})
    
    # 2. Save file
    res_save = client.post(f"/workspace/{task_id}/save", headers={"Authorization": f"Bearer {token_candidate}"}, json={"path": "src/main.py", "content": "print('hello')"})
    assert res_save.status_code == 200
    session_id = res_save.json()["assessment_session_id"]
    
    # 3. Check events
    res_events = client.get(f"/sessions/{session_id}/events", headers={"Authorization": f"Bearer {token_assessor}"})
    assert res_events.status_code == 200
    events = res_events.json()
    assert len(events) > 0
    assert events[0]["event_type"] == "FILE_SAVED"
    
    # 4. Check git history
    res_git = client.get(f"/sessions/{session_id}/git-history", headers={"Authorization": f"Bearer {token_assessor}"})
    assert res_git.status_code == 200
    history = res_git.json()
    assert len(history) > 0
    assert history[0]["message"] == "Candidate updated src/main.py"
    
    # 5. Check git diff
    res_diff = client.get(f"/sessions/{session_id}/diff", headers={"Authorization": f"Bearer {token_assessor}"})
    assert res_diff.status_code == 200
    assert "print('hello')" in res_diff.json()["diff"]
