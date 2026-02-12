"use client";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import {
  type TwinOutputs,
  formatCurrency,
  getStatusLevel,
} from "@/lib/engine";

interface TwinVitalsProps {
  outputs: TwinOutputs;
}

function VitalCard({
  label,
  value,
  subtitle,
  status,
}: {
  label: string;
  value: string;
  subtitle?: string;
  status?: "safe" | "warning" | "critical";
}) {
  const statusColor =
    status === "critical"
      ? "border-critical/40 glow-critical"
      : status === "warning"
        ? "border-warning/40 glow-warning"
        : "border-accent/20 glow-accent";

  const textColor =
    status === "critical"
      ? "text-critical"
      : status === "warning"
        ? "text-warning"
        : "text-accent";

  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border bg-card p-4 ${statusColor} ${status === "critical" ? "animate-critical-pulse" : ""}`}
    >
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className={`font-mono text-2xl font-bold tabular-nums ${textColor}`}>
        {value}
      </span>
      {subtitle && (
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "safe" | "warning" | "critical" }) {
  const config = {
    safe: { label: "OPERATIONAL", bg: "bg-safe/10", text: "text-safe", dot: "bg-safe" },
    warning: { label: "CAUTION", bg: "bg-warning/10", text: "text-warning", dot: "bg-warning" },
    critical: { label: "CRITICAL", bg: "bg-critical/10", text: "text-critical", dot: "bg-critical" },
  };
  const c = config[status];
  return (
    <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${c.bg}`}>
      <span className={`h-2 w-2 rounded-full ${c.dot} ${status === "critical" ? "animate-critical-pulse" : ""}`} />
      <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>
        {c.label}
      </span>
    </div>
  );
}

export default function TwinVitals({ outputs }: TwinVitalsProps) {
  const status = getStatusLevel(outputs.runway_months);
  const animatedCash = useAnimatedNumber(outputs.current_cash_available);
  const animatedBurn = useAnimatedNumber(outputs.burn_rate);
  const animatedRunway = useAnimatedNumber(
    Math.min(outputs.runway_months, 99)
  );
  const animatedRisk = useAnimatedNumber(outputs.risk_score);
  const animatedSurvival = useAnimatedNumber(outputs.survival_probability);

  return (
    <section aria-label="Twin Vital Signs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Twin Vital Signs
        </h2>
        <StatusBadge status={status} />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <VitalCard
          label="Cash Available"
          value={formatCurrency(animatedCash)}
          status={status}
        />
        <VitalCard
          label="Monthly Burn"
          value={formatCurrency(animatedBurn)}
          subtitle={animatedBurn <= 0 ? "Profitable" : "Net negative"}
          status={animatedBurn <= 0 ? "safe" : status}
        />
        <VitalCard
          label="Runway"
          value={
            animatedRunway >= 99
              ? "Infinite"
              : `${animatedRunway.toFixed(1)} mo`
          }
          subtitle={
            outputs.runway_months >= 99
              ? "Sustainable"
              : `~${Math.ceil(outputs.runway_months)} months left`
          }
          status={status}
        />
        <VitalCard
          label="Risk Score"
          value={`${animatedRisk.toFixed(0)}/100`}
          subtitle={
            outputs.risk_score <= 25
              ? "Low risk"
              : outputs.risk_score <= 55
                ? "Moderate risk"
                : "High risk"
          }
          status={
            outputs.risk_score <= 25
              ? "safe"
              : outputs.risk_score <= 55
                ? "warning"
                : "critical"
          }
        />
        <VitalCard
          label="Survival"
          value={`${animatedSurvival.toFixed(0)}%`}
          subtitle={
            outputs.collapse_within_12_months
              ? `Collapse ~Month ${outputs.bankruptcy_month}`
              : "12-month outlook"
          }
          status={
            outputs.survival_probability >= 70
              ? "safe"
              : outputs.survival_probability >= 40
                ? "warning"
                : "critical"
          }
        />
      </div>
    </section>
  );
}
