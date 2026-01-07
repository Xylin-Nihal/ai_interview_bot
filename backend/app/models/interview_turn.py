from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class InterviewTurn(Base):
    __tablename__ = "interview_turns"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"), nullable=False)

    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)

    is_follow_up = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
