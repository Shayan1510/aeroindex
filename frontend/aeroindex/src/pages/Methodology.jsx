const STEPS = [
  { title: "Data collection", desc: "Automated collection from airline-direct sources and OTA aggregators across representative routes and booking windows." },
  { title: "Normalization", desc: "Fares are normalized to a common structure — base fare, taxes, and other charges — across sources with different display formats." },
  { title: "Validation", desc: "Observations are checked for duplicates, missing fields, and statistical outliers before being accepted into the index." },
  { title: "Route aggregation", desc: "Validated fares are aggregated per route, per booking window, into a representative daily fare." },
  { title: "Weighting", desc: "Routes are combined using weights from the representative route basket, reflecting each route's relative travel volume." },
  { title: "Airfare index", desc: "The weighted, aggregated fares produce the national and route-level airfare index values." },
  { title: "CPI analysis", desc: "The index's movement is translated into an estimated contribution to the relevant CPI component." },
];

export default function Methodology() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
      <div className="eyebrow mb-2">Methodology</div>
      <h1 className="font-display text-3xl font-semibold mb-4">How the index is built</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-10 max-w-xl">
        AeroIndex is a prototype built for SIH26056. This page explains the pipeline conceptually — the current
        build uses a mock/prototype dataset in place of live scraping and a production statistics engine.
      </p>

      <div className="space-y-0">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="figure w-8 h-8 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-xs shrink-0">
                {i + 1}
              </div>
              {i < STEPS.length - 1 && <div className="w-px flex-1 bg-border-light dark:bg-border-dark my-1" />}
            </div>
            <div className="pb-8">
              <div className="font-medium text-sm mb-1">{s.title}</div>
              <p className="text-sm text-ink-mute dark:text-ink-darkMute max-w-lg">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5 mt-4">
        <div className="eyebrow mb-2">Scope and limitations</div>
        <ul className="text-sm text-ink-mute dark:text-ink-darkMute space-y-1.5 list-disc list-inside">
          <li>Current fare and index data is a simulated prototype dataset, not live airline pricing.</li>
          <li>Source coverage is limited to a small representative sample of airlines and OTAs for this prototype.</li>
          <li>CPI contribution figures are estimated and analytical — not official MoSPI CPI values.</li>
          <li>Route basket weights are illustrative and would need to be finalized with domain experts before production use.</li>
        </ul>
      </div>
    </div>
  );
}
