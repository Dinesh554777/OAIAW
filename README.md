# OAIAW — Online Assessment in the AI World

> **AI-native technical assessment platform for evaluating real engineering ability in an AI-assisted development environment.**

---

## 📌 Overview

**OAIAW (Online Assessment in the AI World)** is a next-generation technical assessment platform designed for the era of AI-assisted software engineering.

Traditional technical assessments generally follow:

```text
Problem
   ↓
Write Code
   ↓
Run Tests
   ↓
Score
```

But modern software engineers increasingly work with AI coding assistants, LLMs, automated tools, repositories, testing frameworks, Git and debugging systems.

Therefore, solving a programming problem correctly is no longer enough to understand how effectively a candidate can engineer software.

OAIAW changes the assessment model to:

```text
Understand
    ↓
Plan
    ↓
Build
    ↓
AI Assist
    ↓
Verify
    ↓
Test
    ↓
Debug
    ↓
Refine
    ↓
Submit
```

Instead of treating AI as something that must simply be blocked, OAIAW allows candidates to use an integrated AI coding agent inside a **controlled assessment environment**.

The platform evaluates not only the final code, but also the **engineering process and evidence behind the result**.

---

# 🎯 Problem Statement

## Online Assessment in the AI World

AI systems can now solve many traditional programming and algorithmic assessment questions.

This creates a fundamental challenge for technical hiring:

> If AI can produce the code, how should an assessment measure the candidate's actual engineering ability?

Traditional assessments often provide limited visibility into:

* How the candidate understood the requirement
* How they explored an existing repository
* How they planned the implementation
* How they used AI
* Whether they understood AI-generated code
* Whether they verified AI suggestions
* How they debugged failures
* How they tested their changes
* How they refined their implementation
* How they worked with Git
* How they handled engineering constraints

OAIAW addresses this gap by evaluating **AI-assisted engineering behavior**, not just the final answer.

---

# 💡 Core Idea

OAIAW introduces an **AI-native engineering assessment workflow**.

Instead of asking:

> "Can this candidate solve this coding problem?"

OAIAW creates an environment where candidates demonstrate:

> "Can this candidate effectively engineer a solution when AI is part of the development workflow?"

The candidate works inside a controlled workspace with:

* Realistic software engineering tasks
* Existing repositories
* An integrated AI coding agent
* Code editor
* File explorer
* Testing tools
* Git activity
* Debugging workflow
* AI interaction tracking
* Engineering activity tracking

The platform then converts these activities into structured assessment evidence.

---

# 🧠 Core Innovation

The core innovation is **not simply an AI chatbot inside a coding platform**.

The innovation is the assessment layer surrounding the AI agent.

### Existing AI coding workflow

```text
User
  ↓
AI Agent
  ↓
Code
```

### OAIAW workflow

```text
Assessment Task
      ↓
Candidate + AI Coding Agent
      ↓
Controlled Engineering Workspace
      ↓
Engineering Activity
      ↓
Testing & Verification
      ↓
Evidence
      ↓
Assessment Report
```

The platform observes how engineering work happens while AI is being used.

---

# 🏗️ System Architecture

```text
                         OAIAW
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
      Candidate        Assessor          Admin
          │               │                │
          ▼               ▼                ▼
   Engineering        Assessment       Platform
    Workspace         Management       Management
          │
          ▼
   AI Coding Agent
          │
    ┌─────┼─────┐
    │     │     │
    ▼     ▼     ▼
  Files  Code  Tests
    │     │     │
    └─────┼─────┘
          ▼
 Engineering Activity
          │
          ▼
 Deterministic Evaluator
          │
          ▼
 Evidence Engine
          │
          ▼
 Assessment Report
```

---

# 🔄 Complete Assessment Flow

```text
1. Assessor creates assessment
            ↓
2. Candidate receives assessment
            ↓
3. Candidate enters isolated workspace
            ↓
4. Candidate explores repository
            ↓
5. Candidate understands requirements
            ↓
6. Candidate plans implementation
            ↓
7. Candidate asks AI for assistance
            ↓
8. AI proposes solution
            ↓
9. Candidate reviews AI suggestion
            ↓
10. Candidate accepts/modifies/rejects
            ↓
11. Code is changed
            ↓
12. Candidate runs tests
            ↓
13. System records actual results
            ↓
14. Candidate debugs failures
            ↓
15. Candidate refines implementation
            ↓
16. Candidate submits
            ↓
17. Evaluator executes deterministic tests
            ↓
18. Evidence is generated
            ↓
19. Assessor reviews engineering evidence
            ↓
20. Assessment report is generated
```

