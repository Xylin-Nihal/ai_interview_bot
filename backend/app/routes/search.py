from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.security import get_current_user
from app.utils.vector_search import search_resume_chunks

router = APIRouter(
    prefix="/search",
    tags=["RAG Search"]
)

@router.get("/resume")
def search_resume(
    query: str = Query(..., description="Search query"),
    resume_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    results = search_resume_chunks(
        db=db,
        resume_id=resume_id,
        query=query,
        top_k=3
    )

    return {
        "query": query,
        "results": results
    }
