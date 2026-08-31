from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import RouteBasket, AuditLog
from ..schemas import RouteUpsert

router=APIRouter(prefix="/api/v1/admin",tags=["admin"])

@router.get("/routes")
def list_routes(db:Session=Depends(get_db)):
    rows=db.execute(select(RouteBasket).order_by(RouteBasket.weight_pct.desc())).scalars().all()
    return [{"route":r.route,"weightPct":r.weight_pct,"status":r.status,"effectiveDate":r.effective_date,"version":r.version} for r in rows]

@router.post("/routes")
def add_route(body:RouteUpsert, db:Session=Depends(get_db)):
    if db.get(RouteBasket, body.route):
        raise HTTPException(409,"Route already exists")
    r=RouteBasket(route=body.route,weight_pct=body.weightPct,status=body.status,effective_date=body.effectiveDate,version=body.version)
    db.add(r); db.commit()
    return {"ok":True,"route":body.route}

@router.put("/routes/{route}")
def update_route(route:str, body:RouteUpsert, db:Session=Depends(get_db)):
    r=db.get(RouteBasket, route)
    if not r: raise HTTPException(404,"Route not found")
    r.weight_pct=body.weightPct; r.status=body.status; r.effective_date=body.effectiveDate; r.version=body.version
    db.commit()
    return {"ok":True}

@router.delete("/routes/{route}")
def delete_route(route:str, db:Session=Depends(get_db)):
    r=db.get(RouteBasket,route)
    if not r: raise HTTPException(404,"Route not found")
    r.status="retired"
    db.commit()
    return {"ok":True}
