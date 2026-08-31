import { useState } from "react";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";

const REPORTS = [
  { id: "monthly", title: "Monthly Report", desc: "National and route-level index summary for the month." },
  { id: "weekly", title: "Weekly Report", desc: "Short-form index movement and anomaly summary." },
  { id: "route", title: "Route Report", desc: "Deep dive on a single route's fare and index behaviour." },
  { id: "data-quality", title: "Data Quality Report", desc: "Source health, coverage and validation summary." },
  { id: "backtest", title: "Backtest Report", desc: "Validation results against the DGCA reference series." },
];

function mockDownload(name, ext) {
  const blob = new Blob([`AeroIndex — ${name}\nPrototype export. Real report generation will be wired to the backend.`], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [generating, setGenerating] = useState(null);

  return (
    <div>
      <div className="eyebrow mb-2">Prototype Dataset</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">Reports</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-6 max-w-lg">
        Export a snapshot of index and data-quality figures. Exports are stubbed for this prototype.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="font-medium text-sm mb-1">{r.title}</div>
            <p className="text-xs text-ink-mute dark:text-ink-darkMute mb-4">{r.desc}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => mockDownload(r.title, "csv")} className="btn-secondary !py-1.5 !px-3 text-xs">
                <FileDown size={13} /> CSV
              </button>
              <button onClick={() => mockDownload(r.title, "xlsx")} className="btn-secondary !py-1.5 !px-3 text-xs">
                <FileSpreadsheet size={13} /> Excel
              </button>
              <button
                onClick={() => {
                  setGenerating(r.id);
                  setTimeout(() => {
                    mockDownload(r.title, "pdf");
                    setGenerating(null);
                  }, 700);
                }}
                className="btn-secondary !py-1.5 !px-3 text-xs"
              >
                <FileText size={13} /> {generating === r.id ? "Generating…" : "PDF"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
