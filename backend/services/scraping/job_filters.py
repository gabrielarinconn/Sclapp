"""
Job filters for Riwi alignment: relevance, profile extraction, technology extraction.
Used before persisting companies from job-based sources (remoteok, remotive).
"""

import re
from typing import Any

# --- Señales de roles tech (aceptar) ---
RIWI_ACCEPT_SIGNALS = [
    "software", "developer", "frontend", "backend", "fullstack", "full stack",
    "data", "qa", "testing", "devops", "engineer", "support engineer",
    "web developer", "mobile developer", "app developer",
]

# --- Señales de exclusión (roles no alineados o seniority alta) ---
RIWI_EXCLUDE_SIGNALS = [
    "senior", "sr.", "sr ", "lead", "principal", "staff", "manager",
    "director", "marketing", "sales", "recruiter", "hr ", " hr", "human resources",
    "finance", "accountant", "legal", "executive", "vp ", " vp", "chief",
]

# --- Señales de preferencia (junior / entry) ---
RIWI_JUNIOR_SIGNALS = [
    "junior", "trainee", "internship", "intern ", " apprentice", "apprentice",
    "entry level", "entry-level", "graduate", "associate developer",
]

# --- Perfiles soportados (company.category) ---
PROFILE_OPTIONS = [
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "QA Engineer",
    "DevOps Engineer",
    "Software Developer",
]

# --- Mapeo título/etiquetas -> perfil ---
PROFILE_KEYWORDS = [
    (["backend", "back-end", "back end"], "Backend Developer"),
    (["frontend", "front-end", "front end", "frontend developer", "react", "vue", "angular"], "Frontend Developer"),
    (["fullstack", "full-stack", "full stack"], "Full Stack Developer"),
    (["data analyst", "data analysis", "analytics", "power bi", "pandas", "bi "], "Data Analyst"),
    (["qa", "quality assurance", "test engineer", "selenium", "playwright", "testing"], "QA Engineer"),
    (["devops", "dev ops", "sre", "infrastructure"], "DevOps Engineer"),
]

# --- Tecnologías conocidas (para extracción) ---
KNOWN_TECHNOLOGIES = [
    "python", "javascript", "typescript", "java", "c#", "c++", "php", "ruby",
    "go", "golang", "rust", "node", "node.js", "nodejs", "react", "vue", "angular",
    "django", "flask", "fastapi", "spring", "laravel", "postgresql", "mysql",
    "mongodb", "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "git",
    "linux", "selenium", "playwright", "pandas", "power bi", "excel", "sql",
    "html", "css", "redux", "next.js", "nestjs", "graphql", "rest", "api",
]


def _text_from(raw_job: dict[str, Any], *keys: str) -> str:
    """Concatenate string values from raw_job for given keys."""
    parts = []
    for k in keys:
        v = raw_job.get(k)
        if v is None:
            continue
        if isinstance(v, str):
            parts.append(v)
        elif isinstance(v, list):
            parts.append(" ".join(str(x) for x in v))
    return " ".join(parts).lower()


def _has_any_signal(text: str, signals: list[str]) -> bool:
    """True if text (lower) contains any of the signals as whole words or clear substrings."""
    if not text:
        return False
    text = f" {text} "
    for s in signals:
        if not s.strip():
            continue
        # word boundary style: avoid "sales" in "analytics"
        pattern = r"\b" + re.escape(s.strip().lower()) + r"\b"
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def is_riwi_relevant_job(
    raw_job: dict[str, Any],
    only_riwi_relevant: bool = True,
    require_junior_focus: bool = False,
) -> bool:
    """
    Evalúa si la vacante es relevante para Riwi (roles tech, preferencia junior).
    Usa título, categoría, tags y descripción si existen.
    - Acepta si hay señales de roles tech.
    - Excluye si hay señales de seniority alta o roles no alineados.
    - Opcional: dar preferencia a junior/trainee/internship (require_junior_focus).
    """
    if not only_riwi_relevant:
        return True

    text = _text_from(
        raw_job,
        "job_title", "position", "title",
        "job_category", "category",
        "tags", "technologies",
        "job_description", "description",
    )

    if not text.strip():
        return True

    if _has_any_signal(text, RIWI_EXCLUDE_SIGNALS):
        return False
    if not _has_any_signal(text, RIWI_ACCEPT_SIGNALS):
        return False
    if require_junior_focus and not _has_any_signal(text, RIWI_JUNIOR_SIGNALS):
        return False
    return True


def extract_profile_from_job(raw_job: dict[str, Any]) -> str | None:
    """
    Devuelve el perfil principal detectado para company.category.
    Opciones: Backend Developer, Frontend Developer, Full Stack Developer,
    Data Analyst, QA Engineer, DevOps Engineer, Software Developer.
    Si no hay uno claro, devuelve None o "Software Developer".
    """
    text = _text_from(
        raw_job,
        "job_title", "position", "title",
        "job_category", "category",
        "tags", "technologies",
    )
    if not text:
        return "Software Developer"
    text = f" {text} "
    for keywords, profile in PROFILE_KEYWORDS:
        for kw in keywords:
            if re.search(r"\b" + re.escape(kw) + r"\b", text, re.IGNORECASE):
                return profile
    return "Software Developer"


def extract_technologies_from_job(raw_job: dict[str, Any]) -> list[str]:
    """
    Extrae tecnologías desde tags, category, job_title, job_description.
    Usa lista de tecnologías conocidas; devuelve nombres normalizados (lower, sin duplicados).
    """
    text = _text_from(
        raw_job,
        "job_title", "position", "title",
        "job_category", "category",
        "tags", "technologies",
        "job_description", "description",
    )
    found: list[str] = []
    seen: set[str] = set()
    text_lower = text.lower()
    for tech in KNOWN_TECHNOLOGIES:
        if tech in seen:
            continue
        # match as word to avoid "go" in "google"
        pattern = r"\b" + re.escape(tech) + r"\b"
        if re.search(pattern, text_lower):
            found.append(tech)
            seen.add(tech)
    return found
