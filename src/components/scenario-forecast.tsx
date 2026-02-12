"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
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
import type { Scenario } from "@/lib/simulation";
import type { ProjectionPoint } from "@/lib/simulation";

interface ScenarioForecastProps {
  projection: ProjectionPoint[];
  scenario: Scenario;
  breakEvenMonth: number | null;
  onScenarioChange: (scenario: Scenario) => void;
}

const SCENARIOS: { key: Scenario; label: string; desc: string }[] = [
  { key: "expected", label: "Expected", desc: "Base trajectory" },
  { key: "best", label: "Best Case", desc: "+15% growth" },
  { key: "worst", label: "Worst Case", desc: "-15% growth" },
];

export default function ScenarioForecast({
  projection,
  scenario,
  breakEvenMonth,
  onScenarioChange,
}: ScenarioForecastProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    gsap.fromTo(
      chartRef.current,
      { opacity: 0.3, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [scenario]);

  const collapseMonth = projection.findIndex((p) => p.cash <= 0);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold text-foreground">
          Scenario Forecast Engine
        </h3>
        <p className="text-sm text-muted-foreground">
          12-month cash trajectory projection
        </p>
      </div>

      {/* Scenario toggles */}
      <div className="flex gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.key}
            onClick={() => onScenarioChange(s.key)}
            className={`flex flex-col rounded-xl border px-4 py-2.5 text-left transition-all ${
              scenario === s.key
                ? "border-accent/50 bg-accent/10 text-accent glow-accent"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
            }`}
          >
            <span className="text-sm font-semibold">{s.label}</span>
            <span className="text-[10px] opacity-70">{s.desc}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div ref={chartRef} className="rounded-2xl border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={projection}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a1128",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                color: "#e5e7eb",
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name,
              ]}
            />
            <Area
              type="monotone"
              dataKey="cash"
              name="Cash"
              stroke="#00e5ff"
              strokeWidth={2}
              fill="url(#cashGrad)"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueGrad)"
            />
            {breakEvenMonth && breakEvenMonth <= 12 && (
              <ReferenceLine
                x={`M${breakEvenMonth}`}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: "Break-even",
                  fill: "#10b981",
                  fontSize: 10,
                  position: "top",
                }}
              />
            )}
            {collapseMonth > 0 && (
              <ReferenceLine
                x={projection[collapseMonth]?.label}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: "Collapse",
                  fill: "#ef4444",
                  fontSize: 10,
                  position: "top",
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