---

# 👥 User Roles

OAIAW has three primary roles.

## 1. Candidate

The candidate is the person performing the technical assessment.

### Candidate responsibilities

* View assigned assessments
* Start an assessment
* Read requirements
* Explore repositories
* Plan implementation
* Use the AI coding agent
* Modify code
* Run tests
* Debug failures
* Review AI suggestions
* Use Git
* Submit the solution

### Candidate workspace

```text
Candidate
   │
   ├── Assessment
   ├── Repository
   ├── Monaco Editor
   ├── AI Assistant
   ├── File Explorer
   ├── Tests
   ├── Terminal / Tools
   ├── Git Activity
   └── Engineering Timeline
```

---

# 2. Assessor

The assessor is responsible for designing and evaluating assessments.

### Assessor responsibilities

* Create assessments
* Create engineering tasks
* Configure difficulty
* Configure duration
* Configure tests
* Assign assessments
* Monitor candidate attempts
* Review code changes
* Review AI interactions
* Review test results
* Review debugging activity
* Review Git evidence
* Review engineering timeline
* Generate assessment reports

The assessor focuses on:

```text
Assessment
   ↓
Candidate Activity
   ↓
Evidence
   ↓
Evaluation
   ↓
Report
```

---

# 3. Admin

The admin manages the platform itself.

### Admin responsibilities

* Manage users
* Manage assessors
* Monitor platform activity
* Manage platform configuration
* Review security events
* Manage system-level settings

The admin does not automatically receive assessor permissions.

---

# 🔐 Role Model

The fundamental separation is:

```text
Admin
  =
Platform Management

Assessor
  =
Assessment Management

Candidate
  =
Assessment Execution
```

Backend authorization remains the source of truth.

Frontend role selection is only a user-interface mechanism.

---

# 🧪 Assessment Types

OAIAW supports realistic software engineering tasks rather than only algorithmic questions.

Supported task categories include:

### BUG_FIX

Candidate receives an existing codebase containing a defect.

```text
Existing Repository
       ↓
Find Problem
       ↓
Understand Root Cause
       ↓
Fix
       ↓
Test
```

---

### FEATURE

Candidate must implement a new feature inside an existing repository.

```text
Requirements
     ↓
Explore Codebase
     ↓
Plan
     ↓
Implement
     ↓
Test
     ↓
Submit
```

---

### REFACTOR

Candidate improves an existing implementation while maintaining behavior.

The assessment can evaluate:

* Code quality
* Maintainability
* Regression safety
* Test coverage
* Engineering decisions

---

### DEBUGGING

Candidate investigates failing behavior.

The workflow becomes:

```text
Failure
 ↓
Investigate
 ↓
Hypothesis
 ↓
Experiment
 ↓
Fix
 ↓
Verify
```

---

### CODE_REVIEW

Candidate analyzes an existing implementation and identifies engineering issues.

Potential areas:

* Bugs
* Security issues
* Performance
* Maintainability
* Design problems
* Testing gaps

---

# 🤖 Integrated AI Coding Agent

OAIAW includes an integrated AI coding agent.

The agent can assist with:

* Repository exploration
* File reading
* Code search
* Code explanation
* Code generation
* Patch generation
* Debugging
* Test suggestions
* Tool-assisted investigation

However:

> **The AI is an assistant, not the authority.**

The candidate remains responsible for the final engineering decision.

---

# 🔄 Human + AI Collaboration

OAIAW captures the collaboration between the candidate and AI.

```text
Candidate asks AI
       ↓
AI proposes solution
       ↓
Candidate reviews
       ↓
Candidate
 ┌─────┼─────┐
 ↓     ↓     ↓
Accept Modify Reject
       │
       ▼
Apply Change
       ↓
Run Tests
       ↓
Verify
```

This makes AI usage observable instead of invisible.

---

# 🧠 AI Verification

A central principle of OAIAW is:

> **The LLM should propose. The system should verify.**

AI-generated claims are not automatically treated as facts.

For example:

```text
AI:
"The authentication bug is caused by user_id being null."

Status:
UNVERIFIED
```

After an actual test confirms the claim:

```text
AI:
"The authentication bug is caused by user_id being null."

Status:
VERIFIED BY TESTS
```

