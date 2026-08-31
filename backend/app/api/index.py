from datetime import date, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import IndexValue, RouteBasket, FareObservation
from ..services.analytics import national_index, series
from ..services.fallback import demo_history

router = APIRouter(prefix="/api/v1", tags=["index"])

@router.get("/index")
def get_index(db: Session = Depends(get_db)):
    p = national_index(db)
    if not p:
        return {"current":127.4,"momPct":4.8,"wowPct":-1.2,"yoyPct":9.2,"series":[]}
    pts = series(db, 90)
    return {"current":p.value,"momPct":p.mom_pct or 0,"wowPct":p.wow_pct or 0,"yoyPct":p.yoy_pct or 0,"series":pts}

@router.get("/index/daily")
def get_daily_index(days: int = Query(90, ge=1, le=730), db: Session = Depends(get_db)):
    return series(db, days)

@router.get("/index/route")
def get_route_index(route: str = Query("DEL-BOM", pattern=r"^[A-Z]{3}-[A-Z]{3}$"), days: int = Query(90, ge=1, le=365), db: Session = Depends(get_db)):
    cutoff = date.today() - timedelta(days=days)
    rows = db.execute(select(IndexValue).where(
        IndexValue.level=="Route", IndexValue.route==route, IndexValue.index_date>=cutoff
    ).order_by(IndexValue.index_date)).scalars().all()
    if rows:
        return {"route":route,"series":[{"date":r.index_date,"value":r.value} for r in rows]}
    return {"route":route,"series":[{"date":x["date"],"value":round(x["price"]/60,1)} for x in demo_history(route,days)]}

@router.get("/index/decomposition")
def decomposition(db: Session = Depends(get_db)):
    basket = db.execute(select(RouteBasket).where(RouteBasket.status=="active")).scalars().all()
    out=[]
    national = national_index(db)
    for r in basket[:10]:
        route_rows = db.execute(select(FareObservation.total_fare).where(FareObservation.route==r.route).order_by(FareObservation.observed_at.desc()).limit(50)).scalars().all()
        if route_rows:
            current=sum(float(x) for x in route_rows)/len(route_rows)
            contribution=round((current/6000-1)*r.weight_pct/100*100,2)
            out.append({"route":r.route,"contributionPp":contribution})
    if not out:
        out=[{"route":"Delhi – Mumbai","contributionPp":1.8},{"route":"Delhi – Bengaluru","contributionPp":1.2},{"route":"Mumbai – Bengaluru","contributionPp":0.9},{"route":"Other routes","contributionPp":0.9}]
    return out

@router.get("/index/booking-window")
def booking_window(route: str = Query("DEL-BOM", pattern=r"^[A-Z]{3}-[A-Z]{3}$"), db: Session = Depends(get_db)):
    windows=["T-1","T-7","T-15","T-30","T-45"]
    result=[]
    for i,w in enumerate(windows):
        target=date.today()+timedelta(days=[1,7,15,30,45][i])
        rows=db.execute(select(FareObservation.total_fare).where(FareObservation.route==route,FareObservation.departure_date.between(target-timedelta(days=2),target+timedelta(days=2)))).scalars().all()
        fare=round(sum(float(x) for x in rows)/len(rows)) if rows else round(5200*(1+(5-i)*.11))
        result.append({"window":w,"fare":fare})
    return {"route":route,"windows":windows,"data":result}

@router.get("/index/levels")
def index_levels():
    return ["National","Region","Airport","Route","Airline"]

@router.get("/routes")
def routes(db: Session = Depends(get_db)):
    rows=db.execute(select(RouteBasket).order_by(RouteBasket.weight_pct.desc())).scalars().all()
    return [{"route":r.route,"weightPct":r.weight_pct,"status":r.status,"effectiveDate":r.effective_date,"version":r.version} for r in rows]
