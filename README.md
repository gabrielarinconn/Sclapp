# 🚀 SCLAPP – Smart Company Lead Analysis Platform

## 📌 Overview

SCLAPP is a system designed to help training organizations like **Riwi** identify companies that may need technology talent.

The system analyzes **remote job postings** from public job platforms and uses **AI classification** to detect relevant roles, technologies, and companies that could become hiring partners.

The goal of the MVP is to demonstrate a complete pipeline:

1. Collect remote job postings  
2. Filter relevant technology jobs  
3. Classify jobs using AI  
4. Extract technologies  
5. Score companies based on relevance  
6. Store results in PostgreSQL  
7. Visualize insights in a dashboard

---

# ❗ Problem the System Solves

Training organizations often struggle to identify companies that are actively hiring technology talent.

Manual research is slow and inefficient.

SCLAPP automates this process by:

- analyzing job postings
- identifying companies hiring technical roles
- extracting technologies used in those roles
- highlighting companies with higher hiring relevance

This helps organizations focus their outreach efforts on companies more likely to need trained talent.

---

# 🎯 MVP Scope

The MVP focuses on validating the core concept:

- Scraping remote job postings
- Filtering relevant technical jobs
- AI-based classification of job relevance
- Technology extraction
- Company scoring
- Dashboard visualization

The system demonstrates a **complete end-to-end data pipeline**, from job collection to insights visualization.

---

# 🏗 System Architecture

The application uses a simple three-layer architecture.

```
Frontend (HTML / CSS / JavaScript)
        ↓
Backend API (FastAPI)
        ↓
Database (PostgreSQL)
```

Additional components:

```
Job Sources → Scraping → Filtering → AI Classification → Database → Dashboard
```

---

# 🛠 Technologies Used

## Backend

- Python
- FastAPI
- PostgreSQL
- OpenAI API
- BeautifulSoup
- Requests

## Frontend

- HTML
- CSS
- Vanilla JavaScript

## Data Processing

- Keyword filtering
- Rule-based relevance detection
- AI classification
- Technology extraction

---

# 🔄 System Workflow

The system processes data in the following pipeline:

```
Job Sources
   ↓
Web Scraping
   ↓
Keyword Filtering
   ↓
Riwi Relevance Filter
   ↓
AI Job Classification
   ↓
Technology Extraction
   ↓
Database Storage
   ↓
Dashboard Visualization
```

---

# 🌐 Scraping Sources

The MVP currently supports two remote job platforms:

- **Remotive**
- **RemoteOK**

Each source is implemented as a scraper module that collects job postings and normalizes the data before processing.

Future versions may include additional sources.

---

# 🤖 AI Classification Logic

The AI classifier analyzes job descriptions and determines:

- role category (Backend, Frontend, Data, DevOps, etc.)
- job relevance
- company score

Score scale:

| Score | Meaning |
|------|------|
| 1 | Low relevance |
| 2 | Medium relevance |
| 3 | High relevance |

---

# ⚙ Technology Extraction

The system identifies technologies mentioned in job descriptions.

Examples:

- Python
- JavaScript
- React
- Docker
- PostgreSQL
- AWS
- Pandas

Technologies are stored in a separate table and linked to companies through a relational table.

---

# 🗄 Database Structure

Main database tables:

### company

Stores companies detected in job postings.

Fields include:

- name
- category
- score
- country

---

### technologies

Stores extracted technologies.

Examples:

- Python
- React
- Docker
- PostgreSQL

---

### company_technologies

Relational table connecting companies with technologies.

---

### scraping_logs

Stores execution logs for each scraping process.

Includes:

- source
- execution time
- number of jobs processed
- new vs updated companies

---

# 🧠 Backend Structure

```
backend/
│
├ api/
│   └ v1/
│       ├ auth.py
│       ├ companies.py
│       ├ dashboard.py
│       ├ scraping.py
│       └ profile.py
│
├ services/
│   ├ scraping/
│   ├ ai/
│   └ email/
│
├ modules/
│   ├ auth/
│   └ scraping/
│
├ db/
│   ├ schema.sql
│   └ connection.py
│
└ main.py
```

