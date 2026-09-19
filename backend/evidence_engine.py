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

    if new_events:
        db.add_all(new_events)
        db.commit()
        for e in new_events:
            db.refresh(e)
    
    return new_events

def get_timeline(db: Session, session_id: int) -> dict:
    events = db.query(models.AssessmentEvent).filter(
        models.AssessmentEvent.assessment_session_id == session_id
    ).order_by(models.AssessmentEvent.sequence_number.asc()).all()

    # Calculate Summary
    duration = 0
    if events:
        try:
            start_time = events[0].timestamp
            end_time = events[-1].timestamp
            duration = int((end_time - start_time).total_seconds())
        except:
            pass

    files_modified = len([e for e in events if e.event_type == models.EventType.CODE_CHANGE])
    ai_interactions = len([e for e in events if e.event_type in (models.EventType.AI_MESSAGE_SENT, models.EventType.AI_RESPONSE_RECEIVED)])
    ai_approved = len([e for e in events if e.event_type == models.EventType.AI_TOOL_APPROVED])
    ai_rejected = len([e for e in events if e.event_type == models.EventType.AI_TOOL_REJECTED])
    test_runs = len([e for e in events if e.event_type == models.EventType.TEST_RUN_COMPLETED])
    tests_passed = len([e for e in events if e.event_type == models.EventType.TEST_PASSED])
    tests_failed = len([e for e in events if e.event_type == models.EventType.TEST_FAILED])
    git_commits = len([e for e in events if e.event_type == models.EventType.GIT_COMMIT])

    summary = {
        "duration_seconds": duration,
        "files_modified": files_modified,
        "ai_interactions": ai_interactions,
        "ai_tools_approved": ai_approved,
        "ai_tools_rejected": ai_rejected,
        "test_runs": test_runs,
        "successful_test_runs": tests_passed,
        "failed_test_runs": tests_failed,
        "git_commits": git_commits,
        "total_events": len(events)
    }

    # Format events
    formatted_events = []
    for e in events:
        formatted_events.append({
            "id": e.id,
            "sequence_number": e.sequence_number or 0,
            "event_type": e.event_type,
            "timestamp": e.timestamp,
            "metadata_json": e.metadata_json,
            "source": e.source,
            "actor": e.actor
        })

    return {
        "session_id": session_id,
        "summary": summary,
        "events": formatted_events
    }


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
