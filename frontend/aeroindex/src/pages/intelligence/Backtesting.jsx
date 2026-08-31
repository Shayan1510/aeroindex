import { useEffect, useState } from "react";
import { getBacktest } from "../../services/analyticsService.js";
import TrendChart from "../../components/TrendChart.jsx";
import StatTile from "../../components/StatTile.jsx";
import { TileSkeleton } from "../../components/States.jsx";

export default function Backtesting() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    getBacktest().then(setResult);
  }, []);

  const merged =
    result &&
    result.ourIndex.map((p, i) => ({
      date: p.date,
      ours: p.value,
      dgca: result.dgcaReference[i]?.value,
    }));

  return (
    <div>
      <div className="eyebrow mb-2">Prototype Dataset</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">Model Validation</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-6 max-w-lg">
        Our index compared against the DGCA reference series over a {result?.windowLabel.split(" ")[0] ?? "30-day"} window.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {!result
          ? Array.from({ length: 5 }).map((_, i) => <TileSkeleton key={i} />)
          : (
              <>
                <StatTile label="MAE" value={result.mae} />
                <StatTile label="RMSE" value={result.rmse} />
                <StatTile label="MAPE" value={`${result.mape}%`} />
                <StatTile label="Correlation" value={result.correlation} />
                <StatTile label="Coverage" value={`${result.coveragePct}%`} />
              </>
            )}
      </div>

      {merged && (
        <div className="card p-5">
          <div className="eyebrow mb-4">Our Index vs. DGCA Reference</div>
          <TrendChart
            data={merged}
            lines={[
              { key: "ours", color: "#3D6FE0", name: "Our Index" },
              { key: "dgca", color: "#C9972E", name: "DGCA Reference" },
            ]}
            height={280}
          />
        </div>
      )}
    </div>
  );
}
