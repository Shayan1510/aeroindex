import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Plane, ArrowRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

const LINKS = [
  { to: "/search", label: "Search" },
  { to: "/explore", label: "Explore" },
  { to: "/intelligence/index", label: "Airfare Index" },
  { to: "/intelligence/insights", label: "Insights" },
  { to: "/methodology", label: "Methodology" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`w-full max-w-6xl flex items-center justify-between rounded-full px-4 sm:px-5 py-2.5 border transition-colors ${
          scrolled
            ? "border-border-light dark:border-border-dark bg-white/85 dark:bg-surface-dark2/85 backdrop-blur-md shadow-glassLight dark:shadow-glass"
            : "border-transparent bg-white/40 dark:bg-surface-dark2/30 backdrop-blur-sm"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ink-light dark:bg-ink-dark text-white dark:text-ink-light">
            <Plane size={15} strokeWidth={2} />
          </span>
          <span className="leading-tight">
            <span className="block font-display font-semibold text-sm">AeroIndex</span>
            <span className="hidden sm:block text-[10px] text-ink-mute dark:text-ink-darkMute -mt-0.5">
              India's Airfare Intelligence
            </span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isActive
                    ? "text-ink-light dark:text-ink-dark font-medium"
                    : "text-ink-mute dark:text-ink-darkMute hover:text-ink-light dark:hover:text-ink-dark"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/intelligence" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-xs">
            Open Intelligence <ArrowRight size={13} />
          </Link>
          <ThemeToggle />
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full border border-border-light dark:border-border-dark"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="absolute top-16 left-4 right-4 lg:hidden card p-3 flex flex-col gap-1 shadow-glassLight dark:shadow-glass">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm hover:bg-surface-light2 dark:hover:bg-surface-dark"
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/intelligence"
            onClick={() => setOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-signal dark:text-signal-soft"
          >
            Open Intelligence →
          </Link>
        </div>
      )}
    </header>
  );
}
