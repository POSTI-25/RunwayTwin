"use client";

import { AnimatedNumber } from "./animated-number";
import { formatCurrency, formatMonths, cn } from "@/lib/utils";
import type { DerivedMetrics, RiskStatus } from "@/lib/use-simulation";

interface VitalSignsPanelProps {
  cash: number;
  burnRate: number;
  runwayMonths: number;
  riskStatus: RiskStatus;
}

function StatusBadge({ status }: { status: RiskStatus }) {
  const config: Record<RiskStatus, { bg: string; text: string; dot: string }> =
    {
      Safe: {
        bg: "bg-primary/10",
        text: "text-primary",
        dot: "bg-primary",
      },
      Warning: {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        dot: "bg-amber-400",
      },
      Critical: {
        bg: "bg-destructive/10",
        text: "text-destructive",
        dot: "bg-destructive",
      },
    };

  const c = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        c.bg,
        c.text
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", c.dot)}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

function MetricCard({
  label,
  children,
  accent,
}: {
  label: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-5">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className={cn("text-2xl font-bold tracking-tight font-mono", accent || "text-card-foreground")}>
        {children}
      </span>
    </div>
  );
}

export function VitalSignsPanel({
  cash,
  burnRate,
  runwayMonths,
  riskStatus,
}: VitalSignsPanelProps) {
  return (
    <section aria-label="Twin Vital Signs">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Twin Vital Signs
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Cash Remaining" accent="text-primary">
          <AnimatedNumber value={cash} formatter={formatCurrency} />
        </MetricCard>
        <MetricCard label="Monthly Burn Rate" accent="text-destructive">
          <AnimatedNumber value={burnRate} formatter={formatCurrency} />
        </MetricCard>
        <MetricCard label="Runway Months">
          <AnimatedNumber value={runwayMonths} formatter={formatMonths} />
        </MetricCard>
        <MetricCard label="Survival Status">
          <StatusBadge status={riskStatus} />
        </MetricCard>
      </div>
    </section>
  );
}
