from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime
from models import Role, Difficulty, AssessmentStatus, TaskType, EventType

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.CANDIDATE

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    repository_url: Optional[str] = None
    starter_repository: Optional[str] = None
    task_type: TaskType = TaskType.FEATURE
    constraints: Optional[str] = None

class TaskResponse(TaskCreate):
    id: int
    assessment_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AssessmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration_minutes: int = 60
    difficulty: Difficulty = Difficulty.INTERMEDIATE
    status: AssessmentStatus = AssessmentStatus.DRAFT

class AssessmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    difficulty: Optional[Difficulty] = None
    status: Optional[AssessmentStatus] = None

class AssessmentResponse(AssessmentCreate):
    id: int
    created_by: int
    created_at: datetime
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True
class WorkspaceEventCreate(BaseModel):
    task_id: int
    event_type: EventType
    payload: str

class WorkspaceEventResponse(WorkspaceEventCreate):
    id: int
    candidate_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AgentChatRequest(BaseModel):
    message: str

class AgentChatResponse(BaseModel):
    response: str
class AgentChatNewRequest(BaseModel):
    task_id: int

class AgentSessionResponse(BaseModel):
    id: int
    task_id: int
    candidate_id: int

    class Config:
        from_attributes = True

class AgentChatApiRequest(BaseModel):
    session_id: int
    message: str

class AgentToolCallResponse(BaseModel):
    tool_name: str
    arguments: str
    result: Optional[str]
    success: int

    class Config:
        from_attributes = True

class AgentMessageResponse(BaseModel):
    id: int
    role: str
    content: Optional[str]
    tool_calls: List[AgentToolCallResponse] = []

    class Config:
        from_attributes = True

class AgentChatApiResponse(BaseModel):
    session_id: int
    response: str
    tool_calls: List[AgentToolCallResponse] = []
