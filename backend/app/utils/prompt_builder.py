def build_followup_prompt(
    interview_type: str,
    main_question: str,
    candidate_answer: str
) -> str:
    if interview_type.lower() == "technical":
        role = "a technical interviewer"
        focus = "Ask a follow-up that digs deeper into technical details, implementation, trade-offs, or clarifications."
    elif interview_type.lower() == "hr":
        role = "an HR interviewer"
        focus = "Ask a thoughtful follow-up that explores their answer deeper, like 'How did that make you feel?' or 'What did you learn from that?'"
    else:  # aptitude
        role = "an aptitude test interviewer"
        focus = "Ask a follow-up that extends the reasoning, like 'What if...?' or asks them to explain their approach."

    prompt = f"""
You are {role}.

Main Question:
{main_question}

Candidate Answer:
{candidate_answer}

{focus}

Rules:
- Ask only ONE follow-up question
- Make it natural and conversational
- Don't repeat the question
- Keep it concise
- Be a real interviewer
"""

    return prompt.strip()


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
        focus = "Ask about technical skills, programming languages, frameworks, system design, coding problems, or technical projects mentioned in the resume."
    elif interview_type.lower() == "hr":
        role = "an HR interviewer"
        focus = "Ask about soft skills, experience, work style, teamwork, challenges overcome, or career goals. Make it conversational and natural."
    else:  # aptitude
        role = "an aptitude test interviewer"
        focus = "Ask a logical reasoning, problem-solving, or analytical question. You can reference the resume but keep the question general and focused on reasoning skills."

    prompt = f"""
You are {role}.

Resume Context:
{context}

{focus}

Rules:
- Ask only ONE natural interview question
- Do NOT mention 'Here is a question from resume'
- Do NOT give answers
- Be conversational and direct
- Ask naturally like you're speaking to the candidate
- Do NOT say 'Based on your resume' - just ask the question naturally
"""

    return prompt.strip()
