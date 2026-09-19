from sqlalchemy import Column, Integer, String, Float, Enum as SQLEnum, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

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
    CLOSED = "CLOSED"
    ARCHIVED = "ARCHIVED"

class TaskType(str, enum.Enum):
    BUG_FIX = "BUG_FIX"
    FEATURE = "FEATURE"
    REFACTOR = "REFACTOR"
    DEBUGGING = "DEBUGGING"
    CODE_REVIEW = "CODE_REVIEW"

class SessionStatus(str, enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    SUBMITTED = "SUBMITTED"
    EXPIRED = "EXPIRED"
    EVALUATING = "EVALUATING"
    COMPLETED = "COMPLETED"

class WorkspaceStatus(str, enum.Enum):
    CREATED = "CREATED"
    ACTIVE = "ACTIVE"
    LOCKED = "LOCKED"
    DESTROYED = "DESTROYED"

class AgentSessionStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    STOPPED = "STOPPED"

class AgentRole(str, enum.Enum):
    SYSTEM = "SYSTEM"
    USER = "USER"
    ASSISTANT = "ASSISTANT"
    TOOL = "TOOL"

class ToolCallStatus(str, enum.Enum):
    REQUESTED = "REQUESTED"
    RUNNING = "RUNNING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REJECTED = "REJECTED"

class EventType(str, enum.Enum):
    SESSION_STARTED = "SESSION_STARTED"
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
    DEBUGGING = "DEBUGGING"
    GIT_COMMIT = "GIT_COMMIT"
    SUBMITTED = "SUBMITTED"
    SESSION_EXPIRED = "SESSION_EXPIRED"

class EventActor(str, enum.Enum):
    CANDIDATE = "CANDIDATE"
    AI = "AI"
    SYSTEM = "SYSTEM"
    ASSESSOR = "ASSESSOR"

class EvalStatus(str, enum.Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    PASSED = "PASSED"
    FAILED = "FAILED"
    COMPLETED = "COMPLETED"

class TestVisibility(str, enum.Enum):
    VISIBLE = "VISIBLE"
    HIDDEN = "HIDDEN"

class TestStatus(str, enum.Enum):
    PASSED = "PASSED"
    FAILED = "FAILED"
    ERROR = "ERROR"
    TIMEOUT = "TIMEOUT"
    SKIPPED = "SKIPPED"

class EvidenceType(str, enum.Enum):
    REQUIREMENT_INTERACTION = "REQUIREMENT_INTERACTION"
    CODE_CHANGE = "CODE_CHANGE"
    AI_ASSISTANCE = "AI_ASSISTANCE"
    AI_VALIDATION = "AI_VALIDATION"
    TESTING = "TESTING"
    DEBUGGING = "DEBUGGING"
    ITERATION = "ITERATION"
    FINAL_SUBMISSION = "FINAL_SUBMISSION"

class ReportGeneratedBy(str, enum.Enum):
    SYSTEM = "SYSTEM"
    ASSESSMENT_AI = "ASSESSMENT_AI"
    ASSESSOR = "ASSESSOR"

class ClaimStatus(str, enum.Enum):
    UNVERIFIED = "UNVERIFIED"
    VERIFIED = "VERIFIED"
    CONTRADICTED = "CONTRADICTED"

class SecurityDecision(str, enum.Enum):
    ALLOWED = "ALLOWED"
    DENIED = "DENIED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(Role), index=True, default=Role.CANDIDATE, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    created_assessments = relationship("Assessment", back_populates="creator")
    candidate_sessions = relationship("AssessmentSession", back_populates="candidate")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=60)
    difficulty = Column(SQLEnum(Difficulty), default=Difficulty.INTERMEDIATE, nullable=False)
    status = Column(SQLEnum(AssessmentStatus), index=True, default=AssessmentStatus.DRAFT, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    creator = relationship("User", back_populates="created_assessments")
    tasks = relationship("Task", back_populates="assessment", cascade="all, delete-orphan")
    sessions = relationship("AssessmentSession", back_populates="assessment", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    repository_url = Column(String, nullable=True)
    starter_repository = Column(String, nullable=True)
    task_type = Column(SQLEnum(TaskType), index=True, default=TaskType.FEATURE, nullable=False)
    constraints = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    assessment = relationship("Assessment", back_populates="tasks")
    test_cases = relationship("TestCase", back_populates="task", cascade="all, delete-orphan")
    sessions = relationship("AssessmentSession", back_populates="task", cascade="all, delete-orphan")

class AssessmentSession(Base):
    __tablename__ = "assessment_sessions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), index=True, nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    status = Column(SQLEnum(SessionStatus), index=True, default=SessionStatus.NOT_STARTED, nullable=False)
    started_at = Column(DateTime(timezone=True), index=True, nullable=True)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    assessment = relationship("Assessment", back_populates="sessions")
    candidate = relationship("User", back_populates="candidate_sessions")
    task = relationship("Task", back_populates="sessions")
    workspace = relationship("Workspace", back_populates="assessment_session", uselist=False, cascade="all, delete-orphan")
    agent_sessions = relationship("AgentSession", back_populates="assessment_session", cascade="all, delete-orphan")
    events = relationship("AssessmentEvent", back_populates="assessment_session", cascade="all, delete-orphan")
    git_evidence = relationship("GitEvidence", back_populates="assessment_session", cascade="all, delete-orphan")
    evaluation_runs = relationship("EvaluationRun", back_populates="assessment_session", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="assessment_session", cascade="all, delete-orphan")
    report = relationship("AssessmentReport", back_populates="assessment_session", uselist=False, cascade="all, delete-orphan")

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), nullable=False, unique=True)
    workspace_path = Column(String, nullable=False)
    repository_snapshot = Column(String, nullable=True)
    status = Column(SQLEnum(WorkspaceStatus), default=WorkspaceStatus.CREATED, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    assessment_session = relationship("AssessmentSession", back_populates="workspace")

class AgentSession(Base):
    __tablename__ = "agent_sessions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), index=True, nullable=False)
    model_name = Column(String, nullable=False)
    status = Column(SQLEnum(AgentSessionStatus), default=AgentSessionStatus.ACTIVE, nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessment_session = relationship("AssessmentSession", back_populates="agent_sessions")
    messages = relationship("AgentMessage", back_populates="agent_session", cascade="all, delete-orphan")
    tool_calls = relationship("AgentToolCall", back_populates="agent_session", cascade="all, delete-orphan")

class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(Integer, primary_key=True, index=True)
    agent_session_id = Column(Integer, ForeignKey("agent_sessions.id"), index=True, nullable=False)
    role = Column(SQLEnum(AgentRole), nullable=False)
    content = Column(Text, nullable=True)
    sequence_number = Column(Integer, index=True, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), index=True, server_default=func.now())

    agent_session = relationship("AgentSession", back_populates="messages")
    tool_calls = relationship("AgentToolCall", back_populates="message")

class AgentToolCall(Base):
    __tablename__ = "agent_tool_calls"

    id = Column(Integer, primary_key=True, index=True)
    agent_session_id = Column(Integer, ForeignKey("agent_sessions.id"), index=True, nullable=False)
    message_id = Column(Integer, ForeignKey("agent_messages.id"), nullable=True)
    tool_name = Column(String, index=True, nullable=False)
    arguments = Column(JSON, nullable=True)
    result = Column(JSON, nullable=True)
    status = Column(SQLEnum(ToolCallStatus), index=True, default=ToolCallStatus.REQUESTED, nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    agent_session = relationship("AgentSession", back_populates="tool_calls")
    message = relationship("AgentMessage", back_populates="tool_calls")

class AssessmentEvent(Base):
    __tablename__ = "assessment_events"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), index=True, nullable=False)
    event_type = Column(SQLEnum(EventType), index=True, nullable=False)
    actor = Column(SQLEnum(EventActor), index=True, nullable=False)
    metadata_json = Column(JSON, nullable=True) 
    timestamp = Column(DateTime(timezone=True), index=True, server_default=func.now())
    
    assessment_session = relationship("AssessmentSession", back_populates="events")

class GitEvidence(Base):
    __tablename__ = "git_evidence"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), index=True, nullable=False)
    commit_hash = Column(String, index=True, nullable=False)
    branch_name = Column(String, nullable=True)
    commit_message = Column(String, nullable=True)
    changed_files = Column(JSON, nullable=True)
    additions = Column(Integer, default=0)
    deletions = Column(Integer, default=0)
    diff_reference = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), index=True, server_default=func.now())

    assessment_session = relationship("AssessmentSession", back_populates="git_evidence")

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    visibility = Column(SQLEnum(TestVisibility), default=TestVisibility.VISIBLE, nullable=False)
    weight = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    task = relationship("Task", back_populates="test_cases")

