import re

def clean_resume_text(text: str) -> str:
    if not text:
        return ""

    # 1. Remove extra spaces
    text = re.sub(r'[ \t]+', ' ', text)

    # 2. Normalize line breaks
    text = re.sub(r'\n+', '\n', text)

    # 3. Remove page numbers (Page 1, Page 2, etc.)
    text = re.sub(r'Page\s+\d+', '', text, flags=re.IGNORECASE)

    # 4. Remove bullet symbols
    text = text.replace("•", "")
    text = text.replace("–", "")
    text = text.replace("●", "")

    # 5. Remove leading/trailing spaces
    text = text.strip()

    return text
