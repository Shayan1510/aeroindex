import { useEffect, useState } from "react";
import { getAirfareIndex, getIndexDecomposition, getBookingWindowFares, getIndexLevels } from "../../services/indexService.js";
import { ROUTE_BASKET } from "../../mock/routeBasket.js";
import StatTile from "../../components/StatTile.jsx";
import TrendChart from "../../components/TrendChart.jsx";
import { TileSkeleton } from "../../components/States.jsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../../context/ThemeContext.jsx";

const TABS = ["Daily", "Weekly", "Monthly"];

export default function IndexPage() {
  const { theme } = useTheme();
  const [tab, setTab] = useState("Daily");
  const [index, setIndex] = useState(null);
  const [decomposition, setDecomposition] = useState(null);
  const [levels, setLevels] = useState([]);
  const [level, setLevel] = useState("National");
  const [route, setRoute] = useState(ROUTE_BASKET[0].route);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    getAirfareIndex().then(setIndex);
    getIndexDecomposition().then(setDecomposition);
    getIndexLevels().then(setLevels);
  }, []);

  useEffect(() => {
    getBookingWindowFares(route).then(setBooking);
  }, [route]);

  const gridColor = theme === "dark" ? "rgba(242,245,250,0.08)" : "rgba(15,35,64,0.08)";
  const axisColor = theme === "dark" ? "#93A4BF" : "#5B6B84";

  return (
    <div>
      <div className="eyebrow mb-2">Prototype Dataset</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-6">India Airfare Price Index</h1>

      {!index ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <TileSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="figure text-5xl font-semibold">{index.current}</span>
            <span className="figure text-good text-sm">↑ {index.momPct}% MoM</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatTile label="Month over Month" value={`${index.momPct}%`} sub="vs. previous month" />
            <StatTile label="Week over Week" value={`${index.wowPct}%`} sub="vs. previous week" />
            <StatTile label="Year over Year" value={`${index.yoyPct}%`} sub="vs. same period last year" />
          </div>

          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="eyebrow">Trend</div>
              <div className="flex gap-1 text-xs">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 rounded-full ${
                      tab === t
                        ? "bg-ink-light dark:bg-ink-dark text-white dark:text-ink-light"
                        : "text-ink-mute dark:text-ink-darkMute hover:bg-surface-light2 dark:hover:bg-surface-dark"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <TrendChart data={index.series} lines={[{ key: "value", color: "#3D6FE0", name: "Index" }]} />
          </div>
        </>
      )}

      <div className="card p-5 mb-6">
        <div className="eyebrow mb-3">Drilldown</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`pill px-3 py-1.5 text-xs ${
                level === l
                  ? "bg-ink-light dark:bg-ink-dark text-white dark:text-ink-light"
                  : "bg-surface-light2 dark:bg-surface-dark text-ink-mute dark:text-ink-darkMute"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-mute dark:text-ink-darkMute">
          Showing the index at <span className="font-medium text-ink-light dark:text-ink-dark">{level}</span> granularity.
          Route and airline-level drilldowns share the same underlying pipeline as the national figure.
        </p>
      </div>

      {decomposition && (
        <div className="card p-5 mb-6">
          <div className="eyebrow mb-1">Why did the index change?</div>
          <p className="text-xs text-ink-mute dark:text-ink-darkMute mb-4">Contribution to the +{index?.momPct}% MoM move, by route.</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={decomposition} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: axisColor, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="route" width={130} tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="glass rounded-lg px-3 py-2 text-xs figure">+{payload[0].value} pp</div>
                  ) : null
                }
              />
              <Bar dataKey="contributionPp" fill="#C9972E" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="eyebrow">Advance booking window</div>
          <select
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="text-xs bg-surface-light2 dark:bg-surface-dark rounded-full px-3 py-1.5 outline-none"
          >
            {ROUTE_BASKET.filter((r) => r.status !== "retired").map((r) => (
              <option key={r.route} value={r.route}>{r.route}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-ink-mute dark:text-ink-darkMute mb-4">
          Representative fare by days-before-departure, for {route}.
        </p>
        {booking && (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={booking.data}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="window" tick={{ fontSize: 11, fill: axisColor, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={44} />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="glass rounded-lg px-3 py-2 text-xs">
                      <div className="text-ink-mute dark:text-ink-darkMute">{label}</div>
                      <div className="figure font-medium">₹{payload[0].value.toLocaleString("en-IN")}</div>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="fare" fill="#3D6FE0" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
