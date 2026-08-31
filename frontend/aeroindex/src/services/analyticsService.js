import { resolveMock } from "./api.js";
import { SOURCE_HEALTH, DATA_QUALITY_SCORE } from "../mock/dataQuality.js";
import { ANOMALIES, FORECAST, CPI_IMPACT, BACKTEST_RESULT } from "../mock/analytics.js";

export async function getDataQuality() {
  return resolveMock({ sources: SOURCE_HEALTH, score: DATA_QUALITY_SCORE });
}

export async function getAnomalies() {
  return resolveMock(ANOMALIES);
}

export async function getForecast() {
  return resolveMock(FORECAST);
}

export async function getCpiImpact() {
  return resolveMock(CPI_IMPACT);
}

export async function getBacktest() {
  return resolveMock(BACKTEST_RESULT);
}
