import json
import models
from sqlalchemy.orm import Session

def generate_ai_summary(db: Session, session_id: int) -> models.AIAssessmentSummary:
    # Fetch session and related data
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        return None
        
    # In a production environment, this function would compile the evidence and logs 
    # and send them to OpenAI/Anthropic using a strict JSON schema prompt to extract the summary.
    
    # For the prototype, we use a deterministic mock generator to ensure it runs without API keys.
    # We will build the summary based on the existing evidence records.
    evidence_records = session.evidence
    
    # Extract some basic stats
    test_runs = sum(1 for e in evidence_records if e.evidence_type == models.EvidenceType.TESTING)
    ai_helps = sum(1 for e in evidence_records if e.evidence_type == models.EvidenceType.AI_ASSISTANCE)
    
    points = []
    for ev in evidence_records:
        try:
            ids = json.loads(ev.source_event_ids)
        except:
            ids = []
        points.append({
            "description": ev.description,
            "event_ids": ids
        })
        
    # If no points, we provide a default
    if not points:
        points = [{"description": "Candidate completed the task with no observable evidence patterns.", "event_ids": []}]
        
    summary = models.AIAssessmentSummary(
        session_id=session.id,
        task_summary=f"The candidate worked on the assigned engineering task.",
        implementation_summary="The candidate made code modifications as requested by the task constraints.",
        testing_summary=f"The candidate executed the test suite {test_runs} times.",
        ai_usage_summary=f"The candidate utilized the AI coding agent {ai_helps} times for assistance.",
        debugging_summary="The candidate responded to test failures by iterating on the implementation.",
        evidence_points=json.dumps(points)
    )
    
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary
