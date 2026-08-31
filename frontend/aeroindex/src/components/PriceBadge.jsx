const CONFIG = {
  very_good: { label: "Very Good", dot: "bg-good", text: "text-good" },
  good: { label: "Good", dot: "bg-signal", text: "text-signal dark:text-signal-soft" },
  average: { label: "Average", dot: "bg-brass", text: "text-brass" },
  high: { label: "High", dot: "bg-orange-500", text: "text-orange-500" },
  very_high: { label: "Very High", dot: "bg-bad", text: "text-bad" },
};

export default function PriceBadge({ rating, size = "sm" }) {
  const cfg = CONFIG[rating] ?? CONFIG.average;
  const padding = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";
  return (
    <span className={`pill ${padding} bg-surface-light2 dark:bg-surface-dark ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
