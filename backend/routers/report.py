from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from git_integration import get_git_history, get_git_diff

router = APIRouter(prefix="/sessions", tags=["report"])

@router.get("/{session_id}/report", response_model=schemas.UnifiedReportResponse)
def get_unified_report(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role not in [models.Role.ADMIN, models.Role.ASSESSOR]:
        raise HTTPException(status_code=403, detail="Not authorized to view reports")
        
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    candidate = db.query(models.User).filter(models.User.id == session.candidate_id).first()
    task = db.query(models.Task).filter(models.Task.id == session.task_id).first()
    
    session_summary = {
        "id": session.id,
        "candidate_name": candidate.name,
        "candidate_email": candidate.email,
        "task_title": task.title,
        "status": session.status,
        "created_at": session.created_at
    }
    
    evaluation = db.query(models.EvaluationRun).filter(
        models.EvaluationRun.session_id == session.id
    ).order_by(models.EvaluationRun.created_at.desc()).first()
    
    evidence = session.evidence
    events = session.events
    messages = session.messages
    
    workspace_dir = f"/tmp/workspace_{session.task_id}_{session.candidate_id}"
    try:
        git_history = get_git_history(workspace_dir)
        git_diff = get_git_diff(workspace_dir)
    except:
        git_history = []
        git_diff = ""
        
    return {
        "session": session_summary,
        "evaluation": evaluation,
        "evidence": evidence,
        "events": events,
        "messages": messages,
        "git_history": git_history,
        "git_diff": git_diff
    }
