import { seededRandom } from "../lib/prng.js";

/**
 * @returns {import('../types').IndexPoint[]}
 */
export function generateIndexSeries(seedKey, points = 90, base = 118) {
  const rng = seededRandom(seedKey);
  const series = [];
  let value = base;
  for (let i = points; i >= 0; i--) {
    value += (rng() - 0.47) * 1.1;
    value = Math.max(90, Math.min(150, value));
    const d = new Date();
    d.setDate(d.getDate() - i);
    series.push({ date: d.toISOString().slice(0, 10), value: Math.round(value * 10) / 10 });
  }
  return series;
}

export const NATIONAL_INDEX = {
  current: 127.4,
  momPct: 4.8,
  wowPct: -1.2,
  yoyPct: 9.2,
  series: generateIndexSeries("national-index", 90, 122),
};

export const INDEX_DECOMPOSITION = [
  { route: "Delhi \u2013 Mumbai", contributionPp: 1.8 },
  { route: "Delhi \u2013 Bengaluru", contributionPp: 1.2 },
  { route: "Mumbai \u2013 Bengaluru", contributionPp: 0.9 },
  { route: "Other routes", contributionPp: 0.9 },
];

export const BOOKING_WINDOWS = ["T-1", "T-7", "T-15", "T-30", "T-45"];

export function generateBookingWindowFares(route) {
  const rng = seededRandom(`booking-${route}`);
  const base = 5200;
  return BOOKING_WINDOWS.map((w, i) => ({
    window: w,
    fare: Math.round(base * (1 + (BOOKING_WINDOWS.length - i) * 0.11) * (0.94 + rng() * 0.12)),
  }));
}

export const ROUTE_INDEX_LEVELS = ["National", "Region", "Airport", "Route", "Airline"];
