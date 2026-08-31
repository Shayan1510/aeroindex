import { useEffect, useState } from "react";
import { getAuditLog } from "../../services/adminService.js";

export default function Audit() {
  const [log, setLog] = useState(null);

  useEffect(() => {
    getAuditLog().then(setLog);
  }, []);

  return (
    <div>
      <div className="eyebrow mb-2">Prototype Dataset</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">Audit &amp; Revision History</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-6 max-w-lg">
        Every revision to a published index value is logged with a reason, affected routes, and reviewer — for
        statistical transparency.
      </p>

      <div className="space-y-3">
        {log?.map((entry) => {
          const up = entry.newValue >= entry.oldValue;
          return (
            <div key={entry.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-baseline gap-3">
                  <span className="figure text-sm text-ink-mute dark:text-ink-darkMute line-through">{entry.oldValue}</span>
                  <span className="figure text-lg font-semibold">{entry.newValue}</span>
                  <span className={`figure text-xs ${up ? "text-good" : "text-bad"}`}>
                    {up ? "↑" : "↓"} {Math.abs(Math.round((entry.newValue - entry.oldValue) * 100) / 100)}
                  </span>
                </div>
                <span className="text-[11px] text-ink-mute dark:text-ink-darkMute figure shrink-0">
                  {entry.version} · {new Date(entry.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="text-sm mb-3">{entry.reason}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-mute dark:text-ink-darkMute">
                <span>Affected: {entry.affectedRoutes.join(", ")}</span>
                <span>·</span>
                <span>Reviewer: {entry.reviewer}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
