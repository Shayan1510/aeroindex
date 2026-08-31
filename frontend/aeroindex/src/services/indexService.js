import { fetchJson } from "./api.js";

export async function getAirfareIndex() {
  return fetchJson(`/index`);
}

export async function getRouteIndex(route = "DEL-BOM") {
  const qs = new URLSearchParams({ route });
  return fetchJson(`/index/route?${qs.toString()}`);
}

export async function getIndexDecomposition() {
  return fetchJson(`/index/decomposition`);
}

export async function getBookingWindowFares(route = "DEL-BOM") {
  const qs = new URLSearchParams({ route });
  return fetchJson(`/index/booking-window?${qs.toString()}`);
}

export async function getIndexLevels() {
  return fetchJson(`/index/levels`);
}
