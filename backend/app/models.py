from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import Date, DateTime, Float, Integer, JSON, Numeric, String, Text, Boolean, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base

class Airport(Base):
    __tablename__ = "airports"
    code: Mapped[str] = mapped_column(String(3), primary_key=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)

class RouteBasket(Base):
    __tablename__ = "route_basket"
    route: Mapped[str] = mapped_column(String(7), primary_key=True)
    weight_pct: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="active", nullable=False)
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)
    version: Mapped[str] = mapped_column(String(20), default="v1.0", nullable=False)

class FareObservation(Base):
    __tablename__ = "fare_observations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    departure_date: Mapped[date] = mapped_column(Date, nullable=False)
    route: Mapped[str] = mapped_column(String(7), nullable=False)
    airline_code: Mapped[str | None] = mapped_column(String(10))
    flight_number: Mapped[str | None] = mapped_column(String(30))
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    source_offer_id: Mapped[str | None] = mapped_column(String(150))
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    base_fare: Mapped[float] = mapped_column(Numeric(12,2), nullable=False)
    taxes: Mapped[float] = mapped_column(Numeric(12,2), default=0)
    fees: Mapped[float] = mapped_column(Numeric(12,2), default=0)
    total_fare: Mapped[float] = mapped_column(Numeric(12,2), nullable=False)
    cabin: Mapped[str] = mapped_column(String(30), default="ECONOMY")
    raw_payload: Mapped[dict | None] = mapped_column(JSON)
    valid: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    __table_args__ = (
        Index("ix_fare_route_departure", "route", "departure_date"),
        Index("ix_fare_observed_at", "observed_at"),
    )

class IndexValue(Base):
    __tablename__ = "index_values"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    index_date: Mapped[date] = mapped_column(Date, nullable=False)
    level: Mapped[str] = mapped_column(String(30), nullable=False)
    geography: Mapped[str] = mapped_column(String(30), nullable=False, default="NATIONAL")
    route: Mapped[str | None] = mapped_column(String(7))
    airline_code: Mapped[str | None] = mapped_column(String(10))
    value: Mapped[float] = mapped_column(Float, nullable=False)
    mom_pct: Mapped[float | None] = mapped_column(Float)
    wow_pct: Mapped[float | None] = mapped_column(Float)
    yoy_pct: Mapped[float | None] = mapped_column(Float)
    methodology_version: Mapped[str] = mapped_column(String(20), default="v1.0")
    __table_args__ = (
        UniqueConstraint("index_date", "level", "geography", "route", "airline_code", name="uq_index_point"),
        Index("ix_index_date_level", "index_date", "level"),
    )

class DataQualitySource(Base):
    __tablename__ = "data_quality_sources"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    status: Mapped[str] = mapped_column(String(20), default="offline")
    last_success: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    observation_count: Mapped[int] = mapped_column(Integer, default=0)
    error_rate_pct: Mapped[float] = mapped_column(Float, default=0)
    freshness_minutes: Mapped[float] = mapped_column(Float, default=0)

class Anomaly(Base):
    __tablename__ = "anomalies"
    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    route: Mapped[str] = mapped_column(String(7))
    expected: Mapped[float] = mapped_column(Float)
    observed: Mapped[float] = mapped_column(Float)
    deviation_pct: Mapped[float] = mapped_column(Float)
    possible_drivers: Mapped[list] = mapped_column(JSON, default=list)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(20), default="open")

class AuditLog(Base):
    __tablename__ = "audit_log"
    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    version: Mapped[str] = mapped_column(String(20))
    old_value: Mapped[float] = mapped_column(Float)
    new_value: Mapped[float] = mapped_column(Float)
    reason: Mapped[str] = mapped_column(Text)
    affected_routes: Mapped[list] = mapped_column(JSON, default=list)
    reviewer: Mapped[str] = mapped_column(String(100))

class CpiImpact(Base):
    __tablename__ = "cpi_impact"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    contribution_pp: Mapped[float] = mapped_column(Float)
    note: Mapped[str] = mapped_column(Text)
