import { useEffect, useState } from "react";
import { getDataQuality } from "../../services/analyticsService.js";

const STATUS = {
  healthy: { label: "Healthy", dot: "bg-good", text: "text-good" },
  delayed: { label: "Delayed", dot: "bg-brass", text: "text-brass" },
  offline: { label: "Offline", dot: "bg-bad", text: "text-bad" },
};

function timeAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function DataQuality() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDataQuality().then(setData);
  }, []);

  return (
    <div>
      <div className="eyebrow mb-2">Prototype Dataset</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-6">Data Quality &amp; Source Health</h1>

      {data && (
        <>
          <div className="card p-5 mb-6">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="eyebrow">Data Quality Score</span>
            </div>
            <div className="figure text-4xl font-semibold mb-5">{data.score.overall}%</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.score.breakdown.map((b) => (
                <div key={b.label}>
                  <div className="text-xs text-ink-mute dark:text-ink-darkMute mb-1.5">{b.label}</div>
                  <div className="h-1.5 rounded-full bg-surface-light2 dark:bg-surface-dark overflow-hidden">
                    <div
                      className={`h-full rounded-full ${b.invert ? "bg-brass" : "bg-signal"}`}
                      style={{ width: `${b.invert ? Math.min(100, b.value * 6) : b.value}%` }}
                    />
                  </div>
                  <div className="figure text-xs mt-1">{b.value}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="eyebrow mb-3">Source health</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.sources.map((s) => {
              const cfg = STATUS[s.status];
              return (
                <div key={s.name} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">{s.name}</span>
                    <span className={`pill px-2.5 py-1 text-xs bg-surface-light2 dark:bg-surface-dark ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-ink-mute dark:text-ink-darkMute">Last success</div>
                      <div className="figure mt-0.5">{timeAgo(s.lastSuccess)}</div>
                    </div>
                    <div>
                      <div className="text-ink-mute dark:text-ink-darkMute">Observations</div>
                      <div className="figure mt-0.5">{s.observationCount.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <div className="text-ink-mute dark:text-ink-darkMute">Error rate</div>
                      <div className="figure mt-0.5">{s.errorRatePct}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
