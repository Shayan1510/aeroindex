from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .db import Base, engine
from .api import flights, index, analytics, admin
from .seed import seed_database
from .scheduler import start_scheduler, stop_scheduler

settings=get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_database()
    scheduler = start_scheduler() if settings.ingestion_enabled else None
    yield
    if scheduler:
        stop_scheduler(scheduler)

app=FastAPI(
    title="AeroIndex API",
    version="1.0.0",
    description="Real-time Indian airfare intelligence backend for SIH26056."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flights.router)
app.include_router(index.router)
app.include_router(analytics.router)
app.include_router(admin.router)

@app.get("/health")
def health():
    return {"status":"ok","service":"aeroindex-api","environment":settings.app_env}

@app.get("/api/v1")
def api_root():
    return {"name":"AeroIndex API","version":"v1","docs":"/docs"}
