import { NavLink, Link } from "react-router-dom";
import {
  LayoutGrid,
  LineChart,
  ListTree,
  ShieldCheck,
  AlertTriangle,
  PieChart,
  ClipboardCheck,
  History,
  FileText,
  Braces,
  ArrowLeft,
} from "lucide-react";

const ITEMS = [
  { to: "/intelligence", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/intelligence/index", label: "Airfare Index", icon: LineChart },
  { to: "/intelligence/routes", label: "Route Basket", icon: ListTree },
  { to: "/intelligence/data-quality", label: "Data Quality", icon: ShieldCheck },
  { to: "/intelligence/insights", label: "Anomalies & Forecast", icon: AlertTriangle },
  { to: "/intelligence/cpi", label: "CPI Impact", icon: PieChart },
  { to: "/intelligence/backtesting", label: "Backtesting", icon: ClipboardCheck },
  { to: "/intelligence/audit", label: "Audit & Revisions", icon: History },
  { to: "/intelligence/reports", label: "Reports", icon: FileText },
  { to: "/intelligence/api", label: "API", icon: Braces },
];

export default function Sidebar({ mobile = false, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      <Link
        to="/"
        className="flex items-center gap-2 text-xs text-ink-mute dark:text-ink-darkMute hover:text-ink-light dark:hover:text-ink-dark mb-4 px-2"
      >
        <ArrowLeft size={13} /> Back to AeroIndex
      </Link>
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-surface-light2 dark:bg-surface-dark font-medium text-ink-light dark:text-ink-dark"
                : "text-ink-mute dark:text-ink-darkMute hover:text-ink-light dark:hover:text-ink-dark hover:bg-surface-light2/60 dark:hover:bg-surface-dark/60"
            }`
          }
        >
          <Icon size={15} strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
