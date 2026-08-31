import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border-light dark:border-border-dark mt-24">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-display font-semibold text-sm">AeroIndex</div>
          <p className="text-xs text-ink-mute dark:text-ink-darkMute mt-1 max-w-sm">
            Prototype built for Smart India Hackathon 2026 — SIH26056. Figures shown are a simulated/prototype
            dataset, not live airline pricing.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-mute dark:text-ink-darkMute">
          <Link to="/methodology" className="hover:text-ink-light dark:hover:text-ink-dark">
            Methodology
          </Link>
          <Link to="/intelligence/reports" className="hover:text-ink-light dark:hover:text-ink-dark">
            Reports
          </Link>
          <Link to="/intelligence/api" className="hover:text-ink-light dark:hover:text-ink-dark">
            API
          </Link>
        </div>
      </div>
    </footer>
  );
}
