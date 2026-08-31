import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getAnomalies, getForecast } from "../../services/analyticsService.js";
import TrendChart from "../../components/TrendChart.jsx";
import { EmptyState } from "../../components/States.jsx";

function timeAgo(iso) {
  const hrs = Math.round((Date.now() - new Date(iso).getTime()) / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function Insights() {
  const [anomalies, setAnomalies] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [reviewed, setReviewed] = useState([]);

  useEffect(() => {
    getAnomalies().then(setAnomalies);
    getForecast().then(setForecast);
  }, []);

  return (
    <div>
      <div className="eyebrow mb-2">Prototype Dataset</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-6">Anomaly Detection &amp; Forecast</h1>

      <div className="eyebrow mb-3">Detected anomalies</div>
      <div className="flex flex-col gap-3 mb-8">
        {anomalies?.filter((a) => !reviewed.includes(a.id)).length === 0 && anomalies && (
          <EmptyState title="No open anomalies" description="All detected fare anomalies have been reviewed." icon={AlertTriangle} />
        )}
        {anomalies?.map(
          (a) =>
            !reviewed.includes(a.id) && (
              <div key={a.id} className="card p-4 border-l-2 border-l-bad">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-bad" />
                    <span className="font-medium text-sm">Anomaly detected — {a.route}</span>
                  </div>
                  <span className="text-[11px] text-ink-mute dark:text-ink-darkMute figure shrink-0">{timeAgo(a.detectedAt)}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                  <div>
                    <div className="text-ink-mute dark:text-ink-darkMute">Normal</div>
                    <div className="figure mt-0.5">₹{a.expected.toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div className="text-ink-mute dark:text-ink-darkMute">Observed</div>
                    <div className="figure mt-0.5">₹{a.observed.toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div className="text-ink-mute dark:text-ink-darkMute">Deviation</div>
                    <div className="figure mt-0.5 text-bad">+{a.deviationPct}%</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {a.possibleDrivers.map((d) => (
                    <span key={d} className="pill px-2 py-0.5 text-[11px] bg-surface-light2 dark:bg-surface-dark text-ink-mute dark:text-ink-darkMute">
                      {d}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setReviewed((r) => [...r, a.id])}
                  className="btn-secondary text-xs !py-1.5"
                >
                  Review anomaly
                </button>
              </div>
            )
        )}
      </div>

      {forecast && (
        <div className="card p-5">
          <div className="eyebrow mb-1">Airfare forecast — next {forecast.horizonDays} days</div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="figure text-2xl font-semibold">
              {forecast.expectedRangeLow}–{forecast.expectedRangeHigh}
            </span>
            <span className="text-xs text-ink-mute dark:text-ink-darkMute figure">{forecast.confidencePct}% confidence</span>
          </div>
          <p className="text-xs text-ink-mute dark:text-ink-darkMute mb-4">
            Analytical estimate, not a guaranteed outcome.
          </p>
          <TrendChart data={forecast.series} lines={[{ key: "value", color: "#C9972E", name: "Projected index" }]} height={220} />
        </div>
      )}
    </div>
  );
}
