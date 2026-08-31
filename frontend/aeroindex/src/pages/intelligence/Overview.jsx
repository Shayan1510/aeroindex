import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAirfareIndex } from "../../services/indexService.js";
import { getDataQuality, getAnomalies } from "../../services/analyticsService.js";
import StatTile from "../../components/StatTile.jsx";
import { TileSkeleton } from "../../components/States.jsx";

export default function Overview() {
  const [index, setIndex] = useState(null);
  const [quality, setQuality] = useState(null);
  const [anomalies, setAnomalies] = useState(null);

  useEffect(() => {
    getAirfareIndex().then(setIndex);
    getDataQuality().then(setQuality);
    getAnomalies().then(setAnomalies);
  }, []);

  const loading = !index || !quality || !anomalies;

  return (
    <div>
      <div className="eyebrow mb-2">Prototype Dataset</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">Intelligence Overview</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-8 max-w-lg">
        A working snapshot of the national airfare index, data pipeline health, and open anomalies.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <TileSkeleton key={i} />)
        ) : (
          <>
            <StatTile label="National Index" value={index.current} change={index.momPct} sub="Month over month" />
            <StatTile label="Data Quality" value={`${quality.score.overall}%`} sub="Overall score" />
            <StatTile
              label="Open Anomalies"
              value={anomalies.filter((a) => a.status === "open").length}
              sub="Needs review"
            />
            <StatTile
              label="Sources Healthy"
              value={`${quality.sources.filter((s) => s.status === "healthy").length}/${quality.sources.length}`}
              sub="Live source health"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { to: "/intelligence/index", title: "Airfare Index", desc: "National and route-level index trend, daily/weekly/monthly." },
          { to: "/intelligence/routes", title: "Route Basket", desc: "The representative routes and weights behind the index." },
          { to: "/intelligence/data-quality", title: "Data Quality", desc: "Source health, coverage, freshness and validity." },
          { to: "/intelligence/insights", title: "Anomalies & Forecast", desc: "Unusual fare movements and the near-term outlook." },
          { to: "/intelligence/cpi", title: "CPI Impact", desc: "Estimated analytical contribution to the CPI." },
          { to: "/intelligence/backtesting", title: "Backtesting", desc: "Validation against the DGCA reference series." },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="card p-4 hover:border-signal/40 dark:hover:border-signal-soft/40 transition-colors">
            <div className="font-medium text-sm mb-1">{c.title}</div>
            <p className="text-xs text-ink-mute dark:text-ink-darkMute">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
