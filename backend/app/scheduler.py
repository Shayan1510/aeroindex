from datetime import date, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select
from .config import get_settings
from .db import SessionLocal
from .models import RouteBasket
from .services.providers.amadeus import AmadeusProvider
from .services.ingestion import ingest_route
from .services.index_engine import rebuild_index_history

def start_scheduler():
    settings=get_settings()
    scheduler=AsyncIOScheduler()
    async def job():
        db=SessionLocal()
        try:
            provider=AmadeusProvider(settings.amadeus_client_id,settings.amadeus_client_secret,settings.amadeus_base_url)
            if not provider.enabled:
                return
            routes=db.execute(select(RouteBasket).where(RouteBasket.status=="active")).scalars().all()
            target=date.today()+timedelta(days=7)
            for r in routes:
                await ingest_route(db,provider,r.route,target,max_results=20)
            rebuild_index_history(db,date.today()-timedelta(days=90),date.today())
        finally:
            db.close()
    scheduler.add_job(job,"interval",minutes=settings.ingestion_interval_minutes,id="fare-ingestion",replace_existing=True)
    scheduler.start()
    return scheduler

def stop_scheduler(scheduler):
    scheduler.shutdown(wait=False)
