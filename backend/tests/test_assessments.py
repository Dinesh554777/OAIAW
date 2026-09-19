import pytest
from fastapi.testclient import TestClient
from main import app
from database import Base, get_db
from models import Role, Difficulty, AssessmentStatus, TaskType
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

def test_create_assessment_as_assessor():
    token = get_auth_token("ASSESSOR")
    res = client.post("/assessments", headers={"Authorization": f"Bearer {token}"}, json={
        "title": "React Challenge",
        "duration_minutes": 120,
        "difficulty": "INTERMEDIATE",
        "status": "DRAFT"
    })
    assert res.status_code == 201
    assert res.json()["title"] == "React Challenge"

def test_create_assessment_as_candidate():
    token = get_auth_token("CANDIDATE")
    res = client.post("/assessments", headers={"Authorization": f"Bearer {token}"}, json={
        "title": "React Challenge"
    })
    assert res.status_code == 403

def test_add_task_to_assessment():
    token = get_auth_token("ASSESSOR")
    res = client.post("/assessments", headers={"Authorization": f"Bearer {token}"}, json={"title": "Test Assessment"})
    assessment_id = res.json()["id"]

    res_task = client.post(f"/assessments/{assessment_id}/tasks", headers={"Authorization": f"Bearer {token}"}, json={
        "title": "Fix the bug",
        "task_type": "BUG_FIX",
        "repository_url": "https://github.com/test/repo"
    })
    assert res_task.status_code == 201
    assert res_task.json()["title"] == "Fix the bug"

def test_get_assessments_as_candidate():
    token_assessor = get_auth_token("ASSESSOR")
    # create one published and one draft
    client.post("/assessments", headers={"Authorization": f"Bearer {token_assessor}"}, json={"title": "Draft", "status": "DRAFT"})
    client.post("/assessments", headers={"Authorization": f"Bearer {token_assessor}"}, json={"title": "Published", "status": "PUBLISHED"})
    
    token_candidate = get_auth_token("CANDIDATE")
    res = client.get("/assessments", headers={"Authorization": f"Bearer {token_candidate}"})
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.json()[0]["title"] == "Published"
