import { fetchJson } from "./api.js";

export async function getDataQuality() {
  return fetchJson(`/data-quality`);
}

export async function getAnomalies() {
  return fetchJson(`/anomalies`);
}

export async function getForecast() {
  return fetchJson(`/forecast`);
}

export async function getCpiImpact() {
  return fetchJson(`/cpi-impact`);
}

export async function getBacktest() {
  return fetchJson(`/backtest`);
}
