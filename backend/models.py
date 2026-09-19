from sqlalchemy import Column, Integer, String, Enum as SQLEnum, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class Role(str, enum.Enum):
    ADMIN = "ADMIN"
    ASSESSOR = "ASSESSOR"
    CANDIDATE = "CANDIDATE"

class Difficulty(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"

class AssessmentStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class TaskType(str, enum.Enum):
    BUG_FIX = "BUG_FIX"
    FEATURE = "FEATURE"
    REFACTOR = "REFACTOR"
    DEBUGGING = "DEBUGGING"
    CODE_REVIEW = "CODE_REVIEW"

class EventType(str, enum.Enum):
    FILE_OPENED = "FILE_OPENED"
    FILE_EDITED = "FILE_EDITED"
    FILE_SAVED = "FILE_SAVED"
    TEST_RUN = "TEST_RUN"
    AGENT_MESSAGE = "AGENT_MESSAGE"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SQLEnum(Role), default=Role.CANDIDATE, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessments_created = relationship("Assessment", back_populates="creator")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=60)
    difficulty = Column(SQLEnum(Difficulty), default=Difficulty.INTERMEDIATE, nullable=False)
    status = Column(SQLEnum(AssessmentStatus), default=AssessmentStatus.DRAFT, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    creator = relationship("User", back_populates="assessments_created")
    tasks = relationship("Task", back_populates="assessment", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    repository_url = Column(String, nullable=True)
    starter_repository = Column(String, nullable=True)
    task_type = Column(SQLEnum(TaskType), default=TaskType.FEATURE, nullable=False)
    constraints = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessment = relationship("Assessment", back_populates="tasks")

class WorkspaceEvent(Base):
    __tablename__ = "workspace_events"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_type = Column(SQLEnum(EventType), nullable=False)
    payload = Column(String, nullable=True) # Storing JSON as string for simplicity across DBs
    created_at = Column(DateTime(timezone=True), server_default=func.now())

