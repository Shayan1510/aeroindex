import { fetchJson } from "./api.js";

/**
 * @param {{from:string, to:string, date:string}} params
 */
export async function searchFlights(params) {
  const qs = new URLSearchParams({ from: params.from, to: params.to, date: params.date });
  return fetchJson(`/flights?${qs.toString()}`);
}

export async function getFlightDetails(id) {
  return fetchJson(`/flights/${encodeURIComponent(id)}`);
}

export async function getPriceHistory(routeKey) {
  const qs = new URLSearchParams({ route: routeKey });
  return fetchJson(`/price-history?${qs.toString()}`);
}

export async function searchAirports(query) {
  const qs = new URLSearchParams({ q: query.trim() });
  return fetchJson(`/airports?${qs.toString()}`);
}
