import { useState } from "react";
import { Copy, Check } from "lucide-react";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/index",
    desc: "Latest national airfare index value.",
    sample: `{
  "value": 127.4,
  "mom_pct": 4.8,
  "wow_pct": -1.2,
  "yoy_pct": 9.2,
  "as_of": "2026-08-30"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/index/daily",
    desc: "Daily index time series.",
    sample: `[
  { "date": "2026-08-28", "value": 126.9 },
  { "date": "2026-08-29", "value": 127.1 },
  { "date": "2026-08-30", "value": 127.4 }
]`,
  },
  {
    method: "GET",
    path: "/api/v1/routes",
    desc: "Representative route basket and weights.",
    sample: `[
  { "route": "DEL-BOM", "weight_pct": 18.2, "status": "active" }
]`,
  },
  {
    method: "GET",
    path: "/api/v1/fares",
    desc: "Recent fare observations for a route.",
    sample: `{ "route": "DEL-BOM", "count": 214, "observations": [ "..." ] }`,
  },
  {
    method: "GET",
    path: "/api/v1/data-quality",
    desc: "Current data quality score and breakdown.",
    sample: `{ "overall": 96.4, "coverage": 97.8, "freshness": 98.6 }`,
  },
  {
    method: "GET",
    path: "/api/v1/cpi-impact",
    desc: "Estimated analytical CPI contribution.",
    sample: `{ "estimated_contribution_pp": 0.14 }`,
  },
];

function EndpointCard({ ep }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="pill px-2 py-0.5 text-[11px] bg-good/10 text-good font-medium">{ep.method}</span>
        <span className="figure text-sm font-medium">{ep.path}</span>
      </div>
      <p className="text-xs text-ink-mute dark:text-ink-darkMute mb-3">{ep.desc}</p>
      <div className="relative">
        <pre className="figure text-[11px] bg-surface-light2 dark:bg-surface-dark rounded-lg p-3 overflow-x-auto">{ep.sample}</pre>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(ep.sample);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-md bg-surface-light dark:bg-surface-dark2 border border-border-light dark:border-border-dark"
          aria-label="Copy sample response"
        >
          {copied ? <Check size={12} className="text-good" /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}

export default function ApiPortal() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="pill px-2.5 py-1 text-xs bg-good/10 text-good">
          <span className="w-1.5 h-1.5 rounded-full bg-good" /> Operational
        </span>
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">API</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-6 max-w-lg">
        A frontend representation of the planned REST API. Sample responses shown below — not live yet.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ENDPOINTS.map((ep) => (
          <EndpointCard key={ep.path} ep={ep} />
        ))}
      </div>
    </div>
  );
}
