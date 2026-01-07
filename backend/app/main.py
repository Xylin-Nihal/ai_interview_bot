from fastapi import FastAPI
from app.database import Base, engine
from app.models import (
    user,
    resume,
    resume_chunk,
    interview_session,
    interview_turn
)
from app.routes.auth import router as auth_router
from app.routes.resume import router as resume_router
from app.routes.search import router as search_router
from app.routes.interview import router as interview_router
from app.routes.interview_session import router as interview_session_router
from app.routes.feedback import router as feedback_router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(search_router)
app.include_router(interview_router)
app.include_router(interview_session_router)
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(feedback_router)

@app.get("/")
def root():
    return {"message": "Backend running successfully"}
