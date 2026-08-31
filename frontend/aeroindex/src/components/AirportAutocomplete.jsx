import { useEffect, useRef, useState } from "react";
import { searchAirports } from "../services/flightService.js";
import { MapPin } from "lucide-react";

export default function AirportAutocomplete({ label, value, onChange, placeholder }) {
  const [query, setQuery] = useState(value?.city ?? "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    let active = true;
    searchAirports(query).then((res) => {
      if (active) setResults(res);
    });
    return () => {
      active = false;
    };
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={wrapRef}>
      <label className="eyebrow block mb-1.5">{label}</label>
      <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-1.5">
        <MapPin size={14} className="text-ink-mute dark:text-ink-darkMute shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-ink-mute dark:placeholder:text-ink-darkMute placeholder:font-normal"
          aria-label={label}
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-64 max-w-[80vw] card shadow-glassLight dark:shadow-glass overflow-hidden py-1">
          {results.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-surface-light2 dark:hover:bg-surface-dark transition-colors"
                onClick={() => {
                  onChange(a);
                  setQuery(a.city);
                  setOpen(false);
                }}
              >
                <div className="text-sm font-medium">
                  {a.city} <span className="figure text-ink-mute dark:text-ink-darkMute">{a.code}</span>
                </div>
                <div className="text-xs text-ink-mute dark:text-ink-darkMute">{a.name}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
