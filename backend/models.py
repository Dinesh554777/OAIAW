from sqlalchemy import Column, Integer, String, Float, Enum as SQLEnum, DateTime, ForeignKey, Text
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
    FILE_CREATED = "FILE_CREATED"
    FILE_DELETED = "FILE_DELETED"
    AI_MESSAGE = "AI_MESSAGE"
    AI_TOOL_CALL = "AI_TOOL_CALL"
    TEST_STARTED = "TEST_STARTED"
    TEST_COMPLETED = "TEST_COMPLETED"
    TEST_FAILED = "TEST_FAILED"
    TEST_PASSED = "TEST_PASSED"
    CODE_CHANGE = "CODE_CHANGE"
    SUBMITTED = "SUBMITTED"

class EventActor(str, enum.Enum):
    CANDIDATE = "CANDIDATE"
    AGENT = "AGENT"
    SYSTEM = "SYSTEM"

class AgentRole(str, enum.Enum):
    USER = "USER"
    AGENT = "AGENT"
    TOOL = "TOOL"

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

class SessionStatus(str, enum.Enum):
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"

class EvalStatus(str, enum.Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"

class TestStatus(str, enum.Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    ERROR = "ERROR"

class TestCategory(str, enum.Enum):
    FUNCTIONAL = "FUNCTIONAL"
    EDGE_CASE = "EDGE_CASE"
    REGRESSION = "REGRESSION"
    CODE_QUALITY = "CODE_QUALITY"

class EvidenceType(str, enum.Enum):
    REQUIREMENT_INTERACTION = "REQUIREMENT_INTERACTION"
    CODE_CHANGE = "CODE_CHANGE"
    AI_ASSISTANCE = "AI_ASSISTANCE"
    AI_VALIDATION = "AI_VALIDATION"
    TESTING = "TESTING"
    DEBUGGING = "DEBUGGING"
    ITERATION = "ITERATION"
    FINAL_SUBMISSION = "FINAL_SUBMISSION"

class AssessmentSession(Base):
    __tablename__ = "assessment_sessions"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(SQLEnum(SessionStatus), default=SessionStatus.IN_PROGRESS, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    events = relationship("AssessmentEvent", back_populates="session", cascade="all, delete-orphan")
    messages = relationship("AgentMessage", back_populates="session", cascade="all, delete-orphan")
    tool_calls = relationship("AgentToolCall", back_populates="session", cascade="all, delete-orphan")
    evaluations = relationship("EvaluationRun", back_populates="session", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="session", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("assessment_sessions.id"), nullable=False)
    evidence_type = Column(SQLEnum(EvidenceType), nullable=False)
    source_event_ids = Column(String, nullable=True) # Storing JSON array string
    description = Column(Text, nullable=False)
    confidence = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("AssessmentSession", back_populates="evidence")

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(SQLEnum(TestCategory), nullable=False)
    is_hidden = Column(Integer, default=0) # boolean 0/1

class EvaluationRun(Base):
    __tablename__ = "evaluation_runs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("assessment_sessions.id"), nullable=False)
    status = Column(SQLEnum(EvalStatus), default=EvalStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    session = relationship("AssessmentSession", back_populates="evaluations")
    results = relationship("TestResult", back_populates="run", cascade="all, delete-orphan")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_run_id = Column(Integer, ForeignKey("evaluation_runs.id"), nullable=False)
    test_case_id = Column(Integer, ForeignKey("test_cases.id"), nullable=False)
    status = Column(SQLEnum(TestStatus), nullable=False)
    execution_time = Column(Float, nullable=True)
    output_summary = Column(Text, nullable=True)
    failure_summary = Column(Text, nullable=True)

    run = relationship("EvaluationRun", back_populates="results")
    test_case = relationship("TestCase")

class AssessmentEvent(Base):
    __tablename__ = "assessment_events"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), nullable=False)
    event_type = Column(SQLEnum(EventType), nullable=False)
    actor = Column(SQLEnum(EventActor), nullable=False)
    metadata_json = Column(String, nullable=True) # Storing JSON as string
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    session = relationship("AssessmentSession", back_populates="events")

class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("assessment_sessions.id"), nullable=False)
    role = Column(SQLEnum(AgentRole), nullable=False)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("AssessmentSession", back_populates="messages")
    tool_calls = relationship("AgentToolCall", back_populates="message")

class AgentToolCall(Base):
    __tablename__ = "agent_tool_calls"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("assessment_sessions.id"), nullable=False)
    message_id = Column(Integer, ForeignKey("agent_messages.id"), nullable=True)
    tool_name = Column(String, nullable=False)
    arguments = Column(String, nullable=True) # JSON string
    result = Column(String, nullable=True)    # JSON string
    success = Column(Integer, default=1)      # 1/0 for boolean in SQLite
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("AssessmentSession", back_populates="tool_calls")
    message = relationship("AgentMessage", back_populates="tool_calls")

