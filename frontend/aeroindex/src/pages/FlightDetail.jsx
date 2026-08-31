import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFlightDetails, getPriceHistory } from "../services/flightService.js";
import { AIRLINES } from "../mock/reference.js";
import PriceBadge from "../components/PriceBadge.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { EmptyState } from "../components/States.jsx";

const RATING_COPY = {
  very_good: "well below the historical average — a strong time to book.",
  good: "below the historical average for this route.",
  average: "in line with the historical average for this route.",
  high: "above the historical average — you may want to wait or compare dates.",
  very_high: "well above the historical average for this route.",
};

export default function FlightDetail() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFlightDetails(id).then((f) => {
      setFlight(f);
      getPriceHistory(`${f.from}-${f.to}`).then((h) => {
        setHistory(h);
        setLoading(false);
      });
    });
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 pt-32 pb-20 text-sm text-ink-mute dark:text-ink-darkMute">Loading flight…</div>;
  }

  if (!flight) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <EmptyState title="Flight not found" description="This flight may no longer be available." />
      </div>
    );
  }

  const airline = AIRLINES.find((a) => a.code === flight.airlineCode);
  const diffPct = history ? Math.round(((flight.fare.total - history.stats.average) / history.stats.average) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
      <Link to="/results" className="text-xs text-ink-mute dark:text-ink-darkMute hover:text-ink-light dark:hover:text-ink-dark">
        ← Back to results
      </Link>

      <div className="card p-5 sm:p-6 mt-4">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-surface-light2 dark:bg-surface-dark flex items-center justify-center font-display font-semibold">
              {flight.airlineCode}
            </div>
            <div>
              <div className="font-medium">{airline?.name ?? flight.airlineCode}</div>
              <div className="figure text-xs text-ink-mute dark:text-ink-darkMute">{flight.flightNumber}</div>
            </div>
          </div>
          <PriceBadge rating={flight.priceRating} size="lg" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <div className="eyebrow mb-1">Departure</div>
            <div className="figure font-medium">
              {new Date(flight.departTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}
            </div>
            <div className="text-xs text-ink-mute dark:text-ink-darkMute">{flight.from}</div>
          </div>
          <div>
            <div className="eyebrow mb-1">Arrival</div>
            <div className="figure font-medium">
              {new Date(flight.arriveTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}
            </div>
            <div className="text-xs text-ink-mute dark:text-ink-darkMute">{flight.to}</div>
          </div>
          <div>
            <div className="eyebrow mb-1">Cabin</div>
            <div className="text-sm">{flight.cabin}</div>
          </div>
          <div>
            <div className="eyebrow mb-1">Baggage</div>
            <div className="text-sm">{flight.baggage}</div>
          </div>
        </div>

        <div className="border-t border-border-light dark:border-border-dark pt-4">
          <div className="eyebrow mb-2">Fare breakdown</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-ink-mute dark:text-ink-darkMute">Base fare</span><span className="figure">₹{flight.fare.base.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-ink-mute dark:text-ink-darkMute">Taxes</span><span className="figure">₹{flight.fare.taxes.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-ink-mute dark:text-ink-darkMute">Other charges</span><span className="figure">₹{flight.fare.fees.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border-light dark:border-border-dark">
              <span>Total</span><span className="figure">₹{flight.fare.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-ink-mute dark:text-ink-darkMute mt-4">
          Source: {flight.source} · Last updated {new Date(flight.lastUpdated).toLocaleTimeString("en-IN")} · Prototype observation
        </div>
      </div>

      {history && (
        <div className="card p-5 sm:p-6 mt-4">
          <div className="eyebrow mb-1">Is this a good price?</div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="figure text-3xl font-semibold">₹{flight.fare.total.toLocaleString("en-IN")}</span>
            <PriceBadge rating={flight.priceRating} />
          </div>
          <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-5">
            This fare is <span className="figure font-medium text-ink-light dark:text-ink-dark">{Math.abs(diffPct)}%</span>{" "}
            {diffPct <= 0 ? "below" : "above"} the historical average — {RATING_COPY[flight.priceRating]}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Current", value: history.stats.current },
              { label: "Average", value: history.stats.average },
              { label: "Lowest", value: history.stats.lowest },
              { label: "Highest", value: history.stats.highest },
            ].map((s) => (
              <div key={s.label} className="card p-3">
                <div className="eyebrow mb-1">{s.label}</div>
                <div className="figure text-sm font-medium">₹{s.value.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>

          <div className="eyebrow mb-2">60-day price history</div>
          <TrendChart
            data={history.history}
            lines={[{ key: "price", color: "#3D6FE0", name: "Price" }]}
          />
        </div>
      )}
    </div>
  );
}
