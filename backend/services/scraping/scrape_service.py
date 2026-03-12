# Scraping orchestrator: runs scraper, normalizes, deduplicates against PostgreSQL,
# persists company and scraping_logs. No fake_db.

from __future__ import annotations

import json
import time
from datetime import datetime
from typing import Any, Dict, List, Optional

from backend.db.connection import execute_query, get_db_info
from . import normalizer
from .sources import example_source


def _safe_company_contract(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensure the company dict contains all required keys with safe defaults.
    Contract: name, nit, email, phone, url, country, sector, technologies, source, source_url.
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


def _normalize_nit(nit: Optional[str]) -> Optional[str]:
    """Return digits-only NIT or None if empty."""
    if nit is None:
        return None
    import re
    digits = re.sub(r"\D", "", str(nit))
    return digits if digits else None


def find_existing_company(
    nit: Optional[str],
    country: Optional[str],
    name_normalization: str,
) -> Optional[Dict[str, Any]]:
    """
    Find an existing company by nit if present, else by (country, name_normalization).
    Returns first row as dict or None.
    """
    nit_clean = _normalize_nit(nit) if nit else None
    if nit_clean:
        rows = execute_query(
            "SELECT * FROM company WHERE nit = %s LIMIT 1",
            (nit_clean,),
        )
        if rows and len(rows) > 0:
            return dict(rows[0])

    country_val = (country or "").strip() or None
    if country_val is not None:
        rows = execute_query(
            "SELECT * FROM company WHERE country = %s AND name_normalization = %s LIMIT 1",
            (country_val, name_normalization),
        )
    else:
        rows = execute_query(
            "SELECT * FROM company WHERE (country IS NULL OR trim(coalesce(country, '')) = '') AND name_normalization = %s LIMIT 1",
            (name_normalization,),
        )
    if rows and len(rows) > 0:
        return dict(rows[0])
    return None


def insert_company(
    nit: Optional[str],
    name: str,
    name_normalization: str,
    sector: Optional[str],
    email: Optional[str],
    phone: Optional[str],
    url: Optional[str],
    country: Optional[str],
    description: Optional[str] = None,
) -> bool:
    """Insert a new company. id_status is set by DB trigger."""
    res = execute_query(
        """
        INSERT INTO company (nit, name, name_normalization, sector, email, phone, url, country, description)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            nit or None,
            name or "",
            name_normalization,
            sector or None,
            email or None,
            phone or None,
            url or None,
            (country or "").strip() or None,
            description or None,
        ),
        fetch=False,
    )
    return res is True


def update_company(
    id_company: int,
    existing: Dict[str, Any],
    sector: Optional[str],
    email: Optional[str],
    phone: Optional[str],
    url: Optional[str],
    description: Optional[str],
) -> bool:
    """Update only empty fields with new values."""
    updates: List[str] = []
    params: List[Any] = []
    for field, new_val in [
        ("sector", sector),
        ("email", email),
        ("phone", phone),
        ("url", url),
        ("description", description),
    ]:
        cur = existing.get(field)
        is_empty = cur is None or (isinstance(cur, str) and cur.strip() == "")
        has_new = new_val is not None and (not isinstance(new_val, str) or new_val.strip() != "")
        if is_empty and has_new:
            updates.append(f"{field} = %s")
            params.append(new_val)
    if not updates:
        return True
    params.append(id_company)
    res = execute_query(
        "UPDATE company SET " + ", ".join(updates) + " WHERE id_company = %s",
        tuple(params),
        fetch=False,
    )
    return res is True


def _get_first_user_id() -> Optional[int]:
    """Return id_user of the first user for use when no user_id is provided (e.g. for scraping_logs FK)."""
    rows = execute_query("SELECT id_user FROM users ORDER BY id_user LIMIT 1", ())
    if rows and len(rows) > 0:
        return int(rows[0]["id_user"])
    return None


def insert_scraping_log(
    id_user: int,
    source: str,
    parameters: Dict[str, Any],
    total_found: int,
    total_new: int,
    total_updated: int,
    total_failed: int,
    execution_status: str,
    error_message: Optional[str],
    duration_second: Optional[int],
) -> None:
    """
    Insert one row into scraping_logs. executed_at uses DB default.
    Uses INSERT ... RETURNING * to confirm insert; prints row and DB info for debugging.
    Raises if the INSERT fails (e.g. FK violation); errors are not silenced.
    """
    db_info = get_db_info()
    print(f"[scraping_log] DB backend usa: host={db_info['host']} port={db_info['port']} database={db_info['database']}")

    params_json = json.dumps(parameters) if parameters else "{}"
    rows = execute_query(
        """
        INSERT INTO scraping_logs (id_user, source, parameters, total_found, total_new, total_updated, total_failed, execution_status, error_message, duration_second)
        VALUES (%s, %s, %s::jsonb, %s, %s, %s, %s, %s, %s, %s)
        RETURNING *
        """,
        (
            id_user,
            source,
            params_json,
            total_found,
            total_new,
            total_updated,
            total_failed,
            execution_status,
            error_message,
            duration_second,
        ),
        fetch=True,
    )
    if not rows or len(rows) != 1:
        raise RuntimeError(
            f"INSERT scraping_log no devolvió una fila (RETURNING *): rows={rows!r}"
        )
    inserted = dict(rows[0])
    print(f"[scraping_log] INSERT OK: id_scraping={inserted.get('id_scraping')} source={source} execution_status={execution_status}")


def run_scraping(
    parameters: Optional[Dict[str, Any]] = None,
    user_id: Optional[int] = None,
    debug: bool = False,
) -> Dict[str, Any]:
    """
    Orchestrator: run scraper, normalize, deduplicate against PostgreSQL,
    insert/update company, then insert scraping_log. Returns public result dict.
    """
    start_ts = datetime.utcnow().isoformat() + "Z"
    t0 = time.perf_counter()
    totals = {"total_found": 0, "total_new": 0, "total_updated": 0, "total_failed": 0}
    errors: List[str] = []

    if not parameters:
        parameters = {"source": "example_source"}
    source_name = parameters.get("source") or "example_source"

    # Resolve user_id for scraping_logs (required by FK). Always record a log.
    effective_user_id = user_id if user_id is not None else _get_first_user_id()
    if effective_user_id is None:
        raise RuntimeError(
            "Cannot record scraping_log: no user_id provided and no users in database."
        )

    # 1) Execute scraper
    try:
        if source_name == "example_source":
            companies = example_source.scrape()
        else:
            raise ValueError(f"Unknown source: {source_name}")
    except Exception as e:
        totals["total_found"] = 0
        totals["total_failed"] = 1
        duration = time.perf_counter() - t0
        execution_status = "FAILED"
        insert_scraping_log(
            id_user=effective_user_id,
            source=source_name,
            parameters=parameters,
            total_found=0,
            total_new=0,
            total_updated=0,
            total_failed=1,
            execution_status=execution_status,
            error_message=str(e),
            duration_second=int(round(duration)),
        )
        result = {
            "total_found": 0,
            "total_new": 0,
            "total_updated": 0,
            "total_failed": 1,
            "execution_status": execution_status,
        }
        if debug:
            result["errors"] = [f"scrape_error: {repr(e)}"]
        return result

    totals["total_found"] = len(companies)

    for idx, raw in enumerate(companies):
        try:
            safe = _safe_company_contract(raw)
            name_norm = normalizer.normalize_name(safe.get("name"))
            safe["name_normalization"] = name_norm
            dedupe_key = normalizer.generate_dedupe_key(safe)
            safe["dedupe_key"] = dedupe_key

            nit_clean = _normalize_nit(safe.get("nit")) or None
            country_val = (safe.get("country") or "").strip() or None
            existing = find_existing_company(nit_clean, country_val, name_norm)

            if existing:
                ok = update_company(
                    id_company=existing["id_company"],
                    existing=existing,
                    sector=safe.get("sector"),
                    email=safe.get("email"),
                    phone=safe.get("phone"),
                    url=safe.get("url"),
                    description=None,
                )
                if ok:
                    totals["total_updated"] += 1
                else:
                    totals["total_failed"] += 1
                    errors.append(f"item_{idx}_update_failed")
            else:
                ok = insert_company(
                    nit=nit_clean or safe.get("nit"),
                    name=safe.get("name") or "",
                    name_normalization=name_norm,
                    sector=safe.get("sector"),
                    email=safe.get("email"),
                    phone=safe.get("phone"),
                    url=safe.get("url"),
                    country=country_val,
                    description=None,
                )
                if ok:
                    totals["total_new"] += 1
                else:
                    totals["total_failed"] += 1
                    errors.append(f"item_{idx}_insert_failed")
        except Exception as e:
            totals["total_failed"] += 1
            errors.append(f"item_{idx}_error: {repr(e)}")

    failed = totals["total_failed"]
    found = totals["total_found"]
    if failed == 0:
        execution_status = "SUCCESS"
    elif 0 < failed < found:
        execution_status = "PARTIAL"
    else:
        execution_status = "FAILED"

    duration = time.perf_counter() - t0
    insert_scraping_log(
        id_user=effective_user_id,
        source=source_name,
        parameters=parameters,
        total_found=totals["total_found"],
        total_new=totals["total_new"],
        total_updated=totals["total_updated"],
        total_failed=totals["total_failed"],
        execution_status=execution_status,
        error_message="; ".join(errors) if errors else None,
        duration_second=int(round(duration)),
    )

    result: Dict[str, Any] = {
        "total_found": totals["total_found"],
        "total_new": totals["total_new"],
        "total_updated": totals["total_updated"],
        "total_failed": totals["total_failed"],
        "execution_status": execution_status,
    }
    if debug:
        result["errors"] = errors
    return result
