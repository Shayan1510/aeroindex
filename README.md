# AeroIndex — SIH26056 Full-Stack Project

This ZIP contains the complete project:

- `frontend/` — React/Vite AeroIndex dashboard
- `backend/` — FastAPI + PostgreSQL professional backend

## Backend

1. `cd backend`
2. Copy `.env.example` to `.env`
3. Start PostgreSQL with `docker compose up -d db`
4. Create/activate a Python virtual environment
5. `pip install -r requirements.txt`
6. `uvicorn app.main:app --reload`

API docs:
`http://localhost:8000/docs`

## Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

The frontend can be connected to the backend API at:
`http://localhost:8000/api/v1`

## SIH26056

The backend is structured for airfare observations, route baskets, index computation,
data quality, analytics, audit history, and external fare-provider ingestion.
