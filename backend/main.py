from fastapi import FastAPI
from database import engine, Base
from routers import auth, assessments, tasks, workspace, agent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="OAIAW Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(assessments.router)
app.include_router(tasks.router)
app.include_router(workspace.router)
app.include_router(agent.router)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "oaiaw-backend"
    }

