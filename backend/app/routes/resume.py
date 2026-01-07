import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.pdf_extractor import extract_text_from_pdf
from app.utils.text_cleaner import clean_resume_text
from app.utils.text_chunker import chunk_text
from app.models.resume_chunk import ResumeChunk
from app.utils.embedding import embed_text

from app.database import get_db
from app.models.resume import Resume
from app.core.security import get_current_user

UPLOAD_DIR = "uploads"

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    raw_text = extract_text_from_pdf(file_path)
    cleaned_text = clean_resume_text(raw_text)

    resume = Resume(
        user_id=current_user.id,
        file_name=file.filename,
        file_path=file_path,
        extracted_text=cleaned_text

    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    # ---- Chunk the cleaned resume text ----
    chunks = chunk_text(resume.extracted_text)
    for chunk in chunks:
        embedding = embed_text(chunk)

        chunk_obj = ResumeChunk(
        resume_id=resume.id,
        content=chunk,
        embedding=embedding.tolist()  # convert numpy → JSON
    )
        db.add(chunk_obj)

    db.commit()

    return {
    "message": "Resume uploaded and chunked successfully",
    "resume_id": resume.id,
    "total_chunks": len(chunks)
}