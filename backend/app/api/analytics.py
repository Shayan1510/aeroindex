from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Anomaly, AuditLog
from ..services.analytics import data_quality, anomalies, forecast, cpi, backtest

router=APIRouter(prefix="/api/v1",tags=["analytics"])

@router.get("/data-quality")
def get_quality(db: Session=Depends(get_db)):
    return data_quality(db)

@router.get("/anomalies")
def get_anomalies(db: Session=Depends(get_db)):
    return [{
        "id":a.id,"route":a.route.replace("-"," → "),"expected":a.expected,"observed":a.observed,
        "deviationPct":a.deviation_pct,"possibleDrivers":a.possible_drivers,
        "detectedAt":a.detected_at,"status":a.status
    } for a in anomalies(db)]

@router.get("/forecast")
def get_forecast(db: Session=Depends(get_db)):
    return forecast(db)

@router.get("/cpi-impact")
def get_cpi(db: Session=Depends(get_db)):
    return cpi(db)

@router.get("/backtest")
def get_backtest(db: Session=Depends(get_db)):
    return backtest(db)

@router.get("/audit")
def get_audit(db: Session=Depends(get_db)):
    rows=db.execute(select(AuditLog).order_by(AuditLog.timestamp.desc())).scalars().all()
    return [{
        "id":x.id,"timestamp":x.timestamp,"version":x.version,"oldValue":x.old_value,"newValue":x.new_value,
        "reason":x.reason,"affectedRoutes":x.affected_routes,"reviewer":x.reviewer
    } for x in rows]
