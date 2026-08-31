import { AIRLINES } from "./reference.js";
import { seededRandom, randRange } from "../lib/prng.js";

function rateFare(total, avg) {
  const ratio = total / avg;
  if (ratio < 0.85) return "very_good";
  if (ratio < 0.97) return "good";
  if (ratio < 1.1) return "average";
  if (ratio < 1.25) return "high";
  return "very_high";
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/**
 * Generates a deterministic-ish list of mock flights for a route + date.
 * @param {{from:string, to:string, date:string}} params
 * @returns {import('../types').Flight[]}
 */
export function generateFlights({ from, to, date }) {
  const rng = seededRandom(`${from}-${to}-${date}`);
  const routeAvg = randRange(rng, 4200, 7800);
  const count = 5 + Math.floor(rng() * 4);
  const flights = [];

  for (let i = 0; i < count; i++) {
    const airline = AIRLINES[Math.floor(rng() * AIRLINES.length)];
    const depHour = 5 + Math.floor(rng() * 17);
    const depMin = Math.floor(rng() * 12) * 5;
    const durationMinutes = 90 + Math.floor(rng() * 90);
    const stops = rng() > 0.78 ? 1 : 0;
    const base = routeAvg * randRange(rng, 0.72, 1.35);
    const taxes = base * 0.14;
    const fees = 199 + Math.floor(rng() * 150);
    const total = Math.round(base + taxes + fees);

    const departTime = `${date}T${pad(depHour)}:${pad(depMin)}:00`;
    const arriveDate = new Date(new Date(departTime).getTime() + (durationMinutes + stops * 45) * 60000);

    flights.push({
      id: `${airline.code}-${from}${to}-${i}-${date}`,
      airlineCode: airline.code,
      flightNumber: `${airline.code} ${100 + Math.floor(rng() * 899)}`,
      from,
      to,
      departTime,
      arriveTime: arriveDate.toISOString(),
      durationMinutes: durationMinutes + stops * 45,
      stops,
      cabin: "Economy",
      baggage: "15kg check-in + 7kg cabin",
      fare: {
        base: Math.round(base),
        taxes: Math.round(taxes),
        fees,
        total,
      },
      priceRating: rateFare(total, routeAvg),
      source: rng() > 0.5 ? "Airline Direct" : "OTA Aggregate",
      lastUpdated: new Date(Date.now() - Math.floor(rng() * 45) * 60000).toISOString(),
    });
  }

  return flights.sort((a, b) => new Date(a.departTime) - new Date(b.departTime));
}

/**
 * @returns {import('../types').PriceHistoryPoint[]}
 */
export function generatePriceHistory(routeKey, days = 60) {
  const rng = seededRandom(routeKey);
  const avg = randRange(rng, 4200, 7800);
  const points = [];
  let cursor = avg * randRange(rng, 0.9, 1.1);

  for (let i = days; i >= 0; i--) {
    cursor += (rng() - 0.5) * avg * 0.06;
    cursor = Math.max(avg * 0.6, Math.min(avg * 1.6, cursor));
    const d = new Date();
    d.setDate(d.getDate() - i);
    points.push({ date: d.toISOString().slice(0, 10), price: Math.round(cursor) });
  }
  return points;
}

export function priceStats(history) {
  const values = history.map((p) => p.price);
  const current = values[values.length - 1];
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const sorted = [...values].sort((a, b) => a - b);
  const percentile = Math.round((sorted.indexOf(current) / (sorted.length - 1)) * 100);
  return { current, average: avg, lowest: low, highest: high, percentile };
}
