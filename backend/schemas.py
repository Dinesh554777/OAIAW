from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime
from models import Role, Difficulty, AssessmentStatus, TaskType, EventType, EventActor

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

class AssessmentEventCreate(BaseModel):
    assessment_session_id: int
    event_type: EventType
    actor: EventActor
    metadata_json: Optional[str] = None

class AssessmentEventResponse(AssessmentEventCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AssessmentSessionResponse(BaseModel):
    id: int
    task_id: int
    candidate_id: int

    class Config:
        from_attributes = True

class AgentChatRequest(BaseModel):
    message: str

class AgentChatResponse(BaseModel):
    response: str

class AgentChatNewRequest(BaseModel):
    task_id: int

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
from models import SessionStatus, EvalStatus, TestStatus, TestCategory

class TestCaseResponse(BaseModel):
    id: int
    task_id: int
    name: str
    category: TestCategory
    is_hidden: int

    class Config:
        from_attributes = True

class TestResultResponse(BaseModel):
    id: int
    test_case_id: int
    status: TestStatus
    execution_time: Optional[float]
    output_summary: Optional[str]
    failure_summary: Optional[str]

    class Config:
        from_attributes = True

class EvaluationRunResponse(BaseModel):
    id: int
    session_id: int
    status: EvalStatus
    created_at: datetime
    completed_at: Optional[datetime]
    results: List[TestResultResponse] = []

    class Config:
        from_attributes = True
from models import EvidenceType

class EvidenceResponse(BaseModel):
    id: int
    session_id: int
    evidence_type: EvidenceType
    source_event_ids: Optional[str]
    description: str
    confidence: Optional[float]
    timestamp: datetime

    class Config:
        from_attributes = True
from git_integration import get_git_history, get_git_diff

class ReportSessionSummary(BaseModel):
    id: int
    candidate_name: str
    candidate_email: str
    task_title: str
    status: SessionStatus
    created_at: datetime
    
class EvidencePoint(BaseModel):
    description: str
    event_ids: List[int]

class AIAssessmentSummaryResponse(BaseModel):
    id: int
    session_id: int
    task_summary: str
    implementation_summary: str
    testing_summary: str
    ai_usage_summary: str
    debugging_summary: str
    evidence_points: str # JSON string for now
    created_at: datetime

    class Config:
        from_attributes = True
class UnifiedReportResponse(BaseModel):
    session: ReportSessionSummary
    evaluation: Optional[EvaluationRunResponse]
    evidence: List[EvidenceResponse]
    events: List[AssessmentEventResponse]
    messages: List[AgentMessageResponse]
    git_history: List[dict]
    git_diff: str
    ai_summary: Optional[AIAssessmentSummaryResponse] = None
