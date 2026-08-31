import { Link } from "react-router-dom";
import { AIRLINES } from "../mock/reference.js";
import PriceBadge from "./PriceBadge.jsx";

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function fmtDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function fmtAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}

export default function FlightCard({ flight, onTrack }) {
  const airline = AIRLINES.find((a) => a.code === flight.airlineCode);

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-light2 dark:bg-surface-dark flex items-center justify-center font-display font-semibold text-sm">
            {flight.airlineCode}
          </div>
          <div>
            <div className="text-sm font-medium">{airline?.name ?? flight.airlineCode}</div>
            <div className="figure text-xs text-ink-mute dark:text-ink-darkMute">{flight.flightNumber}</div>
          </div>
        </div>
        <PriceBadge rating={flight.priceRating} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-left">
          <div className="figure text-lg font-semibold">{fmtTime(flight.departTime)}</div>
          <div className="text-xs text-ink-mute dark:text-ink-darkMute">{flight.from}</div>
        </div>
        <div className="flex-1 flex flex-col items-center px-2">
          <div className="text-xs text-ink-mute dark:text-ink-darkMute mb-1 figure">
            {fmtDuration(flight.durationMinutes)}
          </div>
          <div className="w-full h-px bg-border-light dark:bg-border-dark relative">
            <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-ink-mute dark:bg-ink-darkMute" />
          </div>
          <div className="text-[11px] text-ink-mute dark:text-ink-darkMute mt-1">
            {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
          </div>
        </div>
        <div className="text-right">
          <div className="figure text-lg font-semibold">{fmtTime(flight.arriveTime)}</div>
          <div className="text-xs text-ink-mute dark:text-ink-darkMute">{flight.to}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-light dark:border-border-dark">
        <div>
          <div className="figure text-xl font-semibold">₹{flight.fare.total.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-ink-mute dark:text-ink-darkMute">
            {flight.cabin} · {flight.baggage}
          </div>
          <div className="text-[11px] text-ink-mute dark:text-ink-darkMute">
            {flight.source} · updated {fmtAgo(flight.lastUpdated)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onTrack?.(flight)} className="btn-secondary !py-2 !px-3.5 text-xs">
            Track Price
          </button>
          <Link to={`/flight/${flight.id}`} className="btn-primary !py-2 !px-3.5 text-xs">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
