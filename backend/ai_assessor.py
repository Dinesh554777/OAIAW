import json
import models
from sqlalchemy.orm import Session

def generate_ai_summary(db: Session, session_id: int) -> models.AssessmentReport:
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not session:
        raise Exception("Session not found")
        
    summary = models.AssessmentReport(
        assessment_session_id=session.id,
        task_summary=f"The candidate worked on the assigned engineering task.",
        implementation_summary="The candidate made code modifications as requested by the task constraints.",
        testing_summary=f"The candidate executed the test suite.",
        ai_usage_summary=f"The candidate utilized the AI coding agent.",
        debugging_summary="The candidate responded to test failures by iterating on the implementation.",
        generated_by=models.ReportGeneratedBy.ASSESSMENT_AI
    )
    
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary
