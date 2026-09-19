from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/workspace", tags=["workspace"])

def verify_task_access(task_id: int, db: Session, current_user: models.User):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.role == models.Role.CANDIDATE and task.assessment.status != models.AssessmentStatus.PUBLISHED:
        raise HTTPException(status_code=403, detail="Not authorized")
    return task

@router.get("/{task_id}/files")
def get_files(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    verify_task_access(task_id, db, current_user)
    # Mock file system for the starter repository
    return {
        "src": {
            "index.js": "console.log('Hello World');",
            "utils.js": "export const add = (a, b) => a + b;"
        },
        "tests": {
            "main.test.js": "test('add', () => { expect(add(1,2)).toBe(3); });"
        },
        "package.json": '{\n  "name": "oaiaw-task",\n  "version": "1.0.0"\n}'
    }

@router.post("/{task_id}/save", response_model=schemas.WorkspaceEventResponse)
def save_file(
    task_id: int, 
    payload: dict,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    verify_task_access(task_id, db, current_user)
    event = models.WorkspaceEvent(
        task_id=task_id,
        candidate_id=current_user.id,
        event_type=models.EventType.FILE_SAVED,
        payload=str(payload)
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.post("/{task_id}/run-tests", response_model=schemas.WorkspaceEventResponse)
def run_tests(
    task_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    verify_task_access(task_id, db, current_user)
    event = models.WorkspaceEvent(
        task_id=task_id,
        candidate_id=current_user.id,
        event_type=models.EventType.TEST_RUN,
        payload='{"output": "PASS  tests/main.test.js\\n  ✓ add (2 ms)\\n\\nTest Suites: 1 passed, 1 total"}'
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.post("/{task_id}/agent/chat", response_model=schemas.WorkspaceEventResponse)
def chat_with_agent(
    task_id: int, 
    request: schemas.AgentChatRequest,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    verify_task_access(task_id, db, current_user)
    
    # Log user message
    user_event = models.WorkspaceEvent(
        task_id=task_id,
        candidate_id=current_user.id,
        event_type=models.EventType.AGENT_MESSAGE,
        payload=str({"sender": "candidate", "message": request.message})
    )
    db.add(user_event)
    
    # Log agent response
    agent_event = models.WorkspaceEvent(
        task_id=task_id,
        candidate_id=current_user.id,
        event_type=models.EventType.AGENT_MESSAGE,
        payload=str({"sender": "agent", "message": f"I can help with that. Based on your codebase, you should look at index.js."})
    )
    db.add(agent_event)
    db.commit()
    db.refresh(agent_event)
    
    return agent_event
