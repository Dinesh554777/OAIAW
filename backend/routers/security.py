from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/security", tags=["security"])

@router.get("/events/{session_id}")
def get_security_events(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if current_user.role not in [models.Role.ADMIN, models.Role.ASSESSOR]:
        # Candidates can only see their own limited view, but here we assume assessor view
        if session.candidate_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
            
    events = db.query(models.SecurityEvent).filter(
        models.SecurityEvent.assessment_session_id == session_id
    ).order_by(models.SecurityEvent.timestamp.desc()).all()
    
    return events

@router.get("/claims/{session_id}")
def get_ai_claims(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if current_user.role not in [models.Role.ADMIN, models.Role.ASSESSOR] and session.candidate_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    claims = db.query(models.AIClaim).filter(
        models.AIClaim.assessment_session_id == session_id
    ).order_by(models.AIClaim.created_at.desc()).all()
    
    # We could also fetch ClaimEvidence here, but keeping it simple for the prototype
    result = []
    for c in claims:
        evidence = db.query(models.ClaimEvidence).filter(models.ClaimEvidence.ai_claim_id == c.id).all()
        result.append({
            "id": c.id,
            "claim": c.claim,
            "status": c.status.value,
            "created_at": c.created_at,
            "verified_at": c.verified_at,
            "evidence": [{"text": e.evidence_text} for e in evidence]
        })
    
    return result
