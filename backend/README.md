# AeroIndex Backend — SIH26056

Production-oriented FastAPI backend for the AeroIndex airfare intelligence frontend.

## What this backend provides

- PostgreSQL persistence with SQLAlchemy 2.x
- FastAPI REST API with OpenAPI/Swagger documentation
- Flight search and fare-history endpoints
- Amadeus Flight Offers Search integration
- Provider abstraction so additional airline/OTA collectors can be added without changing the index engine
- Fare observation storage and normalization
- Route-basket weighted airfare index calculation
- National, route and analytics endpoints used by the AeroIndex UI
- Data-quality, anomaly, forecast, CPI-impact, backtest and audit endpoints
- Scheduled ingestion using APScheduler
- Deterministic seed/demo data so the application remains demonstrable without external API credentials
- Docker Compose PostgreSQL setup
- CORS configuration for the React/Vite frontend

## Architecture

```text
Airline / OTA APIs
       |
       v
Provider adapters -> Normalizer -> FareObservation (PostgreSQL)
                                      |
                                      v
                               Validation / QA
                                      |
                                      v
                         Route median / route index
                                      |
                                      v
                              Route basket weights
                                      |
                                      v
                         National Airfare Price Index
                                      |
                    +-----------------+----------------+
                    |                 |                |
                 Dashboard         Analytics          CPI
```

## Quick start — Windows

### 1. Start PostgreSQL

```powershell
docker compose up -d db
```

### 2. Create Python environment

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment

```powershell
copy .env.example .env
```

The default database points at the PostgreSQL container created by Docker Compose.

### 4. Start API

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open:

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health: `http://localhost:8000/health`

## Quick start — Docker

```bash
docker compose up --build
```

The API will be available on port 8000 and PostgreSQL on port 5432.

## Live airfare provider

Set these values in `.env` to enable Amadeus:

```env
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
AMADEUS_BASE_URL=https://test.api.amadeus.com
```

If credentials are not configured, flight search and the dashboard use the deterministic demo/fallback layer. This is intentional: it lets the hackathon presentation work even when external credentials or provider availability are unavailable.

## Frontend API contract

The backend exposes the routes expected by the AeroIndex React application:

```text
GET /api/v1/airports?q=del
GET /api/v1/flights?from=DEL&to=BOM&date=2026-09-15
GET /api/v1/flights/{id}
GET /api/v1/fares?route=DEL-BOM
GET /api/v1/price-history?route=DEL-BOM
GET /api/v1/index
GET /api/v1/index/daily?days=90
GET /api/v1/index/route?route=DEL-BOM
GET /api/v1/index/decomposition
GET /api/v1/index/booking-window?route=DEL-BOM
GET /api/v1/index/levels
GET /api/v1/routes
GET /api/v1/data-quality
GET /api/v1/anomalies
GET /api/v1/forecast
GET /api/v1/cpi-impact
GET /api/v1/backtest
GET /api/v1/audit
GET /api/v1/admin/routes
```

## Important statistical note

The seeded/demo values are not official government statistics. For a real SIH deployment, replace the demo/reference series with approved source data and document the sampling frame, route weights, fare definition, taxes/fees treatment, quality rules, revision policy and official benchmark/reference series.

The backend deliberately stores individual fare observations before calculating the index. This creates an auditable chain:

`source -> observation -> validation -> route statistic -> weighted index -> analytical outputs`

## Project structure

```text
backend/
├── app/
│   ├── api/              # REST endpoints
│   ├── services/         # ingestion, normalization, analytics, index engine
│   ├── models.py         # SQLAlchemy database models
│   ├── schemas.py        # API/Pydantic schemas
│   ├── config.py         # environment configuration
│   ├── db.py             # PostgreSQL/SQLAlchemy setup
│   ├── scheduler.py      # scheduled collection
│   ├── seed.py           # demo dataset
│   └── main.py           # FastAPI application
├── scripts/              # operational scripts
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## Adding another data provider

Implement a provider adapter under `app/services/providers/`, normalize its response through the existing normalization layer, and persist the resulting fare observations. Do not put provider-specific logic into the index calculation code.

## Hackathon deployment checklist

1. Configure PostgreSQL.
2. Configure at least one approved live airfare provider.
3. Add additional compliant airline/OTA providers where permitted.
4. Define and freeze the route basket and weight version.
5. Replace demo/reference data with approved benchmark data.
6. Run ingestion on a schedule and monitor data-quality metrics.
7. Keep source payloads/observation timestamps for auditability.
8. Demonstrate the complete source-to-index pipeline in the UI.
