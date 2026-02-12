"use client";

import { CashTank } from "./cash-tank";
import { RunwayTimeline } from "./runway-timeline";
import type { RiskStatus } from "@/lib/use-simulation";

interface DigitalTwinVizProps {
  cash: number;
  maxCash: number;
  runwayMonths: number;
  riskStatus: RiskStatus;
}

export function DigitalTwinViz({
  cash,
  maxCash,
  runwayMonths,
  riskStatus,
}: DigitalTwinVizProps) {
  return (
    <section
      aria-label="Digital Twin Visualization"
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Digital Twin Core
      </h2>
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end">
        <CashTank cash={cash} maxCash={maxCash} riskStatus={riskStatus} />
        <RunwayTimeline runwayMonths={runwayMonths} riskStatus={riskStatus} />
      </div>
    </section>
  );
}
