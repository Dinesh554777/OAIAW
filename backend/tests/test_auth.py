import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from database import Base, get_db
from models import Role

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

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
    
def test_register():
    response = client.post(
        "/auth/register",
        json={"name": "Test User", "email": "test@example.com", "password": "password123", "role": "CANDIDATE"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "password" not in data

def test_login():
    client.post(
        "/auth/register",
        json={"name": "Test User", "email": "test2@example.com", "password": "password123"}
    )
    response = client.post(
        "/auth/login",
        json={"email": "test2@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_invalid_password():
    client.post(
        "/auth/register",
        json={"name": "Test User", "email": "test3@example.com", "password": "password123"}
    )
    response = client.post(
        "/auth/login",
        json={"email": "test3@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_protected_endpoint():
    # Register and login
    client.post(
        "/auth/register",
        json={"name": "Test User", "email": "test4@example.com", "password": "password123"}
    )
    login_response = client.post(
        "/auth/login",
        json={"email": "test4@example.com", "password": "password123"}
    )
    token = login_response.json()["access_token"]
    
    # Access protected endpoint
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test4@example.com"

def test_unauthorized_access():
    response = client.get("/auth/me")
    assert response.status_code == 401
