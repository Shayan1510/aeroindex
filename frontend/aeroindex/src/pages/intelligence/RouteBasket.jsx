import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getRouteBasket } from "../../services/adminService.js";

const STATUS_STYLE = {
  active: "text-good bg-good/10",
  under_review: "text-brass bg-brass/10",
  retired: "text-ink-mute dark:text-ink-darkMute bg-surface-light2 dark:bg-surface-dark",
};

export default function RouteBasket() {
  const [routes, setRoutes] = useState(null);

  useEffect(() => {
    getRouteBasket().then(setRoutes);
  }, []);

  const totalWeight = routes?.filter((r) => r.status === "active").reduce((sum, r) => sum + r.weightPct, 0) ?? 0;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <div className="eyebrow mb-2">Prototype Dataset</div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">Representative Route Basket</h1>
        </div>
        <button className="btn-primary text-xs shrink-0">
          <Plus size={14} /> Add route
        </button>
      </div>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-6 max-w-lg">
        Routes and weights used to construct the national index. Active weights currently sum to{" "}
        <span className="figure font-medium text-ink-light dark:text-ink-dark">{totalWeight.toFixed(1)}%</span>.
      </p>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left border-b border-border-light dark:border-border-dark">
              <th className="eyebrow font-normal px-4 py-3">Route</th>
              <th className="eyebrow font-normal px-4 py-3">Weight</th>
              <th className="eyebrow font-normal px-4 py-3">Status</th>
              <th className="eyebrow font-normal px-4 py-3">Effective</th>
              <th className="eyebrow font-normal px-4 py-3">Version</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {routes?.map((r) => (
              <tr key={r.route} className="border-b border-border-light dark:border-border-dark last:border-0">
                <td className="figure px-4 py-3 font-medium">{r.route}</td>
                <td className="figure px-4 py-3">{r.weightPct}%</td>
                <td className="px-4 py-3">
                  <span className={`pill px-2.5 py-1 text-xs ${STATUS_STYLE[r.status]}`}>
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td className="figure px-4 py-3 text-ink-mute dark:text-ink-darkMute">{r.effectiveDate}</td>
                <td className="figure px-4 py-3 text-ink-mute dark:text-ink-darkMute">{r.version}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button aria-label={`Edit ${r.route}`} className="text-ink-mute dark:text-ink-darkMute hover:text-ink-light dark:hover:text-ink-dark">
                      <Pencil size={14} />
                    </button>
                    <button aria-label={`Remove ${r.route}`} className="text-ink-mute dark:text-ink-darkMute hover:text-bad">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
