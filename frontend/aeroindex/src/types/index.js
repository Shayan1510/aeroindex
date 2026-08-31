/**
 * Shared type contracts for AeroIndex.
 *
 * This project intentionally uses plain JS + JSDoc rather than TypeScript so a
 * hackathon team can move fast — but every mock service below returns data
 * shaped exactly like this, so swapping a mock function body for a real
 * `fetch()` call later requires no changes anywhere else in the app.
 *
 * @typedef {Object} Airport
 * @property {string} code - IATA code, e.g. "DEL"
 * @property {string} city
 * @property {string} name
 *
 * @typedef {Object} Airline
 * @property {string} code - e.g. "6E"
 * @property {string} name
 *
 * @typedef {Object} Flight
 * @property {string} id
 * @property {string} airlineCode
 * @property {string} flightNumber
 * @property {string} from
 * @property {string} to
 * @property {string} departTime - ISO string
 * @property {string} arriveTime - ISO string
 * @property {number} durationMinutes
 * @property {number} stops
 * @property {string} cabin
 * @property {string} baggage
 * @property {{ base:number, taxes:number, fees:number, total:number }} fare
 * @property {"very_good"|"good"|"average"|"high"|"very_high"} priceRating
 * @property {string} source - e.g. "Airline Direct" | "OTA Aggregate"
 * @property {string} lastUpdated - ISO string
 *
 * @typedef {Object} PriceHistoryPoint
 * @property {string} date
 * @property {number} price
 *
 * @typedef {Object} IndexPoint
 * @property {string} date
 * @property {number} value
 *
 * @typedef {Object} RouteBasketEntry
 * @property {string} route - e.g. "DEL-BOM"
 * @property {number} weightPct
 * @property {"active"|"under_review"|"retired"} status
 * @property {string} effectiveDate
 * @property {string} version
 *
 * @typedef {Object} DataSourceHealth
 * @property {string} name
 * @property {"healthy"|"delayed"|"offline"} status
 * @property {string} lastSuccess
 * @property {number} observationCount
 * @property {number} errorRatePct
 *
 * @typedef {Object} Anomaly
 * @property {string} id
 * @property {string} route
 * @property {number} expected
 * @property {number} observed
 * @property {number} deviationPct
 * @property {string[]} possibleDrivers
 * @property {string} detectedAt
 * @property {"open"|"reviewed"|"dismissed"} status
 *
 * @typedef {Object} BacktestResult
 * @property {string} windowLabel
 * @property {number} mae
 * @property {number} rmse
 * @property {number} mape
 * @property {number} correlation
 * @property {number} coveragePct
 * @property {IndexPoint[]} ourIndex
 * @property {IndexPoint[]} dgcaReference
 *
 * @typedef {Object} AuditEntry
 * @property {string} id
 * @property {string} timestamp
 * @property {string} version
 * @property {number} oldValue
 * @property {number} newValue
 * @property {string} reason
 * @property {string[]} affectedRoutes
 * @property {string} reviewer
 */

export {};
