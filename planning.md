You are an expert senior software engineer.

Your task is to generate the base architecture and initial implementation of a full-stack web application called **SCLAPP**.

The project must follow a **modular backend architecture** with clear separation between modules, services, models, database, and frontend.

The goal is to build a **Minimum Viable Product (MVP)** that demonstrates a full workflow:

User Registration → Login → Company Scraping → AI Classification → Company Management → Email Campaigns.

The code must be clean, readable, and beginner-friendly because the project will be developed collaboratively by a team of junior developers.

------------------------------------------------

PROJECT OVERVIEW

SCLAPP is a platform that allows users to:

1. Discover companies using automated web scraping
2. Classify companies using AI
3. Manage companies as leads
4. Send outreach emails to selected companies

------------------------------------------------

TECH STACK

Backend:
Python
Flask (or FastAPI if better suited)

Database:
PostgreSQL

AI Integration:
OpenAI API

Email Service:
Brevo API

Frontend:
Vanilla HTML
CSS
JavaScript

Project will be developed locally and run with environment variables.

------------------------------------------------

BACKEND ARCHITECTURE

Use a modular architecture with the following structure:

backend/

app.py

config/
settings.py

db/
connection.py
schema.sql
migrations.sql

models/
user.py
company.py
email_log.py

utils/
auth_utils.py
validators.py

modules/

auth/
auth_controller.py
auth_routes.py
auth_service.py

companies/
company_controller.py
company_routes.py
company_service.py

dashboard/
dashboard_controller.py
dashboard_routes.py
dashboard_service.py

email/
email_controller.py
email_routes.py
email_service.py

scraping/
scraping_controller.py
scraping_routes.py
scraping_service.py

services/

ai/
company_classifier.py

email/
brevo_client.py

requirements.txt

------------------------------------------------

FRONTEND STRUCTURE

frontend/

index.html

pages/
login.html
register.html
dashboard.html
empresas.html
perfil.html

assets/

css/
styles.css

js/
login.js
register.js
dashboard.js
empresas.js
correos.js

img/

------------------------------------------------

DATABASE DESIGN

Create PostgreSQL tables.

users

id
name
email
password_hash
created_at

companies

id
name
website
description
email
industry
category
created_at

email_logs

id
company_id
subject
message
sent_at
status

------------------------------------------------

API ENDPOINTS

Authentication

POST /auth/register
POST /auth/login
GET /auth/profile

Scraping

POST /scraping/start

Companies

GET /companies
GET /companies/:id
POST /companies/classify

Email

POST /email/send

Dashboard

GET /dashboard/stats

------------------------------------------------

SCRAPING MODULE

The scraping module must:

1. Scrape company data from example sources
2. Extract:
   - company name
   - website
   - description
   - email if available

3. Save companies to database
4. Avoid duplicates

------------------------------------------------

AI CLASSIFICATION

Use OpenAI API.

The AI must classify companies based on description.

Example prompt to send to the AI:

"Classify the company industry and category from the following description.

Return JSON:

{
industry: string,
category: string
}

Company description:
..."

Only classify companies where industry IS NULL.

------------------------------------------------

EMAIL MODULE

Use Brevo API to send emails.

The email module must:

1. Allow sending email campaigns to selected companies
2. Record email logs in database

------------------------------------------------

DASHBOARD

Dashboard must return statistics:

total_companies
classified_companies
emails_sent

------------------------------------------------

CODE QUALITY

Follow these guidelines:

Use clear modular architecture
Keep controllers thin
Place logic in services
Use environment variables
Add basic error handling
Add comments explaining code

------------------------------------------------

OUTPUT

Generate:

Full folder structure
Initial backend code
Database schema
Example scraping service
Example AI classification service
Example email sending service
Basic frontend pages

Do not generate overly complex code.
Focus on clarity and maintainability for a team of beginner developers.