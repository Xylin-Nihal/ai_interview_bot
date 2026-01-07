from sqlalchemy import Column, Integer, Text, ForeignKey, JSON
from app.database import Base

class ResumeChunk(Base):
    __tablename__ = "resume_chunks"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(JSON, nullable=False)