/** @type {import('../types').DataSourceHealth[]} */
export const SOURCE_HEALTH = [
  { name: "IndiGo", status: "healthy", lastSuccess: "2026-08-30T13:40:00", observationCount: 48210, errorRatePct: 0.4 },
  { name: "Air India", status: "healthy", lastSuccess: "2026-08-30T13:35:00", observationCount: 39880, errorRatePct: 0.6 },
  { name: "Vistara", status: "healthy", lastSuccess: "2026-08-30T13:22:00", observationCount: 21040, errorRatePct: 0.9 },
  { name: "Akasa Air", status: "delayed", lastSuccess: "2026-08-30T09:10:00", observationCount: 12870, errorRatePct: 3.1 },
  { name: "OTA Aggregate", status: "offline", lastSuccess: "2026-08-29T22:05:00", observationCount: 58210, errorRatePct: 8.7 },
];

export const DATA_QUALITY_SCORE = {
  overall: 96.4,
  breakdown: [
    { label: "Coverage", value: 97.8 },
    { label: "Completeness", value: 95.1 },
    { label: "Freshness", value: 98.6 },
    { label: "Consistency", value: 94.3 },
    { label: "Validity", value: 97.0 },
    { label: "Duplicate rate", value: 1.2, invert: true },
    { label: "Outlier rate", value: 2.4, invert: true },
  ],
};
