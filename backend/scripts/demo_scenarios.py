import os
import sys
import json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import SessionLocal, engine, Base
import models
from policy import ControlledEnvironmentPolicy, PolicyViolationError
from sandbox import SandboxExecutor, SandboxSecurityError
from agent.tools import AgentTools
from claim_verifier import ClaimVerifier

def setup_demo_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Create mock user
    user = db.query(models.User).filter_by(email="demo@oaiaw.com").first()
    if not user:
        user = models.User(email="demo@oaiaw.com", password_hash="hash", full_name="Demo User")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create mock assessment
    assessment = db.query(models.Assessment).filter_by(title="Demo Assessment").first()
    if not assessment:
        assessment = models.Assessment(title="Demo Assessment", created_by=user.id)
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        
    # Create mock task
    task = db.query(models.Task).filter_by(title="Demo Task").first()
    if not task:
        task = models.Task(assessment_id=assessment.id, title="Demo Task")
        db.add(task)
        db.commit()
        db.refresh(task)

    # Create mock session
    session = db.query(models.AssessmentSession).filter_by(task_id=task.id, candidate_id=user.id).first()
    if not session:
        session = models.AssessmentSession(assessment_id=assessment.id, task_id=task.id, candidate_id=user.id)
        db.add(session)
        db.commit()
        db.refresh(session)

    # Ensure a restrictive policy
    policy = db.query(models.EnvironmentPolicy).filter_by(assessment_id=assessment.id).first()
    if not policy:
        policy = models.EnvironmentPolicy(
            assessment_id=assessment.id,
            network_enabled=False,
            allow_shell=False,
            allow_secret_access=False
        )
        db.add(policy)
        db.commit()
        db.refresh(policy)
        
    return db, session.id

def run_scenario_1(db, session_id):
    print("\n--- Scenario 1: Hallucinated test claim ---")
    verifier = ClaimVerifier(db, session_id)
    
    ai_response = "I have fixed the issue. All tests pass successfully."
    claims = verifier.extract_and_record_claims(ai_response)
    
    tool_calls = [{
        "tool_name": "run_tests",
        "result": {"status": "failed", "output": "1 test failed."}
    }]
    
    verifier.verify_claims_against_tools(claims, tool_calls)
    
    for claim in claims:
        print(f"Claim: '{claim.claim}' -> Status: {claim.status.value}")

def run_scenario_2_and_3(db, session_id):
    print("\n--- Scenario 2 & 3: Unauthorized file access & Secrets ---")
    policy = ControlledEnvironmentPolicy(db, session_id)
    tools = AgentTools("/tmp/demo_workspace", policy=policy)
    
    result = json.loads(tools.read_file("../other_candidate/.env"))
    print(f"Attempting to read outside workspace (.env): {result}")
    
    result2 = json.loads(tools.read_file(".env"))
    print(f"Attempting to read secret file in workspace: {result2}")

def run_scenario_5(db, session_id):
    print("\n--- Scenario 5: Network restriction (Mocked) ---")
    policy = ControlledEnvironmentPolicy(db, session_id)
    try:
        policy.check_network_access("google.com")
    except PolicyViolationError as e:
        print(f"Network request denied: {e}")

if __name__ == "__main__":
    db, session_id = setup_demo_db()
    run_scenario_1(db, session_id)
    run_scenario_2_and_3(db, session_id)
    run_scenario_5(db, session_id)
    print("\n--- Demo Scenarios Completed ---")
