import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { getCpiImpact } from "../../services/analyticsService.js";
import { getAirfareIndex as getIndex } from "../../services/indexService.js";

export default function Cpi() {
  const [cpi, setCpi] = useState(null);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    getCpiImpact().then(setCpi);
    getIndex().then(setIndex);
  }, []);

  return (
    <div>
      <div className="eyebrow mb-2">Prototype Dataset</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-6">CPI Intelligence</h1>

      <div className="card p-6 flex flex-col items-center text-center gap-4 mb-6">
        <div>
          <div className="eyebrow mb-1">Airfare Index</div>
          <div className="figure text-3xl font-semibold">{index?.current ?? "—"}</div>
        </div>
        <ArrowDown size={16} className="text-ink-mute dark:text-ink-darkMute" />
        <div>
          <div className="eyebrow mb-1">Relevant CPI component</div>
          <div className="text-sm">Transport &amp; Communication</div>
        </div>
        <ArrowDown size={16} className="text-ink-mute dark:text-ink-darkMute" />
        <div>
          <div className="eyebrow mb-1">Estimated contribution</div>
          <div className="figure text-3xl font-semibold text-signal dark:text-signal-soft">
            +{cpi?.estimatedContributionPp ?? "—"} pp
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="eyebrow mb-2">Methodology note</div>
        <p className="text-sm text-ink-mute dark:text-ink-darkMute">{cpi?.note}</p>
      </div>
    </div>
  );
}