---

# 🎨 Frontend Structure

```
frontend/
│
├ assets/
│   ├ css/
│   ├ js/
│   └ img/
│
└ index.html
```

Main views:

- Dashboard
- Companies
- Login
- Profile

---

# 🔌 API Endpoints

## Scraping

```
POST /api/scraping/start
```

Example request:

```json
{
  "parameters": {
    "source": "remotive",
    "query": "python",
    "max_items": 10
  }
}
```

---

## Dashboard

```
GET /api/dashboard/stats
```

```
GET /api/companies/top
```

```
GET /api/companies/technologies/trending
```

---

## Companies

```
GET /api/companies/enriched
```

Example:

```
/api/companies/enriched?search=react&tech=python&score=3
```

---

# 🖥 Frontend Features

## Dashboard

Displays key insights:

- companies with vacancies
- AI scored companies
- high score companies
- top companies by relevance
- trending technologies

---

## Companies Page

Displays companies detected from job postings.

Features:

- search by company name
- filter by technology
- filter by score
- run scraping from the UI

---

# ⚡ Running the Project

## Requirements

- Python 3.10+
- PostgreSQL
- OpenAI API key

---

## 1. Clone the repository

```
git clone <repository_url>
cd Sclapp
```

---

## 2. Create the database

Run the schema:

```
backend/db/schema.sql
```

---

## 3. Configure environment variables

Create `.env` from `.env.example`.

Example:

```
OPENAI_API_KEY=your_openai_key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sclapp_db
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## 4. Create virtual environment

```
python -m venv venv
```

Activate:

Linux / macOS

```
source venv/bin/activate
```

Windows

```
venv\Scripts\activate
```

---

## 5. Install dependencies

```
pip install -r backend/requirements.txt
```

---

## 6. Run the server

```
uvicorn backend.main:app --reload
```

---

## 7. Open the application

```
http://localhost:8000
```

---

# 🧪 QA Testing

A QA testing plan validates:

- scraping functionality
- AI classification
- technology extraction
- database persistence
- API responses
- frontend visualization
- authentication
- system stability

Example tested scenarios:

- scraping from Remotive
- filtering Python, React, Data, DevOps roles
- validating AI scoring
- preventing duplicate companies
- dashboard statistics validation
- API contract testing
- relational database integrity

The QA plan ensures the MVP works correctly across all core system components.

---

# ⚠ Known Limitations

This project is an MVP and has some limitations:

- limited scraping sources
- AI insights limited to classification
- automated outreach not implemented
- dashboard analytics simplified
- limited historical data analysis

---

# 🔮 Future Improvements

Possible future improvements:

- more job sources
- automated company outreach
- improved AI insights
- hiring trend analysis
- expanded dashboard analytics
- CRM integrations

---

# 👥 The Team

| Profile Picture | Full Name | Role | GitHub |
| --- | --- | --- | --- |
| <img src="frontend/assets/img/julio_profile.png" width="100"> | Julio Ramirez | Product Owner / Developer | [@julioramcoder](https://github.com/julioramcoder) |
| <img src="frontend/assets/img/natalia_profile.png" width="100"> | Natalia Vargas | Tech Lead / Developer | [@nataliavos](https://github.com/Nataliavos) |
| <img src="frontend/assets/img/gabriela_profile.png" width="80"> | Gabriela Rincón | Scrum Master / Frontend Developer | [@gabrielarinconn](https://github.com/gabrielarinconn) |
| <img src="frontend/assets/img/camila_profile.png" width="100"> | Camila Vidales | UI/UX Designer / Frontend Developer | [@marespi21](https://github.com/marespi21) |
| <img src="https://github.com/tobiax18.png" width="100"> | Tobias | Developer | [@tobiax18](https://github.com/tobiax18) |

---

## 📜 Credits

This project was developed as the **Final Integrative Project for Riwi (2026)**.

It demonstrates a practical technical solution combining:

- web scraping
- artificial intelligence
- data processing
- database architecture
- dashboard visualization

to support data-driven company discovery.