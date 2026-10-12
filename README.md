# AUB Course Review Platform: CMPS 271

<p align="left">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
  <img src="https://img.shields.io/badge/Course-CMPS%20271%20AUB-blue?style=for-the-badge"/>
</p>

![CI](https://github.com/Joeehabre/Course-Reviews-Project/actions/workflows/ci.yml/badge.svg)

A full-stack web platform where **AUB students** can anonymously review courses and professors, helping peers make better course registration decisions.

Built as a team project for **CMPS 271** at the **American University of Beirut (AUB)** by a group of five.

---

## Base Team Project vs. This Extended Build

This repository is an **upgraded, independently deployable build** of the original five-person CMPS 271 course project. While the baseline group repository implemented core review submissions, this build introduces architectural stability fixes, query optimizations, enhanced analytics, and an improved user interface:

| Area | Base Team Project | Joe's Extended Build |
| :--- | :--- | :--- |
| **Course Review Queries** | Client-side N-request waterfall: looped through every section with separate API calls, resulting in fragmented client-side sorting. | Direct server-side batch endpoint (`/courses/{id}/reviews`) with global sorting (`top_rated`, `newest`, `most_liked`) and professor filtering. |
| **Rating Analytics** | Only basic average rating per course. | Full rating distribution breakdown (1–5 star progress bars), total review counters, and professor rating summaries. |
| **Landing Page Discovery** | Basic text search with no department categorization. | Interactive department filter chips (CMPS, MATH, EECE, etc.), clearable search bar, and professor rating badges. |
| **Review Submission UX** | Standard numeric dropdown selector. | Interactive 1–5 star rating buttons with dynamic descriptive labels. |
| **Database Performance** | Basic table scans without compound indexes. | Performance indexes (`reviews (section_id, status)`, `reviews (status, created_at)`, `sections (course_id, professor_id)`) via linear Alembic migration. |
| **Database Migrations** | Branching multi-head conflicts (`add_cmps_courses` vs `fix_violation_status_constraint`). | Clean, single-head linear migration sequence (12 revisions). |
| **Async ORM Stability** | Unhandled `MissingGreenlet` exceptions on lazy-loaded relationships. | Explicit eager-loading (`selectinload`) on sections, professors, and decoupled user moderation dependencies. |
| **Admin API Security** | Legacy synchronous database queries inside an async FastAPI engine; unmounted router. | Fully asynchronous `AsyncSession` route handlers, mounted under `/api/v1/admin` with verified admin dependencies. |
| **Student Violation History** | Profile page called an admin-only endpoint, returning a 403 Forbidden error. | Dedicated `/users/me/violations` endpoint allowing students to inspect their warning history. |
| **Deployment Independence** | Hardcoded dev CORS blocking external Vercel deployments. | Production CORS regex (`*.vercel.app`), `Procfile`, and `render.yaml` for 1-click independent cloud deployment. |

### Original Team Contributions
In the collaborative phase of this project, my initial contributions included:
- **Admin API**: Implemented the administrative endpoint suite (`backend/app/api/admin.py`).
- **Admin Dashboard**: Moderation views and role-based navbar access.
- **Review Interactions**: Like/dislike client logic and interaction state management.
- **Application Shell**: Base routing (`App.jsx`), profile layout, and initial repository CI workflows.
- **Teammate Contributions**: My teammates developed the core authentication flows, initial course/section seed datasets, and baseline review data structures visible in the earlier commit history.

---

## The Problem

Students rely on scattered informal sources, group chats, social media, to learn about courses and professors. There was no single, reliable, always-accessible place for honest structured feedback.

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
cp .env.example .env          # set VITE_BACKEND_URL
npm run dev
```

---

## Deployment

### Frontend (Vercel)
1. Import your forked repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set environment variable:
   - `VITE_BACKEND_URL`: URL of your deployed backend API.
4. Click **Deploy**.

### Backend (Render / Railway)
1. Create a Web Service pointing to your repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
4. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Configure environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (Neon, Supabase, or Render Postgres).
   - `FRONTEND_URL`: Your deployed Vercel domain.
   - `ENV`: `prod`
   - `JWT_SECRET`: Random secret string.

---

## Newman Testing

The backend Newman suite reads its target host from environment variables instead of hardcoding localhost.

Use [backend/scripts/run_newman_tests.ps1](backend/scripts/run_newman_tests.ps1) to run the collection. It reads `BACKEND_URL` from [backend/.env](backend/.env) when present, otherwise it falls back to `http://localhost:8000`.

For deployment, set `BACKEND_URL` to the public API URL. For local testing, leave it on the localhost default.

---

## Authors

Developed as a team project for **CMPS 271, AUB**.
