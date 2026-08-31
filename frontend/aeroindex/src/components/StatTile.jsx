function ChangeTag({ value, suffix = "%" }) {
  if (value === undefined || value === null) return null;
  const positive = value >= 0;
  return (
    <span className={`figure text-xs ${positive ? "text-good" : "text-bad"}`}>
      {positive ? "\u2191" : "\u2193"} {Math.abs(value)}
      {suffix}
    </span>
  );
}

export default function StatTile({ label, value, change, sub, className = "" }) {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="eyebrow mb-2">{label}</div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="figure text-2xl sm:text-3xl font-semibold">{value}</span>
        <ChangeTag value={change} />
      </div>
      {sub && <div className="text-xs text-ink-mute dark:text-ink-darkMute mt-1">{sub}</div>}
    </div>
  );
}
