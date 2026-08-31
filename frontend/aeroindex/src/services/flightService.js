import { resolveMock } from "./api.js";
import { generateFlights, generatePriceHistory, priceStats } from "../mock/flights.js";
import { AIRPORTS } from "../mock/reference.js";

/**
 * @param {{from:string, to:string, date:string}} params
 */
export async function searchFlights(params) {
  const flights = generateFlights(params);
  return resolveMock({ params, flights, count: flights.length });
}

export async function getFlightDetails(id) {
  const [airlineCode, routeKey] = id.split("-");
  const from = routeKey?.slice(0, 3) ?? "DEL";
  const to = routeKey?.slice(3, 6) ?? "BOM";
  const today = new Date().toISOString().slice(0, 10);
  const flights = generateFlights({ from, to, date: today });
  const flight = flights.find((f) => f.id === id) ?? flights[0];
  return resolveMock(flight);
}

export async function getPriceHistory(routeKey) {
  const history = generatePriceHistory(routeKey);
  return resolveMock({ history, stats: priceStats(history) });
}

export async function searchAirports(query) {
  const q = query.trim().toLowerCase();
  if (!q) return resolveMock(AIRPORTS.slice(0, 6));
  const results = AIRPORTS.filter(
    (a) => a.city.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
  );
  return resolveMock(results);
}
