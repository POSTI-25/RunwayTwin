"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatCurrency, cn } from "@/lib/utils";
import type { Scenario, ForecastPoint } from "@/lib/use-simulation";

interface ScenarioForecastProps {
  scenario: Scenario;
  onScenarioChange: (s: Scenario) => void;
  forecast: ForecastPoint[];
  collapseMonth: number | null;
  breakEvenMonth: number | null;
}

const SCENARIOS: { key: Scenario; label: string }[] = [
  { key: "expected", label: "Expected" },
  { key: "best", label: "Best Case" },
  { key: "worst", label: "Worst Case" },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-card-foreground">
        {label}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-xs font-mono"
          style={{ color: entry.color }}
        >
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

// TODO: GSAP smooth chart morph on scenario toggle

export function ScenarioForecast({
  scenario,
  onScenarioChange,
  forecast,
  collapseMonth,
}: ScenarioForecastProps) {
  return (
    <section
      aria-label="Scenario Forecast Engine"
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Scenario Forecast Engine
      </h2>
      <p className="mb-5 text-xs text-muted-foreground">
        12-month cash projection
      </p>

      {/* Scenario toggles */}
      <div className="mb-6 flex gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.key}
            onClick={() => onScenarioChange(s.key)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
              scenario === s.key
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-muted text-muted-foreground hover:text-card-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={forecast}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1a2636"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#6b7a8d", fontSize: 11 }}
              axisLine={{ stroke: "#1a2636" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7a8d", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cash"
              name="Cash"
              stroke="#00e5a0"
              strokeWidth={2}
              fill="url(#cashGradient)"
            />
            {collapseMonth && (
              <ReferenceLine
                x={forecast[collapseMonth - 1]?.label}
                stroke="#ff4d6a"
                strokeDasharray="4 4"
                label={{
                  value: "Collapse",
                  fill: "#ff4d6a",
                  fontSize: 11,
                  position: "top",
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-6">
        {collapseMonth && (
          <span className="flex items-center gap-1.5 text-xs text-destructive">
            <span className="h-0.5 w-4 bg-destructive rounded" />
            Collapse: Month {collapseMonth}
          </span>
        )}
      </div>
    </section>
  );
}
