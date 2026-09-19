from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from evaluator import run_evaluation

router = APIRouter(prefix="/sessions", tags=["evaluation"])

from evidence_engine import generate_evidence

@router.post("/{session_id}/evaluate", response_model=schemas.EvaluationRunResponse)
def evaluate_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if current_user.role == models.Role.CANDIDATE and session.candidate_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Lock workspace
    session.status = models.SessionStatus.SUBMITTED
    db.commit()
    
    # Create evaluation run
    run = models.EvaluationRun(
        session_id=session.id,
        status=models.EvalStatus.PENDING
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    
    # Trigger synchronous evaluation for prototype
    run_evaluation(db, run.id)
    generate_evidence(db, session.id)
    db.refresh(run)
    
    return run

@router.get("/{session_id}/evaluation", response_model=list[schemas.EvaluationRunResponse])
def get_evaluations(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if current_user.role == models.Role.CANDIDATE and session.candidate_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # We could filter out hidden test cases for CANDIDATE here, but keeping it simple for prototype.
    return session.evaluations
