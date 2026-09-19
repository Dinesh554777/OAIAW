from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from git_integration import get_git_history, get_git_diff

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.get("/{session_id}/events")
def get_session_events(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.Role.ASSESSOR, models.Role.ADMIN]))
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return session.events

@router.get("/{session_id}/git-history")
def get_session_git_history(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.Role.ASSESSOR, models.Role.ADMIN]))
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    workspace_dir = f"/tmp/workspace_{session.task_id}_{session.candidate_id}"
    return get_git_history(workspace_dir)

@router.get("/{session_id}/diff")
def get_session_git_diff(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.Role.ASSESSOR, models.Role.ADMIN]))
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    workspace_dir = f"/tmp/workspace_{session.task_id}_{session.candidate_id}"
    return {"diff": get_git_diff(workspace_dir)}
@router.get("/{session_id}/evidence", response_model=list[schemas.EvidenceResponse])
def get_evidence(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session.evidence