If actual evidence contradicts the AI:

```text
Status:
CONTRADICTED BY TESTS
```

This creates an important distinction between:

```text
AI Statement
      ≠
Verified Assessment Fact
```

---

# 🔗 AI → Code → Test Evidence Chain

OAIAW connects AI interaction with actual engineering outcomes.

```text
AI Suggestion
      ↓
Candidate Decision
      ↓
Code Change
      ↓
Test Execution
      ↓
Actual Result
      ↓
Evidence
```

Example:

```text
AI suggests changing auth.py
        ↓
Candidate accepts suggestion
        ↓
auth.py modified
        ↓
test_auth.py executed
        ↓
Test passes
        ↓
Evidence recorded
```

This allows assessors to understand not just what AI said, but what happened afterward.

---

# 🛡️ Controlled AI Environment

AI must operate inside a controlled assessment environment.

The system restricts:

* File access
* Tool access
* Workspace access
* Network access
* Resource usage
* Assessment state
* Hidden tests
* Secrets

The AI should not have unrestricted access to the host system.

---

# 🔒 AI Permissions

### Allowed

```text
✓ List permitted files
✓ Read permitted files
✓ Search code
✓ Suggest patches
✓ Apply permitted patches
✓ Run predefined tests
✓ Read test results
✓ Inspect Git status
✓ Inspect Git diff
```

### Forbidden

```text
✗ Host filesystem access
✗ Other candidate workspaces
✗ Secrets
✗ Production database
✗ Hidden test access
✗ Hidden test modification
✗ Score modification
✗ Assessment state modification
✗ Timer modification
✗ Unauthorized network access
✗ Arbitrary privileged commands
```

---

# 🧱 Security Principle

OAIAW follows the principle:

> **Least privilege + controlled tools + isolated workspace + deterministic verification**

The LLM should never directly control critical assessment state.

---

# 🚫 Hallucination Prevention

AI systems can hallucinate.

OAIAW addresses this through environmental controls.

Potential hallucination categories include:

### Code hallucination

AI proposes incorrect code.

**Mitigation:** candidate review + tests.

### API hallucination

AI assumes an API exists.

**Mitigation:** repository-aware tools + actual execution.

### Repository hallucination

AI refers to files that do not exist.

**Mitigation:** controlled repository tools.

### Test-result hallucination

AI claims that a test passed.

**Mitigation:** actual test execution.

### Tool hallucination

AI claims a tool executed successfully.

**Mitigation:** tool result comes from the system.

### Assessment hallucination

AI attempts to modify assessment state.

**Mitigation:** deterministic backend authorization.

---

# 💬 Evidence-Backed AI Claims

Where appropriate, AI claims can be linked to evidence.

Example:

```json
{
  "claim": "The authentication failure occurs because user_id can be null.",
  "evidence": [
    {
      "type": "test_failure",
      "source": "test_auth.py:42"
    },
    {
      "type": "code",
      "source": "auth.py:78"
    }
  ]
}
```

The platform can therefore distinguish:

```text
Claim
+
Evidence
=
Assessable Information
```

---

# 🧪 Deterministic Evaluation

The evaluation system is separated from the LLM.

### Deterministic systems handle:

* Test execution
* Test results
* Hidden tests
* Authentication
* Authorization
* Timer
* Workspace permissions
* Evidence persistence
* Assessment state
* Security controls
* Score-related system state

### AI handles:

* Explanations
* Suggestions
* Repository assistance
* Debugging assistance
* Natural-language interaction
* Evidence summarization

This separation is intentional.

---

# ⏱️ Assessment Timer

Assessment timing is controlled by the backend.

The AI cannot:

```text
✗ Extend the timer
✗ Pause the timer
✗ Change assessment duration
✗ Modify submission deadline
```

The server remains authoritative.

---

# 📝 Engineering Activity Tracking

OAIAW records meaningful engineering events.

Examples:

```text
FILE_OPENED
FILE_CREATED
FILE_EDITED
FILE_DELETED

AI_MESSAGE
AI_TOOL_CALL

CODE_CHANGE

TEST_STARTED
TEST_COMPLETED
TEST_FAILED
TEST_PASSED

DEBUGGING_ACTION

GIT_COMMIT
GIT_DIFF
GIT_STATUS

SUBMISSION
```

This produces an engineering timeline.

---

# 📊 Engineering Timeline

Example:

```text
09:02  Assessment started
09:04  Opened src/auth.py
09:07  Searched authentication logic
09:09  Asked AI about null handling
09:10  AI suggested patch
09:11  Candidate modified patch
09:13  Test failed
09:15  Candidate inspected failure
09:18  Code updated
09:19  Test passed
09:22  Git commit created
09:25  Assessment submitted
```

This provides much richer information than a final score alone.

---

# 📈 Assessment Evidence

OAIAW can collect evidence from:

```text
Code
AI Interaction
Tool Usage
Tests
Git
Debugging
Timeline
Security Events
Submission
```

The evidence layer connects these sources.

---

# 📄 Assessment Report

The assessor can review a structured report containing:

### Candidate information

* Candidate
* Assessment
* Task
* Duration
* Submission status

### Engineering evidence

* Code changes
* Test results
* Git activity
* Debugging events
* AI interactions
* Tool activity

### AI usage

* Number of AI interactions
* Types of assistance requested
* Suggested changes
* Candidate decisions
* Verification results

### Security

* Restricted tool attempts
* Unauthorized access attempts
* Sandbox events
* Security events

### Evidence timeline

Chronological engineering activity.

---

# 🤖 AI Assessment Assistant

OAIAW can provide an AI assessment assistant to help assessors understand structured evidence.

The assessment assistant should operate only on collected evidence.

It should not invent candidate activity.

Conceptually:

```text
Assessment Evidence
        ↓
Structured Evidence
        ↓
AI Assessment Assistant
        ↓
Evidence-Based Summary
```

The AI assistant does not become the source of truth.

---

# 🗄️ Database Architecture

OAIAW uses PostgreSQL for persistent assessment data.

Core entities include:

```text
users
assessments
tasks
assessment_sessions
workspaces
agent_sessions
agent_messages
agent_tool_calls
assessment_events
git_evidence
evaluation_runs
test_cases
test_results
evidence
assessment_reports
report_evidence
```

---

# 🔗 Database Relationships

```text
User
 │
 ├──< Assessment
 │       │
 │       └──< Task
 │
 └──< AssessmentSession
          │
          ├── Workspace
          │
          ├──< AgentSession
          │       ├──< AgentMessage
          │       └──< AgentToolCall
          │
          ├──< AssessmentEvent
          │
          ├──< GitEvidence
          │
          ├──< EvaluationRun
          │       └──< TestResult
          │
          ├──< Evidence
          │
          └── AssessmentReport
                    │
                    └──< ReportEvidence
```

---

# 🛠️ Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Monaco Editor
* Recharts
* WebSocket / SSE where required

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* Alembic

## Database

* PostgreSQL

## AI

* LLM provider abstraction
* Repository-aware AI coding agent
* Tool-calling architecture
* Evidence-aware AI verification

## Development

* Git
* GitHub
* Docker
* VS Code

---

# 🎨 Frontend Architecture

```text
frontend/
├── app/
├── components/
│   ├── ui/
│   ├── auth/
│   ├── candidate/
│   ├── assessor/
│   ├── admin/
│   ├── workspace/
│   ├── agent/
│   ├── evidence/
│   └── reports/
├── lib/
├── hooks/
├── services/
├── types/
└── styles/
```

shadcn/ui is used as the reusable UI foundation.

---

# ⚙️ Backend Architecture

```text
backend/
└── app/
    ├── api/
    ├── core/
    ├── db/
    ├── models/
    ├── schemas/
    ├── services/
    ├── agents/
    ├── evaluation/
    ├── evidence/
    ├── security/
    └── main.py
```

---

# 🤖 Agent Architecture

```text
agent/
├── core/
├── context/
├── tools/
├── permissions/
├── prompts/
├── verification/
└── evidence/
```

The agent should not directly bypass the controlled environment.

---

# 🧪 Evaluator Architecture

```text
evaluator/
├── runner/
├── tests/
├── sandbox/
├── scoring/
└── evidence/
```

The evaluator executes deterministic assessment checks.

---

# 📁 Project Structure

```text
oaiaw/
│
├── frontend/
│
├── backend/
│
├── agent/
│
├── evaluator/
│
├── shared/
│
├── tasks/
│
├── docs/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js
* npm
* Python 3.10+
* PostgreSQL
* Git
* Docker (recommended)

Verify:

```bash
node --version
npm --version
python --version
psql --version
git --version
```

---

# 📥 Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd oaiaw
```

---

