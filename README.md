# OAIAW - Online Assessment in the AI World

## Project Overview
OAIAW is a platform designed for technical assessment in an AI-assisted software engineering environment. 
Instead of merely verifying final code, OAIAW evaluates the entire engineering lifecycle: Understand, Plan, Build, AI Assist, Verify, Test, Debug, Refine, Submit, Evidence, and Assessment Report.

**Core principle**: AI proposes. Candidate decides. System verifies. Evidence proves.

## Architecture & Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui components.
- **Backend**: FastAPI, Python 3, SQLAlchemy, Alembic for migrations.
- **Database**: PostgreSQL (via psycopg2).
- **AI Integration**: Groq API (Configured via LLM_PROVIDER / LLM_API_KEY).
- **Authentication**: JWT-based stateless authentication with passlib bcrypt hashing. Role-based routing (Candidate, Assessor, Admin).

## Implemented Features

### Authentication & Authorization
- **Role-based Auth**: Fully integrated Candidate, Assessor, and Admin roles.
- **Registration Stepper**: Visual, multi-step role-specific registration flows.
- **JWT Protection**: Secured backend endpoints and frontend Route Guards.
- **Environment Configuration**: Centralized Pydantic Settings integration.

### Dashboards & Views
- **Candidate Dashboard**: Active assessments, workspace view, testing integrations.
- **Assessor Dashboard**: Assessment creation, task configuration.
- **Admin Dashboard**: Restricted access, secure registration workflows.

### Workspaces & AI Integration
- **Code Workspace**: Monaco editor integration with persistent state.
- **AI Agent Chat**: Integrated contextual AI interactions for active assistance.
- **Terminal output & testing**: Mock test execution suite for candidates.

## Feature Status Matrix

| Feature                   | Status   |
| ------------------------- | -------- |
| Role-based authentication | Verified |
| Candidate dashboard       | Verified |
| Assessor dashboard        | Verified |
| Admin dashboard           | Verified |
| Assessment management     | Partial  |
| Engineering tasks         | Partial  |
| Candidate workspace       | Verified |
| AI coding agent           | Verified |
| Controlled AI tools       | Partial  |
| AI verification           | Partial  |
| Testing                   | Verified |
| Git evidence              | Partial  |
| Engineering timeline      | Verified |
| Evidence engine           | Verified |
| Assessment reports        | Partial  |
| PostgreSQL persistence    | Verified |
| Security controls         | Verified |

## Installation & Setup

1. Copy .env.example to .env.
2. Configure your DATABASE_URL in .env.
3. Set your JWT_SECRET and LLM_API_KEY.
4. Migrate the database:
   `ash
   cd backend
   alembic upgrade head
   `
5. Start the backend:
   `ash
   uvicorn main:app --reload
   `
6. Start the frontend:
   `ash
   cd frontend
   npm run dev
   `

## Future Scope
- Fully integrated Sandbox for secure execution.
- Advanced Git-diff based engineering timelines.
- Real-time Assessment evidence extraction.