class EvaluationRun(Base):
    __tablename__ = "evaluation_runs"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), index=True, nullable=False)
    status = Column(SQLEnum(EvalStatus), default=EvalStatus.QUEUED, nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    total_tests = Column(Integer, default=0)
    passed_tests = Column(Integer, default=0)
    failed_tests = Column(Integer, default=0)
    score = Column(Float, nullable=True)
    evaluation_metadata = Column(JSON, nullable=True)

    assessment_session = relationship("AssessmentSession", back_populates="evaluation_runs")
    test_results = relationship("TestResult", back_populates="evaluation_run", cascade="all, delete-orphan")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_run_id = Column(Integer, ForeignKey("evaluation_runs.id"), index=True, nullable=False)
    test_case_id = Column(Integer, ForeignKey("test_cases.id"), index=True, nullable=False)
    status = Column(SQLEnum(TestStatus), index=True, nullable=False)
    execution_time_ms = Column(Integer, nullable=True)
    output = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    evaluation_run = relationship("EvaluationRun", back_populates="test_results")
    test_case = relationship("TestCase")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), nullable=False)
    evidence_type = Column(SQLEnum(EvidenceType), nullable=False)
    description = Column(Text, nullable=False)
    source_event_ids = Column(JSON, nullable=True) 
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessment_session = relationship("AssessmentSession", back_populates="evidence")

