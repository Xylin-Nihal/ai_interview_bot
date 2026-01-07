from pydantic import BaseModel


class InterviewAnswerSubmit(BaseModel):
    session_id: int
    answer: str
