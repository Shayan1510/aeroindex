import { fetchJson } from "./api.js";

export async function getRouteBasket() {
  return fetchJson(`/admin/routes`);
}

export async function getAuditLog() {
  return fetchJson(`/audit`);
}
