import { Link } from "react-router-dom";
import { TrendingUp, Plane, ShieldCheck, LineChart } from "lucide-react";
import SearchPanel from "../components/SearchPanel.jsx";
import GlassCard from "../components/GlassCard.jsx";

export default function Landing() {
  return (
    <div>
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 pt-28 pb-16 overflow-hidden">
        {/* Cinematic sky background */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2400&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/55 to-base-light dark:from-[#08111F]/90 dark:via-[#08111F]/70 dark:to-base-dark" />
        </div>

        <div className="eyebrow mb-5">Smart India Hackathon • SIH26056</div>

        <h1 className="font-display text-center text-[2.6rem] sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight max-w-4xl">
          Know the price.
          <br />
          Track the trend.
        </h1>

        <p className="text-center text-ink-mute dark:text-ink-darkMute max-w-md mt-5 text-[15px]">
          India's intelligent airfare platform for searching, tracking and understanding flight prices.
        </p>

        <div className="w-full max-w-4xl mt-10">
          <SearchPanel />
        </div>

        <p className="eyebrow mt-6">Search • Compare • Track • Understand</p>

        {/* Floating index card */}
        <GlassCard className="hidden md:block absolute right-6 lg:right-16 top-40 p-4 w-52 rotate-[-2deg]">
          <div className="eyebrow mb-1.5">India Airfare Index</div>
          <div className="figure text-3xl font-semibold">127.4</div>
          <div className="figure text-xs text-good flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> +4.8%
          </div>
        </GlassCard>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Plane, title: "Real fare context", desc: "Every fare is scored against its historical range, not shown in isolation." },
          { icon: LineChart, title: "National index", desc: "A statistically weighted index tracks how Indian airfares move over time." },
          { icon: ShieldCheck, title: "Built for MoSPI", desc: "Designed to augment the Consumer Price Index with transparent methodology." },
        ].map((f) => (
          <div key={f.title} className="card p-5">
            <f.icon size={18} className="mb-3 text-signal dark:text-signal-soft" strokeWidth={1.75} />
            <div className="text-sm font-medium mb-1">{f.title}</div>
            <p className="text-xs text-ink-mute dark:text-ink-darkMute leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20 text-center">
        <Link to="/intelligence" className="btn-secondary">
          Explore the full Airfare Intelligence platform →
        </Link>
      </section>
    </div>
  );
}
