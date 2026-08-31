from collections import defaultdict
from datetime import date, timedelta
from statistics import median
from sqlalchemy import select, and_
from sqlalchemy.orm import Session
from ..models import FareObservation, RouteBasket, IndexValue

def _route_median(db: Session, route: str, day: date):
    rows = db.execute(
        select(FareObservation.total_fare)
        .where(and_(FareObservation.route == route,
                    FareObservation.departure_date == day,
                    FareObservation.valid.is_(True)))
    ).scalars().all()
    return float(median([float(x) for x in rows])) if rows else None

def calculate_daily_index(db: Session, day: date, baseline_date: date) -> float | None:
    basket = db.execute(select(RouteBasket).where(RouteBasket.status == "active")).scalars().all()
    weighted = []
    for r in basket:
        current = _route_median(db, r.route, day)
        baseline = _route_median(db, r.route, baseline_date)
        if current is not None and baseline and baseline > 0:
            route_index = current / baseline * 100.0
            weighted.append((route_index, r.weight_pct))
    if not weighted:
        return None
    total_weight = sum(w for _, w in weighted)
    return sum(v * w for v, w in weighted) / total_weight

def rebuild_index_history(db: Session, start: date, end: date):
    day = start
    while day <= end:
        value = calculate_daily_index(db, day, start)
        if value is not None:
            existing = db.execute(
                select(IndexValue).where(
                    IndexValue.index_date == day,
                    IndexValue.level == "National",
                    IndexValue.geography == "NATIONAL",
                    IndexValue.route.is_(None),
                    IndexValue.airline_code.is_(None),
                )
            ).scalar_one_or_none()
            if existing:
                existing.value = round(value, 2)
            else:
                db.add(IndexValue(
                    index_date=day, level="National", geography="NATIONAL",
                    value=round(value, 2), methodology_version="v1.0"
                ))
        day += timedelta(days=1)
    db.commit()
    _fill_changes(db, end)

def _fill_changes(db: Session, end: date):
    points = db.execute(
        select(IndexValue).where(
            IndexValue.level == "National",
            IndexValue.geography == "NATIONAL",
            IndexValue.index_date <= end,
        ).order_by(IndexValue.index_date)
    ).scalars().all()
    by_day = {p.index_date: p for p in points}
    for p in points:
        prev_day = by_day.get(p.index_date - timedelta(days=30))
        prev_week = by_day.get(p.index_date - timedelta(days=7))
        prev_year = by_day.get(p.index_date - timedelta(days=365))
        p.mom_pct = round((p.value / prev_day.value - 1) * 100, 2) if prev_day else None
        p.wow_pct = round((p.value / prev_week.value - 1) * 100, 2) if prev_week else None
        p.yoy_pct = round((p.value / prev_year.value - 1) * 100, 2) if prev_year else None
    db.commit()
