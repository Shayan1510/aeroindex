import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTheme } from "../context/ThemeContext.jsx";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <div className="text-ink-mute dark:text-ink-darkMute mb-0.5">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="figure font-medium" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
        </div>
      ))}
    </div>
  );
}

/**
 * @param {{ data: any[], lines: {key:string, color:string, name?:string}[], xKey?: string }} props
 */
export default function TrendChart({ data, lines, xKey = "date", height = 260 }) {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "rgba(242,245,250,0.08)" : "rgba(15,35,64,0.08)";
  const axisColor = theme === "dark" ? "#93A4BF" : "#5B6B84";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: axisColor, fontFamily: "JetBrains Mono" }}
          tickLine={false}
          axisLine={{ stroke: gridColor }}
          minTickGap={32}
        />
        <YAxis
          tick={{ fontSize: 11, fill: axisColor, fontFamily: "JetBrains Mono" }}
          tickLine={false}
          axisLine={false}
          width={44}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name ?? l.key}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
