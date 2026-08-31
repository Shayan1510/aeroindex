from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Airport, FareObservation
from ..config import get_settings
from ..schemas import FlightSearchParams
from ..services.providers.amadeus import AmadeusProvider
from ..services.normalizer import amadeus_to_flight
from ..services.fallback import demo_flights, demo_history
from ..services.analytics import price_rating

router = APIRouter(prefix="/api/v1", tags=["flights"])

@router.get("/airports")
def search_airports(q: str = "", db: Session = Depends(get_db)):
    q = q.strip().lower()
    stmt = select(Airport).order_by(Airport.city)
    if q:
        stmt = stmt.where(
            (Airport.code.ilike(f"%{q}%")) |
            (Airport.city.ilike(f"%{q}%")) |
            (Airport.name.ilike(f"%{q}%"))
        )
    rows = db.execute(stmt.limit(20)).scalars().all()
    return [{"code":a.code,"city":a.city,"name":a.name} for a in rows]

@router.get("/flights")
async def search_flights(
    from_: str = Query(alias="from", min_length=3, max_length=3),
    to: str = Query(min_length=3, max_length=3),
    date: date = Query(...),
    adults: int = Query(1, ge=1, le=9),
    max_results: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    origin, destination = from_.upper(), to.upper()
    settings = get_settings()
    provider = AmadeusProvider(settings.amadeus_client_id, settings.amadeus_client_secret, settings.amadeus_base_url)
    flights = []
    provider_used = False
    if provider.enabled:
        try:
            payload = await provider.search(origin, destination, str(date), adults, max_results)
            flights = [amadeus_to_flight(x, origin, destination) for x in payload.get("data", [])]
            provider_used = bool(flights)
            if flights:
                for f in flights:
                    fare = f["fare"]
                    db.add(FareObservation(
                        observed_at=datetime.now(timezone.utc),
                        departure_date=date,
                        route=f"{origin}-{destination}",
                        airline_code=f["airlineCode"],
                        flight_number=f["flightNumber"],
                        source="Amadeus",
                        source_offer_id=f["id"],
                        currency="INR",
                        base_fare=fare["base"],
                        taxes=fare["taxes"],
                        fees=fare["fees"],
                        total_fare=fare["total"],
                        cabin=f["cabin"],
                        raw_payload=f.get("_raw"),
                        valid=True,
                    ))
                db.commit()
        except Exception:
            flights = []
    if not flights:
        flights = demo_flights(origin, destination, str(date), max_results)
    history = db.execute(
        select(FareObservation.total_fare)
        .where(FareObservation.route == f"{origin}-{destination}")
        .order_by(FareObservation.observed_at.desc()).limit(200)
    ).scalars().all()
    history = [float(x) for x in history]
    for f in flights:
        f["priceRating"] = price_rating(f["fare"]["total"], history)
        f.pop("_raw", None)
    return {"params":{"from":origin,"to":destination,"date":str(date)},"flights":flights,"count":len(flights),"source":"Amadeus" if provider_used else "Demo fallback"}

@router.get("/flights/{flight_id}")
def flight_detail(flight_id: str, db: Session = Depends(get_db)):
    row = db.execute(select(FareObservation).where(FareObservation.source_offer_id == flight_id).order_by(FareObservation.observed_at.desc())).scalars().first()
    if row:
        return {
            "id": flight_id, "airlineCode": row.airline_code, "flightNumber": row.flight_number,
            "from": row.route[:3], "to": row.route[4:], "departTime": datetime.combine(row.departure_date, datetime.min.time(), tzinfo=timezone.utc),
            "arriveTime": datetime.combine(row.departure_date, datetime.min.time(), tzinfo=timezone.utc),
            "durationMinutes": 0, "stops": 0, "cabin": row.cabin, "baggage":"Check airline fare rules",
            "fare":{"base":float(row.base_fare),"taxes":float(row.taxes),"fees":float(row.fees),"total":float(row.total_fare)},
            "priceRating":"average","source":row.source,"lastUpdated":row.observed_at
        }
    # Stable demo detail for IDs produced by the fallback.
    parts = flight_id.split("-")
    if len(parts) >= 4:
        origin, dest, day = parts[1][:3], parts[1][3:], "-".join(parts[3:])
        flights = demo_flights(origin, dest, day, 8)
        return next((x for x in flights if x["id"] == flight_id), flights[0])
    raise HTTPException(404, "Flight not found")

@router.get("/fares")
def fare_history(route: str = Query(..., pattern=r"^[A-Z]{3}-[A-Z]{3}$"), db: Session = Depends(get_db)):
    rows = db.execute(select(FareObservation).where(FareObservation.route == route).order_by(FareObservation.observed_at.desc()).limit(500)).scalars().all()
    values = [float(x.total_fare) for x in rows]
    if not values:
        history = demo_history(route)
        values = [x["price"] for x in history]
    else:
        # Aggregate DB observations by observation date for a clean chart.
        grouped = {}
        for r in rows:
            grouped.setdefault(r.observed_at.date().isoformat(), []).append(float(r.total_fare))
        history = [{"date":d,"price":round(sum(v)/len(v))} for d,v in sorted(grouped.items())]
    current = values[0]
    avg = round(sum(values)/len(values))
    low, high = round(min(values)), round(max(values))
    sorted_values = sorted(values)
    percentile = round(sorted_values.index(current)/max(1,len(sorted_values)-1)*100)
    return {"route":route,"count":len(values),"history":history,"stats":{"current":round(current),"average":avg,"lowest":low,"highest":high,"percentile":percentile}}

@router.get("/price-history")
def price_history(route: str = Query(..., pattern=r"^[A-Z]{3}-[A-Z]{3}$"), db: Session = Depends(get_db)):
    return fare_history(route, db)
