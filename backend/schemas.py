from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime
from models import Role, Difficulty, AssessmentStatus, TaskType

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
