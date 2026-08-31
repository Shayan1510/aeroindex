from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

class FlightSearchParams(BaseModel):
    from_: str = Field(alias="from", min_length=3, max_length=3)
    to: str = Field(min_length=3, max_length=3)
    date: date
    adults: int = Field(default=1, ge=1, le=9)
    max_results: int = Field(default=20, ge=1, le=50)
    model_config = ConfigDict(populate_by_name=True)

class FareOut(BaseModel):
    base: float
    taxes: float
    fees: float
    total: float

class FlightOut(BaseModel):
    id: str
    airlineCode: str
    flightNumber: str
    from_: str = Field(alias="from")
    to: str
    departTime: datetime
    arriveTime: datetime
    durationMinutes: int
    stops: int
    cabin: str
    baggage: str
    fare: FareOut
    priceRating: str
    source: str
    lastUpdated: datetime
    model_config = ConfigDict(populate_by_name=True)

class IndexPoint(BaseModel):
    date: date
    value: float

class IndexOut(BaseModel):
    current: float
    momPct: float
    wowPct: float
    yoyPct: float
    series: list[IndexPoint]

class RouteOut(BaseModel):
    route: str
    weightPct: float
    status: str
    effectiveDate: date
    version: str

class CpiOut(BaseModel):
    estimatedContributionPp: float
    note: str

class RouteUpsert(BaseModel):
    route: str = Field(pattern=r"^[A-Z]{3}-[A-Z]{3}$")
    weightPct: float = Field(gt=0, le=100)
    status: str = "active"
    effectiveDate: date
    version: str = "v1.0"
