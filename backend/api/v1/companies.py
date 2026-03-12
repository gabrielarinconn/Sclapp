"""Companies list and filters."""

from fastapi import APIRouter, Query

from backend.db.connection import execute_query

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("")
def get_companies(
    tech: str | None = Query(None, description="Filter by technology"),
    score: str | None = Query(None, description="Filter by AI score"),
    search: str | None = Query(None, description="Search by company name"),
):
    """Return companies with optional filters. Maps DB columns to frontend shape."""
    base_sql = """
        SELECT c.id_company, c.name, c.sector, c.email, c.country,
               c.score,
               (SELECT string_agg(t.name_tech, ', ')
                FROM company_technologies ct
                JOIN technologies t ON t.id_tech = ct.id_tech
                WHERE ct.id_company = c.id_company) AS tech
        FROM company c
        WHERE 1=1
    """
    params = []
    if search:
        base_sql += " AND c.name ILIKE %s"
        params.append(f"%{search}%")
    if tech:
        base_sql += """ AND EXISTS (
            SELECT 1 FROM company_technologies ct
            JOIN technologies t ON t.id_tech = ct.id_tech
            WHERE ct.id_company = c.id_company AND t.name_tech ILIKE %s
        )"""
        params.append(f"%{tech}%")
    if score:
        base_sql += " AND c.score::text = %s"
        params.append(score)

    base_sql += " ORDER BY c.name LIMIT 500"
    rows = execute_query(base_sql, tuple(params) if params else None)
    if not rows:
        return []

    def map_row(r):
        score_label = "Alta" if r.get("score") in (2, 3) else "Media"
        return {
            "id_company": r["id_company"],
            "name": r["name"],
            "nombre": r["name"],
            "tech": r["tech"] or "—",
            "technologies": r["tech"] or "—",
            "nivel": "—",
            "level": "—",
            "ciudad": r.get("country") or "—",
            "city": r.get("country") or "—",
            "location": r.get("country") or "—",
            "score": score_label,
            "ai_score": score_label,
        }

    return [map_row(dict(row)) for row in rows]
