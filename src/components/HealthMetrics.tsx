"use client";

import { type TwinOutputs } from "@/lib/engine";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface HealthMetricsProps {
  outputs: TwinOutputs;
}

function MetricBar({
  label,
  value,
  inverted = false,
}: {
  label: string;
  value: number;
  inverted?: boolean;
}) {
  const displayValue = Math.min(value, 1);
  const animatedValue = useAnimatedNumber(displayValue * 100);

  // For inverted metrics (like debt), higher = worse
  const isGood = inverted ? displayValue < 0.3 : displayValue > 0.6;
  const isBad = inverted ? displayValue > 0.6 : displayValue < 0.3;

  const barColor = isGood
    ? "bg-safe"
    : isBad
      ? "bg-critical"
      : "bg-warning";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs font-bold tabular-nums text-foreground">
          {animatedValue.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  );
}

export default function HealthMetrics({ outputs }: HealthMetricsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Financial Health
      </h2>
      <div className="flex flex-col gap-4">
        <MetricBar
          label="Cash Ratio"
          value={outputs.cash_ratio}
        />
        <MetricBar
          label="Debt-to-Cash"
          value={outputs.debt_to_cash_ratio}
          inverted
        />
        <MetricBar
          label="Burn Sensitivity"
          value={outputs.burn_sensitivity_index}
          inverted
        />
        <MetricBar
          label="Growth Volatility"
          value={outputs.growth_volatility_index}
          inverted
        />
        <MetricBar
          label="Market Dependency"
          value={outputs.market_dependency_index}
          inverted
        />
      </div>
    </div>
  );
}
