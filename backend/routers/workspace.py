from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import models, schemas, auth
import json
from database import get_db
from git_integration import init_git_repo, git_commit

router = APIRouter(prefix="/workspace", tags=["workspace"])

def get_or_create_session(task_id: int, db: Session, current_user: models.User):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.role == models.Role.CANDIDATE and task.assessment.status != models.AssessmentStatus.PUBLISHED:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    session = db.query(models.AssessmentSession).filter(
        models.AssessmentSession.task_id == task_id,
        models.AssessmentSession.candidate_id == current_user.id
    ).first()
    
    if not session:
        session = models.AssessmentSession(task_id=task_id, candidate_id=current_user.id)
        db.add(session)
        db.commit()
        db.refresh(session)
        
    return session

@router.get("/{task_id}/files")
def get_files(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    session = get_or_create_session(task_id, db, current_user)
    
    workspace_dir = f"/tmp/workspace_{task_id}_{current_user.id}"
    init_git_repo(workspace_dir)

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

@router.post("/{task_id}/save", response_model=schemas.AssessmentEventResponse)
def save_file(
    task_id: int, 
    payload: dict,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    session = get_or_create_session(task_id, db, current_user)
    if session.status == models.SessionStatus.SUBMITTED:
        raise HTTPException(status_code=403, detail="Workspace is locked after submission")
    
    # Log event
    event = models.AssessmentEvent(
        assessment_session_id=session.id,
        actor=models.EventActor.CANDIDATE,
        event_type=models.EventType.FILE_EDITED,
        metadata_json=json.dumps(payload)
    )
    db.add(event)
    
    # Git integration
    workspace_dir = f"/tmp/workspace_{task_id}_{current_user.id}"
    # The file saving itself is mocked for now in the frontend state, 
    # but let's actually write it here to trigger git changes
    import os
    path = payload.get('path', '')
    content = payload.get('content', '')
    if path:
        abs_p = os.path.join(workspace_dir, path)
        os.makedirs(os.path.dirname(abs_p), exist_ok=True)
        with open(abs_p, 'w') as f:
            f.write(content)
        
        git_commit(workspace_dir, f"Candidate updated {path}", current_user.name, current_user.email)
        
    db.commit()
    db.refresh(event)
    return event

@router.post("/{task_id}/run-tests", response_model=schemas.AssessmentEventResponse)
def run_tests(
    task_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    session = get_or_create_session(task_id, db, current_user)
    if session.status == models.SessionStatus.SUBMITTED:
        raise HTTPException(status_code=403, detail="Workspace is locked after submission")
    event = models.AssessmentEvent(
        assessment_session_id=session.id,
        actor=models.EventActor.CANDIDATE,
        event_type=models.EventType.TEST_COMPLETED,
        metadata_json=json.dumps({"action": "run_tests"})
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
