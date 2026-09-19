import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db
from agent.tools import AgentTools
from agent.orchestrator import mock_llm_orchestrator

router = APIRouter(prefix="/agent", tags=["agent"])

@router.post("/session", response_model=schemas.AgentSessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    request: schemas.AgentChatNewRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Verify task exists
    task = db.query(models.Task).filter(models.Task.id == request.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    session = models.AgentSession(
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
    session = db.query(models.AgentSession).filter(models.AgentSession.id == request.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session.candidate_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Log User Message
    user_msg = models.AgentMessage(
        session_id=session.id,
        role=models.AgentRole.USER,
        content=request.message
    )
    db.add(user_msg)
    db.commit()

    # Create workspace path for this session
    workspace_dir = f"/tmp/workspace_{session.task_id}_{session.candidate_id}"
    tools = AgentTools(workspace_dir)

    # Invoke Mock Orchestrator
    agent_response_text, tool_calls_data = mock_llm_orchestrator(request.message, tools)

    # Log Agent Message
    agent_msg = models.AgentMessage(
        session_id=session.id,
        role=models.AgentRole.AGENT,
        content=agent_response_text
    )
    db.add(agent_msg)
    db.commit()
    db.refresh(agent_msg)

    # Log Tool Calls
    response_tool_calls = []
    for tc in tool_calls_data:
        tool_call = models.AgentToolCall(
            session_id=session.id,
            message_id=agent_msg.id,
            tool_name=tc["tool_name"],
            arguments=tc["arguments"],
            result=tc["result"],
            success=tc["success"]
        )
        db.add(tool_call)
        response_tool_calls.append(
            schemas.AgentToolCallResponse(
                tool_name=tc["tool_name"],
                arguments=tc["arguments"],
                result=tc["result"],
                success=tc["success"]
            )
        )
    db.commit()

    return schemas.AgentChatApiResponse(
        session_id=session.id,
        response=agent_response_text,
        tool_calls=response_tool_calls
    )
