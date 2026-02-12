"use client";

import type { RiskStatus } from "@/lib/use-simulation";
import { cn } from "@/lib/utils";

interface CockpitHeaderProps {
  riskStatus: RiskStatus;
}

export function CockpitHeader({ riskStatus }: CockpitHeaderProps) {
  const statusDot =
    riskStatus === "Critical"
      ? "bg-destructive"
      : riskStatus === "Warning"
        ? "bg-amber-400"
        : "bg-primary";

  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            RunwayTwin
          </h1>
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              statusDot
            )}
            aria-hidden="true"
          />
        </div>
        <p className="mt-1 max-w-md text-sm text-muted-foreground text-balance">
          Most tools calculate runway. RunwayTwin simulates survival.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Digital Twin Active
        </span>
      </div>
    </header>
  );
}
