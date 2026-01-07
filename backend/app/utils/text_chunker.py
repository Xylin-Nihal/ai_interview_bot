from typing import List

def chunk_text(
    text: str,
    chunk_size: int = 1000,
    overlap: int = 100
) -> List[str]:
    """
    Splits text into overlapping chunks.
    """

    if not text:
        return []

    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]

        chunks.append(chunk.strip())

        start = end - overlap  # overlap helps retain context

    return chunks
