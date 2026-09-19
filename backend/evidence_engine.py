import json
import models
from sqlalchemy.orm import Session

def generate_evidence(db: Session, session_id: int):
    # Retrieve all events for the session ordered by time
    events = db.query(models.AssessmentEvent).filter(
        models.AssessmentEvent.assessment_session_id == session_id
    ).order_by(models.AssessmentEvent.timestamp.asc()).all()
    
    # We will build evidence by iterating through events and looking for specific state transitions
    new_evidence = []
    
    i = 0
    while i < len(events):
        event = events[i]
        
        # 1. AI Assistance -> Code Change
        if event.event_type == models.EventType.AI_MESSAGE and event.actor == models.EventActor.CANDIDATE:
            # Look ahead for AI response + Tool Call + File Edit
            # In a simplified heuristic, if AI_TOOL_CALL is followed by FILE_EDITED within a short window
            has_tool_call = False
            has_file_edit = False
            related_ids = [event.id]
            file_name = "a file"
            
            for j in range(i + 1, min(i + 5, len(events))):
                next_e = events[j]
                if next_e.event_type == models.EventType.AI_TOOL_CALL:
                    has_tool_call = True
                    related_ids.append(next_e.id)
                if next_e.event_type == models.EventType.FILE_EDITED:
                    has_file_edit = True
                    related_ids.append(next_e.id)
                    try:
                        meta = json.loads(next_e.metadata_json)
                        file_name = meta.get("path", file_name)
                    except:
                        pass
                        
                if has_tool_call and has_file_edit:
                    new_evidence.append(models.Evidence(
                        session_id=session_id,
                        evidence_type=models.EvidenceType.AI_ASSISTANCE,
                        source_event_ids=json.dumps(related_ids),
                        description=f"Candidate modified {file_name} following AI interaction.",
                        confidence=0.9
                    ))
                    i = j # skip ahead
                    break
                    
        # 2. Code Change -> Testing
        elif event.event_type == models.EventType.FILE_EDITED and getattr(event, 'processed_testing', False) == False:
            related_ids = [event.id]
            file_name = "a file"
            try:
                meta = json.loads(event.metadata_json)
                file_name = meta.get("path", file_name)
            except:
                pass
                
            for j in range(i + 1, min(i + 4, len(events))):
                next_e = events[j]
                if next_e.event_type == models.EventType.TEST_COMPLETED:
                    related_ids.append(next_e.id)
                    new_evidence.append(models.Evidence(
                        session_id=session_id,
                        evidence_type=models.EvidenceType.TESTING,
                        source_event_ids=json.dumps(related_ids),
                        description=f"Candidate ran tests after modifying {file_name}.",
                        confidence=0.95
                    ))
                    # Mark so we don't duplicate
                    next_e.processed_testing = True
                    break
        i += 1
        
    if new_evidence:
        db.add_all(new_evidence)
        db.commit()
