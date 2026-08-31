import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AIRPORTS, CITY_ROUTES } from "../mock/reference.js";
import { seededRandom, randRange } from "../lib/prng.js";

function routeStat(from, to) {
  const rng = seededRandom(`${from}-${to}`);
  return {
    avgFare: Math.round(randRange(rng, 3800, 8200)),
    change: Math.round(randRange(rng, -8, 12) * 10) / 10,
  };
}

export default function Explore() {
  const [selected, setSelected] = useState("DEL");
  const destinations = CITY_ROUTES[selected] ?? [];
  const originAirport = AIRPORTS.find((a) => a.code === selected);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
      <h1 className="font-display text-3xl font-semibold mb-2">Explore India</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-8 max-w-lg">
        Pick a city to see its most-searched routes and how fares have moved recently. Prototype dataset.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {Object.keys(CITY_ROUTES).map((code) => {
          const a = AIRPORTS.find((x) => x.code === code);
          return (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className={`pill px-3.5 py-1.5 text-sm ${
                selected === code
                  ? "bg-ink-light dark:bg-ink-dark text-white dark:text-ink-light"
                  : "bg-surface-light2 dark:bg-surface-dark text-ink-mute dark:text-ink-darkMute"
              }`}
            >
              {a?.city}
            </button>
          );
        })}
      </div>

      <div className="eyebrow mb-3">Popular destinations from {originAirport?.city}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((code) => {
          const dest = AIRPORTS.find((a) => a.code === code);
          const stat = routeStat(selected, code);
          const up = stat.change >= 0;
          return (
            <Link
              key={code}
              to={`/results?from=${selected}&to=${code}&depart=${new Date(Date.now() + 12096e5).toISOString().slice(0, 10)}`}
              className="card p-4 hover:border-signal/40 dark:hover:border-signal-soft/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">{dest?.city}</div>
                <span className={`figure text-xs flex items-center gap-1 ${up ? "text-bad" : "text-good"}`}>
                  {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(stat.change)}%
                </span>
              </div>
              <div className="figure text-lg font-semibold">₹{stat.avgFare.toLocaleString("en-IN")}</div>
              <div className="text-[11px] text-ink-mute dark:text-ink-darkMute mt-1">avg. fare, last 30 days</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
