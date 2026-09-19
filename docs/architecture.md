# OAIAW System Architecture

## Overview
OAIAW (Online Assessment in the AI World) is a platform for evaluating software engineering candidates in a realistic, AI-assisted environment.

## Components
- **Assessment Task Manager**: Manages tasks assigned to candidates.
- **Candidate Workspace**: The IDE/Terminal environment for the candidate.
- **AI Coding Agent**: Assists the candidate with code generation, debugging, and review.
- **Engineering Activity Tracker**: Logs actions, tool usage, code changes, and AI interactions.
- **Evidence Engine**: Collects logs and evidence.
- **Assessment Report Generator**: Compiles final evaluations based on engineering evidence.

## Tech Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: FastAPI, PostgreSQL, SQLAlchemy
- AI: Python-based Agent integrating with LLM Provider via API
