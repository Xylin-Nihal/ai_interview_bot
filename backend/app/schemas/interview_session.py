from pydantic import BaseModel

class InterviewSessionStart(BaseModel):
    resume_id: int
    interview_type: str

    class Config:
        json_schema_extra = {
            "example": {
                "resume_id": 1,
                "interview_type": "Technical"
            }
        }
