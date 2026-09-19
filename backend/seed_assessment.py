import os
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config import settings
from models import Assessment, AssessmentStatus, AssessmentDifficulty, User, Role
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if a dummy assessor exists
    assessor = db.query(User).filter(User.email == "assessor@example.com").first()
    if not assessor:
        assessor = User(
            email="assessor@example.com",
            full_name="Example Assessor",
            hashed_password=pwd_context.hash("password123"),
            role=Role.ASSESSOR,
            is_active=True
        )
        db.add(assessor)
        db.commit()
        db.refresh(assessor)
        print("Created dummy assessor")

    # Check if a published assessment exists
    assessment = db.query(Assessment).filter(Assessment.title == "Full-Stack AI Integration Test").first()
    if not assessment:
        assessment = Assessment(
            title="Full-Stack AI Integration Test",
            description="Build a simple React frontend and FastAPI backend that integrates with an LLM provider. The goal is to evaluate your ability to connect the frontend to the backend while managing API keys securely.",
            duration_minutes=90,
            difficulty=AssessmentDifficulty.MEDIUM,
            status=AssessmentStatus.PUBLISHED,
            created_by=assessor.id
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        print("Created published assessment")
    else:
        print("Assessment already exists")

    db.close()

if __name__ == "__main__":
    seed_data()
