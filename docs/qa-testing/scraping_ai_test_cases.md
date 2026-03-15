# QA Testing – Scraping and AI Classification

## Objective
Test the scraping system, keyword filtering, AI classification, database storage, and frontend visualization.

The goal is to confirm that the system can:

- collect job data from external sources
- filter relevant jobs for Riwi
- classify jobs using AI
- extract technologies
- store companies and technologies in the database
- show useful information in the frontend

---

## Scope
This testing covers the following components:

- Scraping sources (`remotive`, `remoteok`)
- Keyword filtering (`query`)
- Riwi relevance filter (`job_filters.py`)
- AI classification (`job_classifier.py`)
- Database persistence:
  - `company`
  - `technologies`
  - `company_technologies`
  - `scraping_logs`
- Frontend visualization:
  - Dashboard
  - Companies page

---

## Preconditions

Before running the tests:

1. Backend running at `http://localhost:8000`
2. Frontend running correctly
3. PostgreSQL database available
4. Environment variables configured:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
5. Required tables exist in the database:
   - `company`
   - `technologies`
   - `company_technologies`
   - `scraping_logs`

---

# Test Cases

---

## TC-01 – Basic scraping from Remotive

**Objective**

Verify that scraping from a real job source works correctly.

**Request**

```json
{
  "parameters": {
    "source": "remotive",
    "max_items": 5
  }
}

**Endpoint**

POST /api/scraping/start

**Expected Result**

    HTTP response 200
    execution_status = SUCCESS
    total_found > 0

At least one company is inserted or updated
A new record appears in scraping_logs

**SQL Validation**
SELECT * 
FROM scraping_logs 
ORDER BY executed_at DESC 
LIMIT 1;Check that the backend filters jobs using the keyword python.


---

## TC-02 – Keyword filter: python

**Objective**

Check that the backend filters jobs using the keyword python.

**Request**

```json
{
  "parameters": {
    "source": "remotive",
    "query": "python",
    "max_items": 10,
    "only_riwi_relevant": true,
    "require_junior_focus": false
  }
}

**Expected Result**

    HTTP response 200
    total_found contains jobs related to Python
    Companies stored in the database show technologies related to Python

**SQL Validation**

SELECT name, category, score
FROM company
ORDER BY id_company DESC
LIMIT 10;

SELECT id_tech, name_tech
FROM technologies
ORDER BY id_tech DESC
LIMIT 20;


---

## TC-03 – Keyword filter: react

**Objective**

Verify that a different keyword produces different results.

**Request**
{
  "parameters": {
    "source": "remotive",
    "query": "react",
    "max_items": 10,
    "only_riwi_relevant": true,
    "require_junior_focus": false
  }
}

**Expected Result**

    HTTP response 200
    Results are more related to frontend jobs
    Technologies such as react, javascript, or typescript may appear

---


##TC-04 – Keyword filter: data

**Objective**
Validate that the system detects data-related roles.

**Request**
{
  "parameters": {
    "source": "remotive",
    "query": "data",
    "max_items": 10,
    "only_riwi_relevant": true,
    "require_junior_focus": false
  }
}

**Expected Result**

    Profiles detected may include:

    Data Analyst
    Data Engineer
    Data Scientist

    Technologies may include:

    pandas
    sql
    airflow
    dbt
    spark
    power bi


---

## TC-05 – Keyword filter: devops

**Objective**
Verify detection of DevOps and infrastructure roles.

**Request**
{
  "parameters": {
    "source": "remotive",
    "query": "devops",
    "max_items": 10,
    "only_riwi_relevant": true,
    "require_junior_focus": false
  }
}

**Expected Result**

    Possible profiles:

    DevOps Engineer
    Technologies may include:
    docker
    kubernetes
    aws
    linux

---

## TC-06 – AI scoring validation

**Objective**
Verify that the AI assigns a score and category.

**Expected Result**

    Stored companies should have:

    score between 1 and 3
    category not empty

**SQL Validation**

SELECT name, category, score
FROM company
WHERE score IS NOT NULL
ORDER BY score DESC
LIMIT 20;

---

## TC-07 – Technology extraction validation

**Objective**

Verify that technologies are correctly extracted and stored.

**Expected Result**

    Technologies table contains real technical tools
    company_technologies links companies with technologies
    Business terms should not appear as technologies

    Examples that should NOT appear:

    insurance
    onboarding
    project management
    trading

**SQL Validation**

SELECT *
FROM technologies
ORDER BY id_tech DESC;

SELECT ct.id_company, c.name, t.name_tech
FROM company_technologies ct
JOIN company c ON c.id_company = ct.id_company
JOIN technologies t ON t.id_tech = ct.id_tech
LIMIT 50;


---

## TC-08 – Duplicate prevention

**Objective**

Verify that the system does not create duplicate companies.

**Steps**

Run a scraping request with query = python
Run the same request again

**Expected Result**

    Second execution should produce fewer new companies
    total_updated may increase
    No duplicated companies should appear in the database


---

## TC-09 – Dashboard validation

**Objective**

Verify that the dashboard displays real data.

**Visual Validation**

Dashboard must show:

    Companies with vacancies
    Emails sent
    AI scored companies
    High score companies

Lists must show:

    Top companies by score
    Trending technologies

**Endpoints used**

    GET /api/dashboard/stats
    GET /api/companies/top
    GET /api/companies/technologies/trending


---

TC-10 – Companies table validation

**Objective**

Verify that the Companies page loads real database data.

**Visual Validation**

The table should show:

    Company name
    Technologies
    Category
    Country
    AI score

Filters should work:

    Search by name
    Filter by technology
    Filter by score

**Endpoint used**

GET /api/companies/enriched

Example:

/api/companies/enriched?search=react&tech=python&score=3


---

---

## TC-11 – Scraping execution from UI

**Objective**

Verify that scraping can be executed from the frontend interface.

**Steps**

1. Open the application in the browser
2. Navigate to the **Companies** page
3. Click **Run scraping**
4. Select a source (Remotive or RemoteOK)
5. Enter a keyword (example: `python`)
6. Click **Start search**

---

**Expected UI Result**

The user should see a progress indicator and then a success message.

Example message:

Scraping completed
Found: X · New: X · Updated: X · Failed: X


---

**Expected Database Result**

New or updated records appear in:

- `company`
- `technologies`
- `company_technologies`
- `scraping_logs`

SQL validation example:

```sql
SELECT *
FROM scraping_logs
ORDER BY executed_at DESC
LIMIT 1;
