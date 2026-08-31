import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Search } from "lucide-react";
import AirportAutocomplete from "./AirportAutocomplete.jsx";
import GlassCard from "./GlassCard.jsx";

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function SearchPanel({ compact = false }) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("round");
  const [from, setFrom] = useState({ code: "DEL", city: "Delhi" });
  const [to, setTo] = useState({ code: "BOM", city: "Mumbai" });
  const [depart, setDepart] = useState(todayPlus(14));
  const [ret, setRet] = useState(todayPlus(19));
  const [passengers, setPassengers] = useState(1);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams({
      from: from.code,
      to: to.code,
      depart,
      ...(tripType === "round" ? { return: ret } : {}),
      passengers: String(passengers),
      tripType,
    });
    navigate(`/results?${params.toString()}`);
  }

  return (
    <GlassCard className={`p-4 sm:p-6 ${compact ? "" : "shadow-glassLight dark:shadow-glass"}`}>
      <div className="flex items-center gap-4 mb-4 text-sm">
        {["round", "one"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTripType(t)}
            className={`pb-1 border-b-2 transition-colors ${
              tripType === t
                ? "border-ink-light dark:border-ink-dark font-medium"
                : "border-transparent text-ink-mute dark:text-ink-darkMute"
            }`}
          >
            {t === "round" ? "Round Trip" : "One Way"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 items-end">
        <div className="lg:col-span-1 relative">
          <AirportAutocomplete label="From" value={from} onChange={setFrom} placeholder="Delhi" />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap origin and destination"
            className="hidden lg:flex absolute -right-3 top-8 z-10 w-6 h-6 rounded-full bg-ink-light dark:bg-ink-dark text-white dark:text-ink-light items-center justify-center"
          >
            <ArrowLeftRight size={11} />
          </button>
        </div>

        <AirportAutocomplete label="To" value={to} onChange={setTo} placeholder="Mumbai" />

        <div>
          <label className="eyebrow block mb-1.5">Departure</label>
          <input
            type="date"
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-medium border-b border-border-light dark:border-border-dark pb-1.5 figure"
          />
        </div>

        {tripType === "round" ? (
          <div>
            <label className="eyebrow block mb-1.5">Return</label>
            <input
              type="date"
              value={ret}
              onChange={(e) => setRet(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium border-b border-border-light dark:border-border-dark pb-1.5 figure"
            />
          </div>
        ) : (
          <div>
            <label className="eyebrow block mb-1.5">Passengers</label>
            <input
              type="number"
              min={1}
              max={9}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-transparent outline-none text-sm font-medium border-b border-border-light dark:border-border-dark pb-1.5 figure"
            />
          </div>
        )}

        <button type="submit" className="btn-primary w-full h-fit py-3">
          <Search size={15} /> Search Flights
        </button>

        {tripType === "round" && (
          <div className="lg:col-span-5 sm:col-span-2">
            <label className="eyebrow block mb-1.5">Passengers</label>
            <input
              type="number"
              min={1}
              max={9}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-24 bg-transparent outline-none text-sm font-medium border-b border-border-light dark:border-border-dark pb-1.5 figure"
            />
          </div>
        )}
      </form>
    </GlassCard>
  );
}
