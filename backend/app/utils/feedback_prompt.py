def build_feedback_prompt(interview_type: str, qa_pairs: list) -> str:
    formatted_qa = ""

    for idx, qa in enumerate(qa_pairs, start=1):
        formatted_qa += f"""
Question {idx}:
{qa['question']}

Answer:
{qa['answer']}
"""

    prompt = f"""
You are an expert interview evaluator.

Interview type: {interview_type}

Below is a full interview transcript.

{formatted_qa}

Evaluate the candidate and return feedback STRICTLY in JSON with this format:

{{
  "overall_score": number (0-10),
  "strengths": [list of strings],
  "weaknesses": [list of strings],
  "communication_feedback": string,
  "technical_feedback": string,
  "suggestions": [list of strings]
}}

Rules:
- Be honest but constructive
- Do NOT include explanations outside JSON
- Do NOT add extra fields
"""

    return prompt.strip()
