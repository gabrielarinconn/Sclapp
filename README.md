<img src="src/img/Banner_Sclapp.png">

# Sclapp

> **"Smart data for real opportunities"**

## 📝 Project Description

**Sclapp** consists of an **internal web platform for managing companies and outreach processes aimed at tech job generation**, with a particular focus on improving employment opportunities for junior developers.

The platform is implemented as a **Single Page Application (SPA)** using **HTML, CSS, and Vanilla JavaScript** on the frontend, a **Python-based backend exposing a REST API**, and a **relational database (SQLite or PostgreSQL)** as the system’s source of truth. Its main objective is to centralize, automate, and optimize the process of identifying potential hiring companies, managing outreach efforts, and making data-driven decisions based on measurable engagement metrics.

A core component of the system is the use of **manual and semi-automated web scraping** to collect structured information about companies that publish tech job vacancies. Scraped data is stored, normalized, and enriched within the database, allowing users to build an internal repository of companies and vacancies without relying solely on external job platforms. This process significantly reduces the time spent searching across multiple sources and platforms.

In addition, the platform integrates **artificial intelligence mechanisms** to support analysis and decision making. AI-driven processes are used to: 

* Filter and rank companies based on their likelihood of hiring tech talent, especially junior developers.
* Generate a **scoring model** that evaluates companies using historical outreach data, engagement rates, and vacancy characteristics.
* Produce **automated analytical reports** that summarize trends, performance indicators, and potential opportunities.
* Assist in identifying the most promising companies for outreach, enabling more efficient allocation of time and resources.

From an architectural standpoint, the frontend dynamically switches views and renders tables, charts, and kanban boards while consuming backend endpoints through `fetch`. The backend handles scraping execution, email delivery, tracking of user interactions (email opens, clicks, and responses), metric calculation, and AI-assisted report generation. All data and events are persistently stored in the relational database, ensuring consistency and traceability across the system.

By addressing inefficiencies in the tech hiring ecosystem, the platform responds to the reality that junior developers typically invest between **65 and 120 hours** throughout the job search lifecycle, including CV preparation, active searching across multiple platforms, interviews, and technical assessments. By leveraging scraping, automation, and artificial intelligence, the system aims to reduce friction in company discovery and outreach processes, enabling more informed decisions, faster engagement, and improved outcomes for both recruiters and tech talent.

In summary, this project combines SPA frontend development, backend API design, relational data modeling, web scraping, artificial intelligence, and data visualization into a unified internal platform that enhances outreach efficiency and supports strategic, data-driven hiring decisions.



## 🚀 Deployment

You can access the live version of the project here:


**[Link to your deployed site, e.g., GitHub Pages/Netlify]** 

---

## 🛠️ Technologies Used

* 
**Frontend:** HTML5, CSS3, JavaScript (Vanilla).


* 
**Styles:** [Bootstrap / Tailwind CSS] (Only allowed style libraries).


* 
**Database:** SQL for data persistence.


* 
**Methodology:** SCRUM managed through Azure DevOps.



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

* `/assets`: Images, icons, and static resources.
* `/css`: Stylesheets (Tailwind/Bootstrap configurations).
* `/js`: Vanilla JavaScript logic (Matching algorithm, DOM manipulation).
* 
`/database`: SQL scripts and relational model diagrams.


* 
`/docs`: Technical documentation and PDF reports.



---

## 📜 Credits

This project was developed as the Final Integrative Project for **Riwi - Basic Route (2026)**. All rights reserved by the development team.

