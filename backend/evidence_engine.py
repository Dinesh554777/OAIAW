import json
from typing import List, Dict, Any
import models
import schemas
from sqlalchemy.orm import Session
from datetime import datetime, timezone

def record_event(
    db: Session,
    session_id: int,
    actor: models.EventActor,
    event_type: models.EventType,
    metadata: Dict[str, Any] = None,
    source: str = "workspace"
) -> models.AssessmentEvent:
    
    # Get last sequence number
    last_event = db.query(models.AssessmentEvent).filter(
        models.AssessmentEvent.assessment_session_id == session_id
    ).order_by(models.AssessmentEvent.sequence_number.desc()).first()
    
    seq_num = 1 if not last_event else (last_event.sequence_number or 0) + 1
    
    new_event = models.AssessmentEvent(
        assessment_session_id=session_id,
        event_type=event_type,
        actor=actor,
        source=source,
        sequence_number=seq_num,
        metadata_json=metadata,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

def record_events(
    db: Session,
    session_id: int,
    actor: models.EventActor,
    events_data: List[Dict[str, Any]]
) -> List[models.AssessmentEvent]:
    
    if not events_data:
        return []
        
    last_event = db.query(models.AssessmentEvent).filter(
        models.AssessmentEvent.assessment_session_id == session_id
    ).order_by(models.AssessmentEvent.sequence_number.desc()).first()
    
    seq_num = 1 if not last_event else (last_event.sequence_number or 0) + 1
    
    new_events = []
    timestamp = datetime.now(timezone.utc)
    
    for event_data in events_data:
        new_event = models.AssessmentEvent(
            assessment_session_id=session_id,
            event_type=event_data["event_type"],
            actor=actor,
            source=event_data.get("source", "workspace"),
            sequence_number=seq_num,
            metadata_json=event_data.get("metadata"),
            timestamp=timestamp
        )
        new_events.append(new_event)
        seq_num += 1
        
    db.add_all(new_events)
    db.commit()
    for e in new_events:
        db.refresh(e)
        
    return new_events

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

def generate_timeline_summary(events: List[models.AssessmentEvent]) -> schemas.SessionTimelineSummary:
    if not events:
        return schemas.SessionTimelineSummary(
            duration_seconds=0, files_modified=0, ai_interactions=0,
            ai_tools_approved=0, ai_tools_rejected=0, test_runs=0,
            successful_test_runs=0, failed_test_runs=0, git_commits=0, total_events=0
        )
        
    start_time = min(e.timestamp for e in events)
    end_time = max(e.timestamp for e in events)
    duration = int((end_time - start_time).total_seconds())
    
    files_modified = len(set(
        e.metadata_json.get("path") or e.metadata_json.get("file_path") 
        for e in events 
        if e.event_type == models.EventType.FILE_EDITED and e.metadata_json
    ))
    
    return schemas.SessionTimelineSummary(
        duration_seconds=duration,
        files_modified=files_modified,
        ai_interactions=sum(1 for e in events if e.event_type in [models.EventType.AI_MESSAGE_SENT, models.EventType.AI_RESPONSE_RECEIVED]),
        ai_tools_approved=sum(1 for e in events if e.event_type == models.EventType.AI_TOOL_APPROVED),
        ai_tools_rejected=sum(1 for e in events if e.event_type == models.EventType.AI_TOOL_REJECTED),
        test_runs=sum(1 for e in events if e.event_type == models.EventType.TEST_RUN_COMPLETED),
        successful_test_runs=sum(1 for e in events if e.event_type == models.EventType.TEST_PASSED),
        failed_test_runs=sum(1 for e in events if e.event_type == models.EventType.TEST_FAILED),
        git_commits=sum(1 for e in events if e.event_type == models.EventType.GIT_COMMIT),
        total_events=len(events)
    )