# 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create environment configuration according to the project's `.env.example`.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# 🐍 Backend Setup

Open another terminal:

```bash
cd backend
```

Create virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🗄️ PostgreSQL Setup

Create the database:

```sql
CREATE DATABASE oaiaw;
```

Create an application user:

```sql
CREATE USER oaiaw_user WITH PASSWORD 'YOUR_PASSWORD';
```

Grant access:

```sql
GRANT ALL PRIVILEGES ON DATABASE oaiaw TO oaiaw_user;
```

Configure:

```env
DATABASE_URL=postgresql+psycopg://oaiaw_user:YOUR_PASSWORD@localhost:5432/oaiaw
```

Never commit real credentials.

---

# 🔄 Database Migration

From the backend directory:

```bash
alembic upgrade head
```

To create a migration:

```bash
alembic revision --autogenerate -m "description"
```

Then:

```bash
alembic upgrade head
```

---

# ▶️ Start Backend

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

# ❤️ Health Check

The backend should provide:

```http
GET /health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

# 🔐 Environment Variables

Never commit secrets.

Use:

```text
.env
```

and provide:

```text
.env.example
```

Example:

```env
DATABASE_URL=
JWT_SECRET=
LLM_API_KEY=
NEXT_PUBLIC_API_URL=
```

Use separate environment configurations for:

```text
Development
Testing
Production
```

---

# 🔑 Authentication Flow

```text
Register / Login
       ↓
Authentication API
       ↓
JWT / Session
       ↓
Current User
       ↓
Role
       ↓
Authorization
       ↓
Role Dashboard
```

Roles:

```text
candidate
assessor
admin
```

Backend authorization must validate every protected operation.

---

# 🌐 API Structure

Conceptual API groups:

```text
/auth
/users
/assessments
/tasks
/sessions
/workspaces
/agent
/tools
/events
/git
/evaluation
/tests
/evidence
/reports
/security
```

Actual endpoints should follow the implementation in the backend.

---

# 🧑‍💻 Candidate Workspace

The candidate workspace contains:

```text
┌────────────────────────────────────────────────────┐
│ Assessment        Timer             Submit          │
├──────────┬───────────────────────────┬─────────────┤
│ Files    │                           │ AI Agent    │
│          │       Monaco Editor       │             │
│ Explorer │                           │ Chat        │
│          │                           │ Tools       │
├──────────┴───────────────────────────┴─────────────┤
│ Tests | Terminal | Git | Timeline | Evidence       │
└────────────────────────────────────────────────────┘
```

The workspace is designed around realistic software engineering.

---

# 🧩 Engineering Evidence Model

OAIAW separates raw activity from assessment evidence.

```text
Raw Activity
     ↓
Structured Events
     ↓
Evidence
     ↓
Assessment Report
```

Example:

```text
AI suggestion
     +
Candidate accepted suggestion
     +
Code changed
     +
Test passed
     ↓
Evidence
```

---

# 🔍 Evidence Types

Possible evidence categories:

```text
CODE_CHANGE
AI_INTERACTION
TOOL_USAGE
TEST_RESULT
DEBUGGING
GIT_ACTIVITY
SECURITY_EVENT
SUBMISSION
```

---

# 🛡️ Security Model

Security is a core part of OAIAW.

Important principles:

### Least privilege

Every component gets only the permissions it requires.

### Isolation

Candidate workspaces are isolated.

### Deterministic evaluation

Assessment results should come from controlled execution.

### Append-only evidence

Historical assessment evidence should not be freely editable by candidates.

### Secret protection

Secrets must never be exposed to candidates or unrestricted AI tools.

### Hidden-test protection

Candidates and AI agents must not access or modify hidden tests.

---

# 🧠 Prompt Injection Protection

Repository content should be treated as untrusted data.

For example, a README could contain malicious instructions intended for an AI agent.

OAIAW should distinguish:

```text
System Policy
      ↓
Assessment Configuration
      ↓
Candidate Input
      ↓
Repository Content
      ↓
Tool Output
```

Repository content should never automatically override system policy.

The AI agent should follow the highest-priority trusted instructions.

---

# 🧰 Controlled Tools

Instead of unrestricted shell access, OAIAW can expose controlled tools such as:

```text
list_files()
read_file()
search_code()
apply_patch()
run_tests()
get_test_result()
git_status()
git_diff()
git_log()
```

Each tool request is validated before execution.

---

# 🧪 Sandbox

Prototype sandbox configuration may include:

```text
CPU:
1–2 cores

