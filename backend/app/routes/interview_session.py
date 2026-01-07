from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.security import get_current_user
from app.models.interview_session import InterviewSession
from app.schemas.interview_session import InterviewSessionStart

router = APIRouter(
    prefix="/interview-session",
    tags=["Interview Session"]
)

@router.post("/start")
def start_interview(
    session_data: InterviewSessionStart,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Validate resume exists and belongs to user
    try:
        session = InterviewSession(
            user_id=current_user.id,
            resume_id=session_data.resume_id,
            interview_type=session_data.interview_type
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        return {
            "message": "Interview session started",
            "session_id": session.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to start interview session: {str(e)}"
        )
