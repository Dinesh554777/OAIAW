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

from typing import List
from evidence_engine import record_event, generate_timeline_summary

@router.post("/{session_id}/events", response_model=schemas.TimelineEventResponse)
def create_session_event(
    session_id: int,
    event_in: schemas.EventIngestRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Security requirement: candidate can only submit events for their own active session
    if current_user.role == models.Role.CANDIDATE:
        if session.candidate_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to submit events for this session")
            
    actor = models.EventActor.CANDIDATE if current_user.role == models.Role.CANDIDATE else models.EventActor.ASSESSOR
            
    event = record_event(
        db=db,
        session_id=session_id,
        actor=actor,
        event_type=event_in.event_type,
        metadata=event_in.metadata,
        source=event_in.source
    )
    return event

@router.post("/{session_id}/events/batch", response_model=List[schemas.TimelineEventResponse])
def create_session_events_batch(
    session_id: int,
    events_in: List[schemas.EventIngestRequest],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    from evidence_engine import record_events
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if current_user.role == models.Role.CANDIDATE:
        if session.candidate_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to submit events for this session")
            
    actor = models.EventActor.CANDIDATE if current_user.role == models.Role.CANDIDATE else models.EventActor.ASSESSOR
            
    events_data = [{"event_type": e.event_type, "metadata": e.metadata, "source": e.source} for e in events_in]
    events = record_events(db=db, session_id=session_id, actor=actor, events_data=events_data)
    return events

@router.get("/{session_id}/timeline", response_model=schemas.TimelineResponse)
def get_session_timeline(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.Role.ASSESSOR, models.Role.ADMIN]))
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    events = db.query(models.AssessmentEvent).filter(
        models.AssessmentEvent.assessment_session_id == session_id
    ).order_by(models.AssessmentEvent.timestamp.asc()).all()
    
    summary = generate_timeline_summary(events)
    
    return schemas.TimelineResponse(
        session_id=session_id,
        summary=summary,
        events=events
    )
