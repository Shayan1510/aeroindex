import { generateIndexSeries } from "./indexData.js";

/** @type {import('../types').Anomaly[]} */
export const ANOMALIES = [
  {
    id: "an-001",
    route: "Delhi \u2192 Mumbai",
    expected: 4800,
    observed: 7900,
    deviationPct: 64,
    possibleDrivers: ["High demand", "Low availability", "Holiday period"],
    detectedAt: "2026-08-29T18:20:00",
    status: "open",
  },
  {
    id: "an-002",
    route: "Bengaluru \u2192 Guwahati",
    expected: 6200,
    observed: 8950,
    deviationPct: 44,
    possibleDrivers: ["Low availability", "Potential data issue"],
    detectedAt: "2026-08-28T09:05:00",
    status: "open",
  },
  {
    id: "an-003",
    route: "Mumbai \u2192 Goa",
    expected: 3400,
    observed: 5100,
    deviationPct: 50,
    possibleDrivers: ["Holiday period", "High demand"],
    detectedAt: "2026-08-27T14:40:00",
    status: "reviewed",
  },
];

export const FORECAST = {
  horizonDays: 7,
  expectedRangeLow: 130,
  expectedRangeHigh: 134,
  confidencePct: 82,
  series: generateIndexSeries("forecast", 14, 128),
};

export const CPI_IMPACT = {
  estimatedContributionPp: 0.14,
  note: "Estimated analytical contribution — not an official CPI figure until MoSPI weights and source data are formally integrated.",
};

/** @type {import('../types').BacktestResult} */
export const BACKTEST_RESULT = {
  windowLabel: "30-day backtest",
  mae: 1.82,
  rmse: 2.41,
  mape: 1.6,
  correlation: 0.94,
  coveragePct: 91.2,
  ourIndex: generateIndexSeries("backtest-ours", 30, 125),
  dgcaReference: generateIndexSeries("backtest-dgca", 30, 124),
};

/** @type {import('../types').AuditEntry[]} */
export const AUDIT_LOG = [
  {
    id: "rev-014",
    timestamp: "2026-08-28T07:00:00",
    version: "v3.2",
    oldValue: 127.4,
    newValue: 126.9,
    reason: "Duplicate observations removed from OTA Aggregate feed.",
    affectedRoutes: ["DEL-BOM", "DEL-BLR"],
    reviewer: "S. Rao",
  },
  {
    id: "rev-013",
    timestamp: "2026-08-21T07:00:00",
    version: "v3.1",
    oldValue: 128.1,
    newValue: 127.4,
    reason: "Route basket reweighted for Q3 (added DEL-GAU under review).",
    affectedRoutes: ["DEL-GAU", "PNQ-DEL"],
    reviewer: "A. Menon",
  },
  {
    id: "rev-012",
    timestamp: "2026-08-14T07:00:00",
    version: "v3.0",
    oldValue: 126.5,
    newValue: 128.1,
    reason: "Outlier fares from a single OTA source excluded after validation review.",
    affectedRoutes: ["BOM-MAA"],
    reviewer: "S. Rao",
  },
];
