from datetime import date, datetime, timezone, timedelta
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..models import FareObservation, RouteBasket, DataQualitySource
from .normalizer import amadeus_to_flight
from .providers.amadeus import AmadeusProvider

async def ingest_route(db: Session, provider: AmadeusProvider, route: str, departure_date: date, max_results: int = 20):
    origin, destination = route.split("-")
    started = datetime.now(timezone.utc)
    source_name = "Amadeus"
    try:
        payload = await provider.search(origin, destination, str(departure_date), 1, max_results)
        offers = payload.get("data", [])
        count = 0
        for offer in offers:
            f = amadeus_to_flight(offer, origin, destination)
            fare = f["fare"]
            db.add(FareObservation(
                observed_at=started,
                departure_date=departure_date,
                route=route,
                airline_code=f["airlineCode"],
                flight_number=f["flightNumber"],
                source=source_name,
                source_offer_id=f["id"],
                currency="INR",
                base_fare=fare["base"],
                taxes=fare["taxes"],
                fees=fare["fees"],
                total_fare=fare["total"],
                cabin=f["cabin"],
                raw_payload=f["_raw"],
                valid=True,
            ))
            count += 1
        db.commit()
        _update_source(db, source_name, "healthy", count, 0, started)
        return count
    except Exception:
        db.rollback()
        _update_source(db, source_name, "offline", 0, 100, started)
        return 0

def _update_source(db, name, status, count, error_rate, timestamp):
    source = db.execute(select(DataQualitySource).where(DataQualitySource.name == name)).scalar_one_or_none()
    if not source:
        source = DataQualitySource(name=name)
        db.add(source)
    source.status = status
    source.last_success = timestamp if status == "healthy" else source.last_success
    source.observation_count = (source.observation_count or 0) + count
    source.error_rate_pct = error_rate
    source.freshness_minutes = 0
    db.commit()
