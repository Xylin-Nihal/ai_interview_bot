def build_interview_prompt(
    interview_type: str,
    resume_chunks: list
) -> str:
    context = "\n\n".join(
        f"- {chunk['content']}"
        for chunk in resume_chunks
    )

    if interview_type.lower() == "technical":
        role = "a technical interviewer"
    elif interview_type.lower() == "hr":
        role = "an HR interviewer"
    else:
        role = "an aptitude test interviewer"

    prompt = f"""
You are {role}.

Use the following resume information to ask ONE interview question.

Resume Context:
{context}

Rules:
- Ask only ONE question
- Make it relevant to the resume
- Do NOT give answers
- Be realistic like a real interviewer
"""

    return prompt.strip()
