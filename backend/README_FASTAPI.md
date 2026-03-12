# SCLAPP FastAPI Backend

## Run the API

From the **project root** (parent of `backend/`):

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

- API base URL: `http://localhost:8000`
- Frontend expects: `http://localhost:8000/api`
- Interactive docs: `http://localhost:8000/docs`

## Environment

Create a `.env` in the project root (or in `backend/`) with:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` for PostgreSQL
- `CORS_ORIGINS` (optional, comma-separated, e.g. `http://localhost:3000,http://127.0.0.1:5500`)
- `SECRET_KEY` (optional, for auth later)

## Endpoints (under `/api`)

- `POST /api/auth/login` — login
- `POST /api/auth/register` — register
- `GET /api/companies` — list companies (query params: `tech`, `score`, `search`)
- `GET /api/dashboard/metrics` — dashboard KPIs
- `GET /api/dashboard/ai-report` — AI report items
- `POST /api/scraping/run` — trigger scraping
- `GET /api/emails/pipeline` — email pipeline (kanban)
- `POST /api/emails/template/ai` — generate email template
- `POST /api/emails/send-bulk` — bulk send
- `GET /api/profile/me`, `PUT /api/profile/me`, `PUT /api/profile/smtp`, `POST /api/profile/smtp/test`
