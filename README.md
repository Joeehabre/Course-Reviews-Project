# AUB Course Review Platform — CMPS 271

<p align="left">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
  <img src="https://img.shields.io/badge/Course-CMPS%20271%20AUB-blue?style=for-the-badge"/>
</p>

![CI](https://github.com/Joeehabre/Course-Reviews-Project/actions/workflows/ci.yml/badge.svg)

A full-stack web platform where **AUB students** can anonymously review courses and professors, helping peers make better course registration decisions.

Built as a team project for **CMPS 271** at the **American University of Beirut (AUB)**.

---

## The Problem

Students rely on scattered informal sources — group chats, social media — to learn about courses and professors. There was no single, reliable, always-accessible place for honest structured feedback.

## The Solution

A centralized review platform that:
- Lets students anonymously review courses and professors
- Organizes reviews by course, professor, and semester
- Restricts access to verified AUB accounts only
- Moderates content for quality and appropriateness

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, CSS Modules |
| Backend | FastAPI (Python 3), SQLAlchemy ORM, Alembic migrations |
| Database | PostgreSQL |
| Deployment | Vercel (frontend) |
| API Testing | Postman |

---

## Project Structure

```
271-Project/
├── frontend/
│   ├── src/
│   │   ├── pages/         # Route-level page components
│   │   ├── components/    # Reusable UI components
│   │   ├── styles/        # CSS modules
│   │   └── api.js         # Axios API client
│   ├── vite.config.js
│   └── package.json
└── backend/
    ├── app/
    │   ├── api/           # FastAPI route handlers
    │   ├── models/        # SQLAlchemy table models
    │   ├── crud/          # Database query functions
    │   ├── schemas.py     # Pydantic request/response schemas
    │   └── main.py        # App entry point
    ├── alembic/           # Database migration scripts
    └── requirements.txt
```

---

## Getting Started

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # set DATABASE_URL and SECRET_KEY
alembic upgrade head          # run migrations
uvicorn app.main:app --reload
```

Interactive API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # set VITE_API_URL
npm run dev
```

---

## Authors

Developed as a team project for **CMPS 271, AUB**.
