import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { searchFlights } from "../services/flightService.js";
import { AIRLINES, AIRPORTS } from "../mock/reference.js";
import FlightCard from "../components/FlightCard.jsx";
import { FlightCardSkeleton, EmptyState } from "../components/States.jsx";

const SORTS = [
  { key: "cheapest", label: "Cheapest" },
  { key: "fastest", label: "Fastest" },
  { key: "best_value", label: "Best Value" },
];

const RATING_ORDER = { very_good: 0, good: 1, average: 2, high: 3, very_high: 4 };

export default function Results() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get("from") ?? "DEL";
  const to = params.get("to") ?? "BOM";
  const depart = params.get("depart") ?? new Date().toISOString().slice(0, 10);

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [sort, setSort] = useState("cheapest");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [stopsFilter, setStopsFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [tracked, setTracked] = useState([]);

  useEffect(() => {
    setLoading(true);
    searchFlights({ from, to, date: depart }).then((res) => {
      setFlights(res.flights);
      setLoading(false);
    });
  }, [from, to, depart]);

  const fromAirport = AIRPORTS.find((a) => a.code === from);
  const toAirport = AIRPORTS.find((a) => a.code === to);

  const visible = useMemo(() => {
    let list = [...flights];
    if (airlineFilter !== "all") list = list.filter((f) => f.airlineCode === airlineFilter);
    if (stopsFilter !== "all") list = list.filter((f) => (stopsFilter === "nonstop" ? f.stops === 0 : f.stops > 0));

    if (sort === "cheapest") list.sort((a, b) => a.fare.total - b.fare.total);
    else if (sort === "fastest") list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    else list.sort((a, b) => RATING_ORDER[a.priceRating] - RATING_ORDER[b.priceRating] || a.fare.total - b.fare.total);

    return list;
  }, [flights, sort, airlineFilter, stopsFilter]);

  function handleTrack(flight) {
    setTracked((t) => (t.includes(flight.id) ? t : [...t, flight.id]));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {fromAirport?.city ?? from} → {toAirport?.city ?? to}
          </h1>
          <p className="figure text-sm text-ink-mute dark:text-ink-darkMute mt-0.5">
            {new Date(depart).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} ·{" "}
            {params.get("passengers") ?? 1} passenger
          </p>
        </div>
        <button onClick={() => navigate("/search")} className="btn-secondary text-xs">
          Modify search
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="lg:hidden btn-secondary text-xs"
        >
          <SlidersHorizontal size={13} /> Filters
        </button>
        <div className="hidden lg:flex items-center gap-1 text-xs">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                sort === s.key
                  ? "bg-ink-light dark:bg-ink-dark text-white dark:text-ink-light"
                  : "text-ink-mute dark:text-ink-darkMute hover:bg-surface-light2 dark:hover:bg-surface-dark"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-ink-mute dark:text-ink-darkMute figure">
          {loading ? "…" : `${visible.length} flights`}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="card p-4 space-y-5 lg:sticky lg:top-28">
            <div className="lg:hidden flex flex-wrap gap-1 text-xs mb-2">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    sort === s.key
                      ? "bg-ink-light dark:bg-ink-dark text-white dark:text-ink-light"
                      : "bg-surface-light2 dark:bg-surface-dark text-ink-mute dark:text-ink-darkMute"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div>
              <div className="eyebrow mb-2">Airline</div>
              <div className="flex flex-col gap-1.5 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="airline" checked={airlineFilter === "all"} onChange={() => setAirlineFilter("all")} />
                  All airlines
                </label>
                {AIRLINES.map((a) => (
                  <label key={a.code} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="airline"
                      checked={airlineFilter === a.code}
                      onChange={() => setAirlineFilter(a.code)}
                    />
                    {a.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="eyebrow mb-2">Stops</div>
              <div className="flex flex-col gap-1.5 text-sm">
                {[
                  { key: "all", label: "Any" },
                  { key: "nonstop", label: "Non-stop" },
                  { key: "1+", label: "1+ stop" },
                ].map((s) => (
                  <label key={s.key} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stops"
                      checked={stopsFilter === s.key}
                      onChange={() => setStopsFilter(s.key)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => <FlightCardSkeleton key={i} />)}

          {!loading && visible.length === 0 && (
            <EmptyState
              title="No flights match your filters"
              description="Try widening your filters or picking a different date."
            />
          )}

          {!loading &&
            visible.map((f) => (
              <FlightCard
                key={f.id}
                flight={f}
                onTrack={handleTrack}
              />
            ))}

          {tracked.length > 0 && (
            <p className="text-xs text-ink-mute dark:text-ink-darkMute text-center figure">
              Tracking {tracked.length} flight{tracked.length > 1 ? "s" : ""} on this route (prototype only).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
