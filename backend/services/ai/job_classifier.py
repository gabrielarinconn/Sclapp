"""
OpenAI-based job classification for Riwi: relevance, profile, score, technologies.
Fallback to rule-based extraction if API key missing or request fails.
"""

import json
import re
from typing import Any

from backend.core.config import get_settings

PROFILE_OPTIONS = [
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "QA Engineer",
    "DevOps Engineer",
    "Software Developer",
]


def _build_prompt(raw_job: dict[str, Any]) -> str:
    """Build a short text block for the LLM from raw_job."""
    parts = []
    if raw_job.get("company_name"):
        parts.append(f"Company: {raw_job['company_name']}")
    if raw_job.get("job_title") or raw_job.get("position") or raw_job.get("title"):
        title = raw_job.get("job_title") or raw_job.get("position") or raw_job.get("title")
        parts.append(f"Job title: {title}")
    if raw_job.get("job_category") or raw_job.get("category"):
        cat = raw_job.get("job_category") or raw_job.get("category")
        parts.append(f"Category: {cat}")
    tags = raw_job.get("tags") or raw_job.get("technologies")
    if tags:
        parts.append(f"Tags: {tags if isinstance(tags, list) else [tags]}")
    if raw_job.get("job_description") or raw_job.get("description"):
        desc = (raw_job.get("job_description") or raw_job.get("description")) or ""
        if isinstance(desc, str) and len(desc) > 1200:
            desc = desc[:1200] + "..."
        parts.append(f"Description: {desc}")
    if raw_job.get("source"):
        parts.append(f"Source: {raw_job['source']}")
    return "\n".join(parts) if parts else "No job data"


def _validate_ai_response(data: dict[str, Any]) -> dict[str, Any]:
    """Ensure profile, score, technologies match expected schema."""
    profile = data.get("profile")
    if profile not in PROFILE_OPTIONS:
        profile = "Software Developer"
    score = data.get("score")
    if score is not None:
        try:
            score = int(score)
            if score not in (1, 2, 3):
                score = None
        except (TypeError, ValueError):
            score = None
    techs = data.get("technologies")
    if not isinstance(techs, list):
        techs = []
    techs = [str(t).strip().lower() for t in techs if t and isinstance(t, (str, int))][:15]
    return {
        "is_relevant": bool(data.get("is_relevant")),
        "profile": profile,
        "score": score,
        "technologies": techs,
        "reason": str(data.get("reason") or "")[:200],
    }


def classify_job_with_ai(raw_job: dict[str, Any]) -> dict[str, Any] | None:
    """
    Classify job with OpenAI: is_relevant, profile, score (1-3), technologies, reason.
    Returns None if API key missing or request fails (caller should use rule-based fallback).
    """
    settings = get_settings()
    api_key = settings.get("openai_api_key")
    model = settings.get("openai_model") or "gpt-4o-mini"

    if not api_key or not str(api_key).strip():
        return None

    prompt_text = _build_prompt(raw_job)
    system = (
        "You classify job postings for Riwi (tech talent). Reply only with valid JSON, no markdown.\n"
        "Keys: is_relevant (boolean), profile (string), score (int), technologies (list of strings), reason (short string).\n"
        "profile must be exactly one of: Backend Developer, Frontend Developer, Full Stack Developer, "
        "Data Analyst, QA Engineer, DevOps Engineer, Software Developer.\n"
        "score: 1=low, 2=medium, 3=high fit for junior/trainee talent.\n"
        "technologies: short list of real tech stack (e.g. python, react, postgresql). "
        "Avoid business terms like insurance, trading, onboarding, research, project management."
    )
    user = f"Classify this job:\n{prompt_text}"

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            max_tokens=400,
            temperature=0.2,
        )
        content = (response.choices[0].message.content or "").strip()
        if not content:
            return None
        content = re.sub(r"^```\w*\n?", "", content)
        content = re.sub(r"\n?```\s*$", "", content)
        data = json.loads(content)
        return _validate_ai_response(data)
    except Exception:
        return None
