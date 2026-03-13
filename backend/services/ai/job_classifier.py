from backend.config.config import get_settings


def classify_job_with_ai(raw_job: dict) -> dict:
    settings = get_settings()
    api_key = settings.get("openai_api_key")
    model = settings.get("openai_model", "gpt-4.1-mini")

    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    raise NotImplementedError("Pending OpenAI implementation")