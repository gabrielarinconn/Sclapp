# TODO (Copilot): Build the scraping orchestrator for Week 1 (HU-04).
# Requirements:
# - In-memory fake_db = {} to simulate companies table keyed by "dedupe_key".
# - mock_upsert(company) returns True if inserted, False if updated.
# - run_scraping(parameters: dict|None=None) -> dict
#   Steps:
#   1) Execute scraper (example_source.scrape)
#   2) Ensure contract keys exist (_safe_company_contract)
#   3) Generate dedupe_key using normalizer.generate_dedupe_key
#   4) Upsert in fake_db and count totals: total_found/new/updated/failed
#   5) try/except per company so one failure doesn't break all
#   6) execution_status: SUCCESS if failed==0, PARTIAL if 0<failed<found, FAILED otherwise
#   7) build scraping_log dict with source, parameters, totals, execution_status, duration_seconds, timestamps
# - Return final JSON:
#   {
#     "total_found": int,
#     "total_new": int,
#     "total_updated": int,
#     "total_failed": int,
#     "execution_status": "SUCCESS|PARTIAL|FAILED",
#     "scraping_log": {...},
#     "errors": [...]
#   }
# Add clear comments for each step.

from typing import Any, Dict, List, Optional
import time
from datetime import datetime
from . import normalizer
from .sources import example_source

# In-memory fake DB keyed by dedupe_key
fake_db: Dict[str, Dict[str, Any]] = {}


def _safe_company_contract(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensure the company dict contains all required keys with safe defaults.
    Required contract:
      {
        "name": str,
        "nit": str|None,
        "email": str|None,
        "phone": str|None,
        "url": str|None,
        "country": str|None,
        "sector": str|None,
        "technologies": list[str],
        "source": str,
        "source_url": str|None
      }
    """
    return {
        "name": str(raw.get("name") or ""),
        "nit": raw.get("nit"),
        "email": raw.get("email"),
        "phone": raw.get("phone"),
        "url": raw.get("url"),
        "country": raw.get("country"),
        "sector": raw.get("sector"),
        "technologies": list(raw.get("technologies") or []),
        "source": str(raw.get("source") or ""),
        "source_url": raw.get("source_url"),
    }


def mock_upsert(company: Dict[str, Any]) -> bool:
    """
    Insert or update the company in fake_db.
    Returns True if inserted (new), False if updated (existing).
    """
    dedupe_key = company.get("dedupe_key", "")
    is_new = dedupe_key not in fake_db
    # Store a shallow copy to simulate persistence
    fake_db[dedupe_key] = dict(company)
    return is_new


def run_scraping(parameters: Optional[Dict[str, Any]] = None, debug: bool = False) -> Dict[str, Any]:
    """
    Orchestrator for scraping.

    Behavior:
      - Executes the scraper and upserts results into an in-memory fake_db.
      - Returns a dict with exactly the keys:
          "total_found", "total_new", "total_updated", "total_failed", "execution_status"
        when debug=False.
      - If debug=True the returned dict will also include "scraping_log" and "errors".
    """
    start_ts = datetime.utcnow().isoformat() + "Z"
    t0 = time.perf_counter()

    totals = {"total_found": 0, "total_new": 0, "total_updated": 0, "total_failed": 0}
    errors: List[str] = []

    # ✅ Default parameters (para que el log nunca quede vacío)
    if not parameters:
        parameters = {"source": "example_source"}

    # ✅ Fuente elegida por parameters
    source_name = parameters["source"]

    # 1) Execute scraper
    try:
        if source_name == "example_source":
            companies = example_source.scrape()
        else:
            raise ValueError(f"Unknown source: {source_name}")
    except Exception as e:
        # If the whole scrape fails, prepare totals and scraping_log
        totals["total_found"] = 0
        totals["total_failed"] = 1  # ✅ si falla globalmente, hubo al menos 1 fallo

        duration = time.perf_counter() - t0
        finished_ts = datetime.utcnow().isoformat() + "Z"

        scraping_log = {
            "source": source_name,
            "parameters": parameters,

            # ✅ Totales aplanados (match con tabla scraping_logs)
            "total_found": totals["total_found"],
            "total_new": totals["total_new"],
            "total_updated": totals["total_updated"],
            "total_failed": totals["total_failed"],

            # (opcional) también dejamos el objeto totals para debug
            "totals": totals,

            "execution_status": "FAILED",
            "duration_seconds": duration,
            "started_at": start_ts,
            "finished_at": finished_ts,
        }

        errors = [f"scrape_error: {repr(e)}"]

        base_result = {
            "total_found": totals["total_found"],
            "total_new": totals["total_new"],
            "total_updated": totals["total_updated"],
            "total_failed": totals["total_failed"],
            "execution_status": "FAILED",
        }
        if debug:
            base_result["scraping_log"] = scraping_log
            base_result["errors"] = errors
        return base_result

    totals["total_found"] = len(companies)

    # 2..5) Process each company independently with per-item try/except
    for idx, raw in enumerate(companies):
        try:
            safe = _safe_company_contract(raw)

            # 3) Generate dedupe_key
            dedupe_key = normalizer.generate_dedupe_key(safe)
            safe["dedupe_key"] = dedupe_key

            # 4) Upsert
            inserted = mock_upsert(safe)
            if inserted:
                totals["total_new"] += 1
            else:
                totals["total_updated"] += 1

        except Exception as e:
            totals["total_failed"] += 1
            errors.append(f"item_{idx}_error: {repr(e)}")

    # 6) Determine execution_status
    failed = totals["total_failed"]
    found = totals["total_found"]
    if failed == 0:
        execution_status = "SUCCESS"
    elif 0 < failed < found:
        execution_status = "PARTIAL"
    else:
        execution_status = "FAILED"

    duration = time.perf_counter() - t0
    finished_ts = datetime.utcnow().isoformat() + "Z"

    # 7) Build scraping_log (kept internally and optionally returned in debug)
    scraping_log = {
        "source": source_name,
        "parameters": parameters,

        # ✅ Totales aplanados (match con tabla scraping_logs)
        "total_found": totals["total_found"],
        "total_new": totals["total_new"],
        "total_updated": totals["total_updated"],
        "total_failed": totals["total_failed"],

        # (opcional) también dejamos el objeto totals para debug
        "totals": totals,

        "execution_status": execution_status,
        "duration_seconds": duration,
        "started_at": start_ts,
        "finished_at": finished_ts,
    }

    # Base result must match the exact required shape
    result: Dict[str, Any] = {
        "total_found": totals["total_found"],
        "total_new": totals["total_new"],
        "total_updated": totals["total_updated"],
        "total_failed": totals["total_failed"],
        "execution_status": execution_status,
    }

    # Include debug info only when requested
    if debug:
        result["scraping_log"] = scraping_log
        result["errors"] = errors

    return result