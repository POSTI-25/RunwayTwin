"use client";

import { AlertTriangle, TrendingUp, Users, Megaphone } from "lucide-react";
import type { SimulationState, SimulationMetrics } from "@/lib/simulation";

interface SensitivityPanelProps {
  state: SimulationState;
  metrics: SimulationMetrics;
}

interface RiskDriver {
  label: string;
  impact: string;
  severity: number;
  icon: React.ReactNode;
}

export default function SensitivityPanel({
  state,
  metrics,
}: SensitivityPanelProps) {
  // Compute sensitivity — how much each lever changes runway
  const totalExpenses = state.fixedCosts + state.variableCosts;
  const baseBurn = totalExpenses - state.revenue;

  const hireBurn = baseBurn + 5000;
  const hireRunway = hireBurn > 0 ? state.cash / hireBurn : 999;
  const hireDelta = metrics.runwayMonths - hireRunway;

  const marketBurn = baseBurn + 2000;
  const marketRunway = marketBurn > 0 ? state.cash / marketBurn : 999;
  const marketDelta = metrics.runwayMonths - marketRunway;

  const growthBurn = totalExpenses - state.revenue * 1.1;
  const growthRunway = growthBurn > 0 ? state.cash / growthBurn : 999;
  const growthDelta = growthRunway - metrics.runwayMonths;

  const risks: RiskDriver[] = [
    {
      label: "Hiring",
      impact: `Reduces runway by ${hireDelta.toFixed(1)} months per hire`,
      severity: Math.min(100, (hireDelta / metrics.runwayMonths) * 100),
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Marketing Spend",
      impact: `Accelerates collapse by ${marketDelta.toFixed(1)} months`,
      severity: Math.min(100, (marketDelta / metrics.runwayMonths) * 100),
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      label: "Revenue Growth",
      impact: `+10% growth extends runway by ${Math.max(0, growthDelta).toFixed(1)} months`,
      severity: Math.min(
        100,
        (Math.max(0, growthDelta) / metrics.runwayMonths) * 100
      ),
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ].sort((a, b) => b.severity - a.severity);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Survival Sensitivity
          </h3>
          <p className="text-sm text-muted-foreground">
            Top risk drivers for your digital twin
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {risks.map((risk, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                {risk.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {risk.label}
                </p>
                <p className="text-xs text-muted-foreground">{risk.impact}</p>
              </div>
              <span
                className={`rounded-lg px-2 py-1 text-xs font-bold ${
                  risk.severity > 50
                    ? "bg-destructive/10 text-destructive"
                    : risk.severity > 25
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success"
                }`}
              >
                {risk.severity.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  risk.severity > 50
                    ? "bg-destructive"
                    : risk.severity > 25
                      ? "bg-warning"
                      : "bg-success"
                }`}
                style={{ width: `${risk.severity}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
