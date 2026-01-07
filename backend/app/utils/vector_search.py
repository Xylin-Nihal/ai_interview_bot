import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session

from app.models.resume_chunk import ResumeChunk
from app.utils.embedding import embed_text


def search_resume_chunks(
    db: Session,
    resume_id: int,
    query: str,
    top_k: int = 3
):
    # Embed the query
    query_embedding = embed_text(query)

    # Fetch chunks for this resume
    chunks = db.query(ResumeChunk).filter(
        ResumeChunk.resume_id == resume_id
    ).all()

    if not chunks:
        return []

    # Prepare vectors
    chunk_embeddings = np.array([c.embedding for c in chunks])
    query_embedding = query_embedding.reshape(1, -1)

    # Compute similarity
    similarities = cosine_similarity(query_embedding, chunk_embeddings)[0]

    # Rank chunks
    ranked_chunks = sorted(
        zip(chunks, similarities),
        key=lambda x: x[1],
        reverse=True
    )

    # Return top K chunks
    return [
        {
            "content": chunk.content,
            "score": float(score)
        }
        for chunk, score in ranked_chunks[:top_k]
    ]
