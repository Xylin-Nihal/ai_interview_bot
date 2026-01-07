from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.groq_client import generate_with_groq
from app.models.interview_turn import InterviewTurn
from app.schemas.interview_answer import InterviewAnswerSubmit

from app.database import get_db
from app.core.security import get_current_user
from app.utils.vector_search import search_resume_chunks
from app.utils.prompt_builder import build_interview_prompt

router = APIRouter(
    prefix="/interview",
    tags=["Interview Bot"]
)

@router.post("/question")
def generate_interview_question(
    session_id: int,
    interview_type: str,
    resume_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Count main questions
    main_questions_count = (
        db.query(InterviewTurn)
        .filter(
            InterviewTurn.session_id == session_id,
            InterviewTurn.is_follow_up == False
        )
        .count()
    )

    if main_questions_count >= 5:
        return {
            "message": "Interview completed",
            "total_main_questions": 5
        }

    # RAG retrieval
    resume_chunks = search_resume_chunks(
        db=db,
        resume_id=resume_id,
        query=interview_type,
        top_k=3
    )

    prompt = build_interview_prompt(
        interview_type=interview_type,
        resume_chunks=resume_chunks
    )

    question = generate_with_groq(prompt)

    # Store MAIN question
    turn = InterviewTurn(
        session_id=session_id,
        question=question,
        is_follow_up=False
    )
    db.add(turn)
    db.commit()

    return {
        "question": question,
        "main_question_number": main_questions_count + 1
    }
@router.post("/answer")
def submit_answer(
    answer_data: InterviewAnswerSubmit,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Get last main question (that has no follow-up yet)
    last_main_question = (
        db.query(InterviewTurn)
        .filter(
            InterviewTurn.session_id == answer_data.session_id,
            InterviewTurn.is_follow_up == False
        )
        .order_by(InterviewTurn.created_at.desc())
        .first()
    )

    if not last_main_question:
        return {"error": "No main question found"}

    # Save answer
    last_main_question.answer = answer_data.answer
    db.commit()

    # Check if follow-up already exists for this main question
    follow_up_exists = (
        db.query(InterviewTurn)
        .filter(
            InterviewTurn.session_id == answer_data.session_id,
            InterviewTurn.is_follow_up == True,
            InterviewTurn.created_at > last_main_question.created_at
        )
        .first()
    )

    if follow_up_exists:
        return {"message": "Follow-up already asked"}

    # Generate ONE follow-up
    followup_prompt = f"""
You are a professional interviewer.

Main question:
{last_main_question.question}

Candidate answer:
{answer_data.answer}

Ask ONLY ONE follow-up question.
Do NOT ask another main question.
"""

    followup_question = generate_with_groq(followup_prompt)

    followup_turn = InterviewTurn(
        session_id=answer_data.session_id,
        question=followup_question,
        is_follow_up=True
    )

    db.add(followup_turn)
    db.commit()

    return {
        "follow_up_question": followup_question
    }
