import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import ThemeToggle from "../../components/ThemeToggle.jsx";

export default function IntelligenceLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-base-light/90 dark:bg-base-dark/90 backdrop-blur-md">
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm font-medium">
          <Menu size={17} /> Intelligence
        </button>
        <ThemeToggle />
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-base-light dark:bg-base-dark p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setOpen(false)} className="mb-4 flex items-center gap-2 text-sm">
              <X size={16} /> Close
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-20 lg:pt-8 pb-20 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-8 flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-medium text-ink-mute dark:text-ink-darkMute">Analyst view</span>
            <ThemeToggle />
          </div>
          <div className="sticky top-16">
            <Sidebar />
          </div>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
