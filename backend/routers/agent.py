import os
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db
from agent.tools import AgentTools
from agent.orchestrator import mock_llm_orchestrator
from git_integration import git_commit
from policy import ControlledEnvironmentPolicy
from claim_verifier import ClaimVerifier

router = APIRouter(prefix="/agent", tags=["agent"])

@router.post("/session", response_model=schemas.AssessmentSessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    request: schemas.AgentChatNewRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    task = db.query(models.Task).filter(models.Task.id == request.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    session = db.query(models.AssessmentSession).filter(
        models.AssessmentSession.task_id == request.task_id,
        models.AssessmentSession.candidate_id == current_user.id
    ).first()
    
    if not session:
        session = models.AssessmentSession(
            task_id=request.task_id,
            candidate_id=current_user.id
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    return session

@router.post("/chat", response_model=schemas.AgentChatApiResponse)
def chat_with_agent(
    request: schemas.AgentChatApiRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    session = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == request.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session.candidate_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Log User Message as AgentMessage and AssessmentEvent
    user_msg = models.AgentMessage(session_id=session.id, role=models.AgentRole.USER, content=request.message)
    db.add(user_msg)
    
    db.add(models.AssessmentEvent(
        assessment_session_id=session.id,
        actor=models.EventActor.CANDIDATE,
        event_type=models.EventType.AI_MESSAGE,
        metadata_json=json.dumps({"message": request.message})
    ))
    db.commit()

    workspace_dir = f"/tmp/workspace_{session.task_id}_{session.candidate_id}"
    policy = ControlledEnvironmentPolicy(db, session.id)
    tools = AgentTools(workspace_dir, policy=policy)

    # Invoke Mock Orchestrator
    agent_response_text, tool_calls_data = mock_llm_orchestrator(request.message, tools)
    
    # Extract AI Claims
    verifier = ClaimVerifier(db, session.id)
    claims = verifier.extract_and_record_claims(agent_response_text)
    

    agent_msg = models.AgentMessage(session_id=session.id, role=models.AgentRole.AGENT, content=agent_response_text)
    db.add(agent_msg)
    
    db.add(models.AssessmentEvent(
        assessment_session_id=session.id,
        actor=models.EventActor.AGENT,
        event_type=models.EventType.AI_MESSAGE,
        metadata_json=json.dumps({"message": agent_response_text})
    ))
    db.commit()
    db.refresh(agent_msg)

    response_tool_calls = []
    made_changes = False
    for tc in tool_calls_data:
        tool_call = models.AgentToolCall(
            session_id=session.id, message_id=agent_msg.id,
            tool_name=tc["tool_name"], arguments=tc["arguments"],
            result=tc["result"], success=tc["success"]
        )
        db.add(tool_call)
        
        db.add(models.AssessmentEvent(
            assessment_session_id=session.id,
            actor=models.EventActor.AGENT,
            event_type=models.EventType.AI_TOOL_CALL,
            metadata_json=json.dumps({"tool": tc["tool_name"], "args": tc["arguments"]})
        ))
        
        if tc["tool_name"] in ["write_file", "apply_patch"]:
            made_changes = True

        response_tool_calls.append(
            schemas.AgentToolCallResponse(
                tool_name=tc["tool_name"], arguments=tc["arguments"],
                result=tc["result"], success=tc["success"]
            )
        )
    db.commit()
    # Verify Claims against the collected tool calls
    verifier.verify_claims_against_tools(claims, tool_calls_data)

    if made_changes:
        git_commit(workspace_dir, "AI Agent made code changes", "AI Agent", "agent@oaiaw.com")

    return schemas.AgentChatApiResponse(
        session_id=session.id,
        response=agent_response_text,
        tool_calls=response_tool_calls
    )
