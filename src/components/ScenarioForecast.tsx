"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  type StartupInputs,
  type ScenarioType,
  type TwinOutputs,
  computeTwin,
  formatCurrency,
} from "@/lib/engine";
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

interface ScenarioForecastProps {
  inputs: StartupInputs;
  activeScenario: ScenarioType;
  onScenarioChange: (s: ScenarioType) => void;
}

const SCENARIO_CONFIG: Record<
  ScenarioType,
  { label: string; color: string; fill: string }
> = {
  expected: { label: "Expected", color: "#06d6a0", fill: "rgba(6, 214, 160, 0.15)" },
  best: { label: "Best Case", color: "#3b82f6", fill: "rgba(59, 130, 246, 0.15)" },
  worst: { label: "Worst Case", color: "#ef4444", fill: "rgba(239, 68, 68, 0.15)" },
};

export default function ScenarioForecast({
  inputs,
  activeScenario,
  onScenarioChange,
}: ScenarioForecastProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [allScenarios, setAllScenarios] = useState<
    Record<ScenarioType, TwinOutputs>
  >({
    expected: computeTwin(inputs, "expected"),
    best: computeTwin(inputs, "best"),
    worst: computeTwin(inputs, "worst"),
  });

  useEffect(() => {
    setAllScenarios({
      expected: computeTwin(inputs, "expected"),
      best: computeTwin(inputs, "best"),
      worst: computeTwin(inputs, "worst"),
    });
  }, [inputs]);

  // GSAP morph on scenario change
  useEffect(() => {
    if (!chartRef.current) return;
    gsap.fromTo(
      chartRef.current,
      { opacity: 0.3, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    );
  }, [activeScenario]);

  const active = allScenarios[activeScenario];
  const config = SCENARIO_CONFIG[activeScenario];

  // Build chart data
  const chartData = active.cash_trajectory.map((cash, i) => ({
    month: `M${i + 1}`,
    cash,
    revenue: active.revenue_trajectory[i],
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Scenario Forecast
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            12-month cash trajectory
          </p>
        </div>

        {/* Scenario toggles */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["expected", "best", "worst"] as ScenarioType[]).map((s) => (
            <button
              key={s}
              onClick={() => onScenarioChange(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeScenario === s
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {SCENARIO_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0c1220",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e2e8f0",
              }}
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === "cash" ? "Cash" : "Revenue",
              ]}
            />

            {/* Zero line */}
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />

            {/* Bankruptcy marker */}
            {active.bankruptcy_month && (
              <ReferenceLine
                x={`M${active.bankruptcy_month}`}
                stroke="#ef4444"
                strokeWidth={2}
                label={{
                  value: "CASH OUT",
                  position: "top",
                  fill: "#ef4444",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              />
            )}

            {/* Break-even marker */}
            {active.break_even_month && (
              <ReferenceLine
                x={`M${active.break_even_month}`}
                stroke="#06d6a0"
                strokeWidth={2}
                label={{
                  value: "BREAK EVEN",
                  position: "top",
                  fill: "#06d6a0",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="cash"
              stroke={config.color}
              strokeWidth={2}
              fill="url(#cashGradient)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario comparison mini cards */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {(["expected", "best", "worst"] as ScenarioType[]).map((s) => {
          const sc = allScenarios[s];
          const cfg = SCENARIO_CONFIG[s];
          return (
            <div
              key={s}
              className={`rounded-lg border p-3 ${
                activeScenario === s
                  ? "border-accent/30 bg-muted"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {cfg.label}
                </span>
              </div>
              <div className="font-mono text-sm font-bold tabular-nums text-foreground">
                {sc.runway_months >= 99
                  ? "Infinite"
                  : `${sc.runway_months.toFixed(1)}mo`}
              </div>
              <div className="text-[10px] text-muted-foreground">
                Burn: {formatCurrency(sc.burn_rate)}/mo
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
