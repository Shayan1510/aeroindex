from datetime import date, datetime, timedelta, timezone
from sqlalchemy import select
from .db import SessionLocal
from .models import Airport, RouteBasket, FareObservation, DataQualitySource, Anomaly, AuditLog, CpiImpact
from .services.fallback import demo_flights
from .services.index_engine import rebuild_index_history

AIRPORTS=[
("DEL","Delhi","Indira Gandhi International Airport"),
("BOM","Mumbai","Chhatrapati Shivaji Maharaj International Airport"),
("BLR","Bengaluru","Kempegowda International Airport"),
("GOI","Goa","Manohar International Airport"),
("JAI","Jaipur","Jaipur International Airport"),
("HYD","Hyderabad","Rajiv Gandhi International Airport"),
("CCU","Kolkata","Netaji Subhas Chandra Bose International Airport"),
("MAA","Chennai","Chennai International Airport"),
("COK","Kochi","Cochin International Airport"),
("PNQ","Pune","Pune Airport"),
("GAU","Guwahati","Lokpriya Gopinath Bordoloi International Airport"),
("IXC","Chandigarh","Chandigarh Airport"),
]
ROUTES=[
("DEL-BOM",18.2,"active","2026-04-01","v3.2"),("DEL-BLR",15.4,"active","2026-04-01","v3.2"),
("BOM-BLR",12.7,"active","2026-04-01","v3.2"),("DEL-CCU",8.9,"active","2026-04-01","v3.2"),
("BOM-MAA",7.6,"active","2026-04-01","v3.2"),("DEL-HYD",6.8,"active","2026-04-01","v3.2"),
("DEL-GAU",4.1,"under_review","2026-07-01","v3.2"),("BLR-COK",3.9,"active","2026-04-01","v3.2"),
("DEL-IXC",2.2,"active","2026-04-01","v3.2"),("PNQ-DEL",2.0,"retired","2025-11-01","v3.1"),
]

def seed_database():
    db=SessionLocal()
    try:
        if not db.execute(select(Airport)).first():
            db.add_all([Airport(code=c,city=city,name=name) for c,city,name in AIRPORTS])
        if not db.execute(select(RouteBasket)).first():
            db.add_all([RouteBasket(route=r,weight_pct=w,status=s,effective_date=date.fromisoformat(d),version=v) for r,w,s,d,v in ROUTES])
        db.commit()

        if not db.execute(select(FareObservation)).first():
            today=date.today()
            active=[r for r,_,s,_,_ in ROUTES if s=="active"]
            # Seed 180 days of deterministic observations so the index works immediately.
            for offset in range(180, -1, -1):
                dep=today-timedelta(days=offset)
                for route in active:
                    flights=demo_flights(route[:3],route[4:],str(dep),4)
                    for f in flights:
                        db.add(FareObservation(
                            observed_at=datetime.combine(dep,datetime.min.time(),tzinfo=timezone.utc),
                            departure_date=dep, route=route, airline_code=f["airlineCode"],
                            flight_number=f["flightNumber"], source="Seed Demo",
                            source_offer_id=f["id"], currency="INR",
                            base_fare=f["fare"]["base"], taxes=f["fare"]["taxes"],
                            fees=f["fare"]["fees"], total_fare=f["fare"]["total"],
                            cabin="ECONOMY", raw_payload=f, valid=True
                        ))
            db.commit()

        if not db.execute(select(DataQualitySource)).first():
            now=datetime.now(timezone.utc)
            db.add_all([
                DataQualitySource(name="Amadeus",status="offline",last_success=None,observation_count=0,error_rate_pct=0,freshness_minutes=999),
                DataQualitySource(name="Seed/Demo",status="healthy",last_success=now,observation_count=db.query(FareObservation).count(),error_rate_pct=0,freshness_minutes=0),
            ])
            db.add(CpiImpact(calculated_at=now,contribution_pp=0.14,note="Analytical estimate only. Replace with official MoSPI weights and approved source data before publication."))
            db.add_all([
                Anomaly(id="an-001",route="DEL-BOM",expected=4800,observed=7900,deviation_pct=64,possible_drivers=["High demand","Low availability","Holiday period"],detected_at=now-timedelta(hours=3),status="open"),
                Anomaly(id="an-002",route="BLR-GAU",expected=6200,observed=8950,deviation_pct=44,possible_drivers=["Low availability","Potential data issue"],detected_at=now-timedelta(days=1),status="open"),
            ])
            db.add_all([
                AuditLog(id="rev-014",timestamp=now-timedelta(days=2),version="v3.2",old_value=127.4,new_value=126.9,reason="Duplicate observations removed from OTA Aggregate feed.",affected_routes=["DEL-BOM","DEL-BLR"],reviewer="S. Rao"),
                AuditLog(id="rev-013",timestamp=now-timedelta(days=9),version="v3.1",old_value=128.1,new_value=127.4,reason="Route basket reweighted for Q3.",affected_routes=["DEL-GAU","PNQ-DEL"],reviewer="A. Menon"),
            ])
            db.commit()

        # Rebuild only if index is absent.
        if not db.execute(select(__import__("app.models",fromlist=["IndexValue"]).IndexValue)).first():
            rebuild_index_history(db, date.today()-timedelta(days=180), date.today())
    finally:
        db.close()