Memory:
512 MB–1 GB

Execution timeout:
10–30 seconds

Network:
Disabled by default

Workspace:
Temporary isolated workspace

Secrets:
Not available
```

These are prototype configuration values and can be adjusted based on deployment requirements.

---

# 📊 Assessment Evidence Dashboard

Assessors can see:

```text
Candidate
     ↓
Assessment
     ↓
Timeline
     ├── Code Changes
     ├── AI Interaction
     ├── Tests
     ├── Debugging
     ├── Git
     └── Security
             ↓
        Evidence Graph
             ↓
        Assessment Report
```

---

# 🖥️ UI Design

OAIAW uses a modern developer-tool interface.

Design principles:

* Dark-first
* Technical
* Minimal
* Professional
* High information density
* Clear hierarchy
* Responsive
* Accessible

The UI is built using:

* shadcn/ui
* Tailwind CSS
* Lucide icons
* Monaco Editor

---

# 🔑 Authentication UI

The authentication system supports role-specific experiences.

```text
                    Authentication
                           │
               ┌───────────┴───────────┐
               │                       │
            Sign In                 Register
               │                       │
        Select / Detect Role      Select Role
               │                       │
       ┌───────┼────────┐       ┌──────┼──────┐
       ▼       ▼        ▼       ▼      ▼      ▼
   Candidate Assessor Admin Candidate Assessor Admin
       │       │        │
       ▼       ▼        ▼
   Dashboard Dashboard Dashboard
```

Candidate, assessor and admin accounts have different capabilities and navigation.

---

# 🧑‍🎓 Candidate Experience

```text
Login
 ↓
Candidate Dashboard
 ↓
Assigned Assessment
 ↓
Start Assessment
 ↓
Engineering Workspace
 ↓
AI Assistance
 ↓
Code
 ↓
Tests
 ↓
Debug
 ↓
Submit
```

---

# 🧑‍💼 Assessor Experience

```text
Login
 ↓
Assessor Dashboard
 ↓
Create Assessment
 ↓
Configure Task
 ↓
Assign Candidate
 ↓
Monitor Attempt
 ↓
Review Evidence
 ↓
View Report
```

---

# 🛠️ Admin Experience

```text
Login
 ↓
Admin Dashboard
 ↓
Users
Assessors
Platform
Security
Settings
```

---

# 🧪 Testing Strategy

OAIAW should be tested at multiple levels.

## Unit Tests

Test individual services and components.

## Integration Tests

Test:

```text
Frontend
 ↓
Backend
 ↓
Database
```

## Authentication Tests

Verify:

```text
Valid Login
Invalid Login
Registration
Duplicate Email
Logout
Expired Session
```

## Authorization Tests

Verify:

```text
Candidate → Candidate APIs ✓
Candidate → Assessor APIs ✗
Candidate → Admin APIs ✗

Assessor → Assessor APIs ✓
Assessor → Admin APIs ✗

Admin → Admin APIs ✓
```

## Evaluation Tests

Verify:

* visible tests
* hidden tests
* test isolation
* timeout
* resource limits
* deterministic results

## Security Tests

Verify:

* workspace isolation
* path traversal protection
* secret protection
* hidden-test protection
* prompt injection defenses
* unauthorized tool execution

---

# 📦 Git Workflow

Recommended branches:

```text
main
│
├── feat/frontend
├── feat/backend
├── feat/agent
├── feat/evaluator
├── feat/database
└── feat/security
```

Create a branch:

```bash
git checkout -b feat/agent
```

Commit:

```bash
git add .
git commit -m "feat(agent): add repository-aware coding agent"
```

Push:

```bash
git push -u origin feat/agent
```

---

# 🧑‍💻 Development Principles

## 1. Preserve existing functionality

Do not replace working functionality unnecessarily.

## 2. Small changes

Implement features incrementally.

## 3. Backend as source of truth

Never rely solely on frontend security.

## 4. Deterministic evaluation

Do not let an LLM directly determine assessment state.

## 5. Evidence over assumptions

Assessment claims should be backed by observable activity.

## 6. AI assistance, not AI authority

The AI proposes.

The candidate decides.

The system verifies.

---

# 🌟 Key Differentiators

OAIAW focuses on several areas that traditional online coding platforms may not fully capture.

### 1. Realistic engineering tasks

Candidates work with codebases instead of only isolated questions.

### 2. AI-native assessment

AI assistance is intentionally part of the workflow.

### 3. Human + AI collaboration

The platform observes how candidates interact with AI.

### 4. Verification

AI suggestions can be validated through actual tools and tests.

### 5. Engineering evidence

Assessment is supported by observable activity.

### 6. Controlled environment

AI and candidate actions operate under assessment-specific permissions.

### 7. Evidence-based reports

Assessors receive a structured view of the engineering process.

---

# 🏆 Demo Story

A strong OAIAW demonstration can follow this sequence:

```text
1. Admin logs in
       ↓