class AssessmentReport(Base):
    __tablename__ = "assessment_reports"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), nullable=False, unique=True)
    task_summary = Column(Text, nullable=True)
    implementation_summary = Column(Text, nullable=True)
    testing_summary = Column(Text, nullable=True)
    ai_usage_summary = Column(Text, nullable=True)
    debugging_summary = Column(Text, nullable=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    generated_by = Column(SQLEnum(ReportGeneratedBy), default=ReportGeneratedBy.SYSTEM, nullable=False)
    version = Column(Integer, default=1)

    assessment_session = relationship("AssessmentSession", back_populates="report")
    report_evidence = relationship("ReportEvidence", back_populates="report", cascade="all, delete-orphan")

class ReportEvidence(Base):
    __tablename__ = "report_evidence"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("assessment_reports.id"), nullable=False)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=False)
    claim = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    report = relationship("AssessmentReport", back_populates="report_evidence")
    evidence = relationship("Evidence")

class EnvironmentPolicy(Base):
    __tablename__ = "environment_policies"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), index=True, nullable=False, unique=True)
    
    max_context_files = Column(Integer, default=20)
    max_file_size_mb = Column(Integer, default=2)
    max_search_results = Column(Integer, default=50)
    max_context_tokens = Column(Integer, default=12000)
    
    network_enabled = Column(Boolean, default=False)
    allow_external_web = Column(Boolean, default=False)
    
    max_command_timeout_seconds = Column(Integer, default=30)
    max_cpu_cores = Column(Integer, default=2)
    max_memory_mb = Column(Integer, default=1024)
    
    max_tool_calls_per_turn = Column(Integer, default=10)
    max_agent_turns = Column(Integer, default=50)
    max_patch_size_lines = Column(Integer, default=500)
    
    allow_file_read = Column(Boolean, default=True)
    allow_file_write = Column(Boolean, default=True)
    allow_file_delete = Column(Boolean, default=False)
    allow_shell = Column(Boolean, default=False)
    allow_test_execution = Column(Boolean, default=True)
    allow_git = Column(Boolean, default=True)
    
    allow_score_access = Column(Boolean, default=False)
    allow_hidden_test_access = Column(Boolean, default=False)
    allow_secret_access = Column(Boolean, default=False)
    allow_host_filesystem = Column(Boolean, default=False)

    assessment = relationship("Assessment")

class AIClaim(Base):
    __tablename__ = "ai_claims"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), index=True, nullable=False)
    claim = Column(Text, nullable=False)
    status = Column(SQLEnum(ClaimStatus), default=ClaimStatus.UNVERIFIED, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    verified_at = Column(DateTime(timezone=True), nullable=True)

    assessment_session = relationship("AssessmentSession")
    evidence = relationship("ClaimEvidence", back_populates="claim", cascade="all, delete-orphan")

class ClaimEvidence(Base):
    __tablename__ = "claim_evidence"

    id = Column(Integer, primary_key=True, index=True)
    ai_claim_id = Column(Integer, ForeignKey("ai_claims.id"), index=True, nullable=False)
    evidence_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    claim = relationship("AIClaim", back_populates="evidence")

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    assessment_session_id = Column(Integer, ForeignKey("assessment_sessions.id"), index=True, nullable=False)
    actor = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=True)
    decision = Column(SQLEnum(SecurityDecision), nullable=False)
    reason = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), index=True, server_default=func.now())

    assessment_session = relationship("AssessmentSession")

