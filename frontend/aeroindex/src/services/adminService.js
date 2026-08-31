import { resolveMock } from "./api.js";
import { ROUTE_BASKET } from "../mock/routeBasket.js";
import { AUDIT_LOG } from "../mock/analytics.js";

export async function getRouteBasket() {
  return resolveMock(ROUTE_BASKET);
}

export async function getAuditLog() {
  return resolveMock(AUDIT_LOG);
}
