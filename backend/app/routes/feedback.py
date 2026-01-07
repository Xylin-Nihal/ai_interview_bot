from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
import re
from app.database import get_db
from app.core.security import get_current_user
from app.models.interview_session import InterviewSession
from app.models.interview_turn import InterviewTurn
from app.utils.feedback_prompt import build_feedback_prompt
from app.utils.groq_client import generate_with_groq

router = APIRouter(
    prefix="/interview",
    tags=["Interview Feedback"]
)

@router.post("/feedback")
def generate_feedback(
    session_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")

    turns = (
        db.query(InterviewTurn)
        .filter(
            InterviewTurn.session_id == session_id,
            InterviewTurn.answer.isnot(None)
        )
        .order_by(InterviewTurn.created_at)
        .all()
    )

    # Count MAIN questions (not follow-ups)
    main_questions_count = (
        db.query(InterviewTurn)
        .filter(
            InterviewTurn.session_id == session_id,
            InterviewTurn.is_follow_up == False
        )
        .count()
    )

    if main_questions_count < 5:
        raise HTTPException(
            status_code=400,
            detail="Interview not completed yet"
        )

    # Get only MAIN questions with answers
    main_answers = [t for t in turns if not t.is_follow_up]

    qa_pairs = [
        {"question": t.question, "answer": t.answer}
        for t in main_answers
    ]

    prompt = build_feedback_prompt(
        interview_type=session.interview_type,
        qa_pairs=qa_pairs
    )

    # Use higher token limit for feedback generation
    ai_response = generate_with_groq(prompt, max_tokens=1500)
    print("AI RAW RESPONSE:\n", ai_response)

    try:
        # Try to extract JSON from the response
        # First, try direct parsing
        try:
            feedback = json.loads(ai_response)
        except json.JSONDecodeError:
            # If direct parsing fails, try to extract JSON object
            json_match = re.search(r"\{[\s\S]*\}", ai_response)
            if not json_match:
                raise HTTPException(
                    status_code=500,
                    detail="AI did not return valid JSON"
                )
            
            # Try to parse the extracted JSON
            feedback = json.loads(json_match.group())

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI response could not be parsed: {str(e)}"
        )

    return feedback
