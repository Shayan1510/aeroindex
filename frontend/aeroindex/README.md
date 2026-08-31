# AeroIndex — Frontend (SIH26056 Prototype)

India's Airfare Intelligence Platform. Frontend-only prototype built for
Smart India Hackathon 2026, problem statement **SIH26056** — *Development of
a Real-time Airfare Price Index for India through Automated Web Scraping of
Airline and OTA Portals for Augmentation of the CPI* (sponsor: MoSPI).

## Scope

This build is intentionally scoped to what the problem statement actually
asks for, plus a minimal traveler-facing layer to demonstrate public value:

- **Traveler side** (lean): search → results → flight detail with a
  "is this a good price" panel. No tracking/alerts/dashboard — kept out to
  stay focused on the statistical deliverable.
- **Intelligence side** (full): national + route airfare index, index
  decomposition, advance-booking window analysis, representative route
  basket, data quality & source health monitor, anomaly detection,
  forecasting, CPI contribution estimate, DGCA backtesting, audit/revision
  log, methodology, reports, and an API portal preview.

All data is a seeded, deterministic **mock/prototype dataset** — clearly
labeled as such throughout the UI. No live scraping or real backend yet.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  components/   Shared UI: Navbar, cards, charts, states, etc.
  context/      Theme (light/dark) context
  lib/          Small utilities (seeded PRNG for stable mock data)
  mock/         Mock datasets (flights, index, route basket, etc.)
  services/     Service layer — the seam to swap for a real backend later
  pages/        Traveler-facing routes
  pages/intelligence/   Government/analyst routes (nested under /intelligence)
  types/        JSDoc type contracts documenting data shapes
```

## Connecting a real backend later

Every page calls a function from `src/services/*`, never mock data
directly. Each service function currently does:

```js
export async function getAirfareIndex() {
  return resolveMock(NATIONAL_INDEX);
}
```

To go live, replace the body with a real fetch, keeping the same return
shape (documented in `src/types/index.js`):

```js
export async function getAirfareIndex() {
  const res = await fetch(`${API_BASE}/index`);
  return res.json();
}
```

No page or component needs to change.

## Design notes

- Palette: deep indigo-navy + brass/amber + signal blue (light and dark
  modes both hand-tuned, not simple inversions).
- Type: Space Grotesk (display) + Inter (body) + JetBrains Mono for every
  data figure — index values, fares, percentages — styled like a departure
  board / instrument readout.
- Homepage stays minimal on purpose (hero + search only); all statistical
  density lives behind "Open Intelligence."
