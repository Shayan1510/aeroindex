import { resolveMock } from "./api.js";
import {
  NATIONAL_INDEX,
  INDEX_DECOMPOSITION,
  BOOKING_WINDOWS,
  ROUTE_INDEX_LEVELS,
  generateBookingWindowFares,
  generateIndexSeries,
} from "../mock/indexData.js";

export async function getAirfareIndex() {
  return resolveMock(NATIONAL_INDEX);
}

export async function getRouteIndex(route = "DEL-BOM") {
  return resolveMock({
    route,
    series: generateIndexSeries(`route-${route}`, 90, 120),
  });
}

export async function getIndexDecomposition() {
  return resolveMock(INDEX_DECOMPOSITION);
}

export async function getBookingWindowFares(route = "DEL-BOM") {
  return resolveMock({
    route,
    windows: BOOKING_WINDOWS,
    data: generateBookingWindowFares(route),
  });
}

export async function getIndexLevels() {
  return resolveMock(ROUTE_INDEX_LEVELS);
}
