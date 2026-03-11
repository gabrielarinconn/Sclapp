<img src="src/img/Banner_Sclapp.png">

# Sclapp

> **"Smart data for real opportunities"**

---

## 📝 Project Description

**Sclapp** is an internal web platform designed to manage companies and outreach processes aimed at improving employment opportunities for junior developers.

The platform centralizes the process of identifying companies, managing potential leads, and executing outreach strategies through email campaigns. Its goal is to help teams organize hiring opportunities and make better decisions using data and automation.

The system is built as a **Single Page Application (SPA)** using **HTML, CSS, and Vanilla JavaScript** on the frontend, a **Python backend exposing a REST API**, and a **relational database (PostgreSQL or SQLite)** as the main source of truth.

A key component of the platform is the use of **manual and semi-automated web scraping** to collect structured information about companies that publish technology job vacancies. This data is stored, normalized, and enriched within the database, allowing users to create an internal repository of companies without relying entirely on external job platforms.

The system also incorporates **artificial intelligence mechanisms** to support analysis and decision-making. These AI-driven processes help:

- Filter and rank companies based on their likelihood of hiring tech talent.
- Generate scoring models based on engagement data and company activity.
- Produce automated analytical reports.
- Identify the most promising companies for outreach.

From an architectural perspective, the frontend dynamically renders views, tables, charts, and kanban boards while communicating with backend endpoints through `fetch`. The backend handles scraping execution, email delivery, tracking of user interactions, and data analysis.

By automating these processes, Sclapp reduces the time and effort required to identify hiring companies and execute outreach campaigns, helping improve employment opportunities for junior developers.

---

## 🚀 Deployment

You can access the live version of the project here:

**[Add deployment link here — GitHub Pages / Netlify / Render]**



---
## 🛠️ Technologies Used

**Frontend**

- HTML5
- CSS3
- JavaScript (Vanilla)

**Styles**

- Tailwind CSS / Bootstrap (allowed style libraries)

**Backend**

- Python
- Flask REST API

**Database**

- PostgreSQL / SQLite
- SQL

**Methodology**

- SCRUM
- Azure DevOps for project management

---

## 👥 The Team

| Profile Picture | Full Name | Role | GitHub |
| --- | --- | --- | --- | 
| <img src="https://www.google.com/search?q=https://github.com/user1.png" width="100"> | Natalia Vargas | QA / Developer | [@nataliavos](https://github.com/Nataliavos) |
| <img src="/img/gabriela_foto_perfil.png" width="80"> | Gabriela Rincón | Scrum Master  /  UI/UX Designer /  Developer | [@gabrielarinconn](https://github.com/gabrielarinconn) |
| <img src="https://www.google.com/search?q=https://github.com/user3.png" width="100"> | Camila Vidales| Developer | [@marespi21](https://github.com/marespi21) |
| <img src="[https://github.com/user4.png](https://www.google.com/search?q=https://github.com/user4.png)" width="100"> | Tobias | Developer | [@tobiax18](https://github.com/tobiax18) |
| <img src="[https://github.com/user5.png](https://www.google.com/search?q=https://github.com/user5.png)" width="100"> | Julio Ramires| Product Owner / Developer | [@julioramcoder](https://github.com/julioramcoder) |

---

## ⚙️ Execution Instructions

To run this project locally, follow these steps:

1. **Clone the repository:**
```bash
git clone https://github.com/your-repo/Sclapp.git

```


2. **Open the project:**
Navigate to the project folder and open `index.html` in your preferred browser.
3. **Database Setup:**
* Ensure you have a local SQL environment ready.
* Run the script located in `/database/script.sql` to generate the schema and seed data.



---

## 📁 Project Structure

Sclapp
│
├── backend
│   ├── config
│   ├── db
│   ├── models
│   ├── modules
│   │   ├── auth
│   │   ├── companies
│   │   ├── scraping
│   │   ├── email
│   │   └── dashboard
│   └── services
│
├── frontend
│   ├── assets
│   ├── css
│   ├── js
│   └── index.html
│
├── database
│   └── schema.sql
│
├── docs
│   └── technical documentation
│
└── README.md

---

## 📜 Credits

This project was developed as the Final Integrative Project for **Riwi - Basic Route (2026)**. All rights reserved by the development team.

