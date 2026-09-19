import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal
import models
from auth import get_password_hash

def seed_db():
    db = SessionLocal()
    print("Seeding database...")
    
    # 1. Users
    admin = models.User(email="admin@oaiaw.com", password_hash=get_password_hash("password123"), full_name="System Admin", role=models.Role.ADMIN)
    assessor = models.User(email="assessor@oaiaw.com", password_hash=get_password_hash("password123"), full_name="Senior Assessor", role=models.Role.ASSESSOR)
    candidate = models.User(email="candidate@oaiaw.com", password_hash=get_password_hash("password123"), full_name="Test Candidate", role=models.Role.CANDIDATE)
    
    db.add(admin)
    db.add(assessor)
    db.add(candidate)
    db.commit()
    db.refresh(admin)
    db.refresh(assessor)
    db.refresh(candidate)
    print("Users created.")
    
    # 2. Assessment
    assessment = models.Assessment(
        title="AI-Assisted Backend Debugging Assessment",
        description="Fix authentication bugs using AI tools.",
        status=models.AssessmentStatus.PUBLISHED,
        created_by=assessor.id
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    print("Assessment created.")
    
    # 3. Task
    task = models.Task(
        assessment_id=assessment.id,
        title="Fix Authentication Failure",
        description="The login route always returns 401. Use AI to fix it.",
        task_type=models.TaskType.BUG_FIX
    )
    db.add(task)
    db.commit()
    print("Seed complete!")
    db.close()

if __name__ == "__main__":
    seed_db()