2. Assessor creates a realistic BUG_FIX task
       ↓
3. Candidate logs in
       ↓
4. Candidate opens repository
       ↓
5. Candidate asks AI for help
       ↓
6. AI suggests a change
       ↓
7. Candidate reviews the suggestion
       ↓
8. Candidate applies/modifies it
       ↓
9. Test initially fails
       ↓
10. Candidate debugs
       ↓
11. Test passes
       ↓
12. Git evidence is captured
       ↓
13. Candidate submits
       ↓
14. Deterministic evaluator runs
       ↓
15. Evidence is generated
       ↓
16. Assessor opens candidate report
       ↓
17. Timeline + AI usage + code + tests are visible
```

This demonstrates the complete OAIAW concept rather than only showing a login screen or coding editor.

---

# 🎯 Core Product Flow

The entire platform can be summarized as:

```text
REAL ENGINEERING TASK
          ↓
CANDIDATE
          +
AI CODING AGENT
          ↓
CONTROLLED WORKSPACE
          ↓
ENGINEERING ACTIVITY
          ↓
DETERMINISTIC TESTING
          ↓
EVIDENCE
          ↓
ASSESSMENT REPORT
```

---

# 🧠 Core Philosophy

OAIAW follows one simple principle:

> ## AI proposes. Candidate decides. System verifies. Evidence proves.

This separates four different responsibilities:

```text
AI
↓
Suggestion

Candidate
↓
Engineering Decision

System
↓
Verification

Evidence
↓
Assessment
```

---

# 🚀 Future Scope

Potential future extensions include:

* Multi-language assessments
* More engineering task types
* Advanced sandboxing
* Multi-agent assessment scenarios
* AI-generated assessment tasks
* Repository-scale debugging
* Real-time assessor monitoring
* Advanced engineering analytics
* Skill-gap analysis
* Team-based engineering assessments
* Enterprise hiring integrations
* CI/CD-based assessment environments
* Advanced anti-cheating signals
* Candidate development insights

These features should be added without compromising the core principle of deterministic assessment and evidence integrity.

---

# 📋 Project Status

Current platform capabilities include:

* [x] Role-based authentication
* [x] Candidate / Assessor / Admin roles
* [x] Assessment management
* [x] Realistic engineering tasks
* [x] Candidate workspace
* [x] AI coding agent
* [x] Controlled AI tools
* [x] AI verification
* [x] Code/test evidence
* [x] Engineering activity tracking
* [x] Git evidence
* [x] Deterministic evaluation
* [x] Assessment reports
* [x] AI assessment assistant
* [x] PostgreSQL persistence
* [x] shadcn/ui-based interface
* [x] Role-aware authentication UI
* [x] Security controls
* [ ] Production-grade sandbox deployment
* [ ] Advanced enterprise deployment

---

# 📞 Development

For development-related issues:

1. Check the project documentation.
2. Check backend logs.
3. Check frontend console.
4. Verify PostgreSQL connection.
5. Verify environment variables.
6. Run migrations.
7. Run tests.
8. Check authentication/session state.

---

# 📄 License

Add the project's selected license here.

Example:

```text
MIT License
```

or use the license selected by the project/team.

---

# 👥 Team

**OAIAW — Online Assessment in the AI World**

Built as an AI-native technical assessment platform focused on evaluating engineering capability in modern AI-assisted development environments.

---

# ⭐ Final Concept

```text
Traditional Assessment

Problem
   ↓
Code
   ↓
Test
   ↓
Score


OAIAW

Understand
   ↓
Plan
   ↓
Build
   ↓
AI Assist
   ↓
Verify
   ↓
Test
   ↓
Debug
   ↓
Refine
   ↓
Evidence
   ↓
Assessment Report
```

> **OAIAW evaluates how engineers build with AI — not merely whether AI can produce the answer.**
