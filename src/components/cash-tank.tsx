"use client";

import { cn, formatCurrency } from "@/lib/utils";
import type { RiskStatus } from "@/lib/use-simulation";

interface CashTankProps {
  cash: number;
  maxCash: number;
  riskStatus: RiskStatus;
}

export function CashTank({ cash, maxCash, riskStatus }: CashTankProps) {
  const fillPercent = Math.max(0, Math.min(100, (cash / maxCash) * 100));

  const fillColor =
    riskStatus === "Critical"
      ? "bg-destructive"
      : riskStatus === "Warning"
        ? "bg-amber-400"
        : "bg-primary";

  const glowColor =
    riskStatus === "Critical"
      ? "shadow-[0_0_20px_rgba(255,77,106,0.4)]"
      : riskStatus === "Warning"
        ? "shadow-[0_0_20px_rgba(251,191,36,0.3)]"
        : "shadow-[0_0_20px_rgba(0,229,160,0.3)]";

  // TODO: GSAP animate tank level when burn changes

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Cash Fuel Tank
      </span>
      <div
        className={cn(
          "relative flex h-56 w-20 items-end overflow-hidden rounded-2xl border border-border bg-muted",
          glowColor
        )}
        role="meter"
        aria-valuenow={cash}
        aria-valuemin={0}
        aria-valuemax={maxCash}
        aria-label="Cash fuel tank"
      >
        {/* Scan lines overlay */}
        <div className="scan-overlay absolute inset-0 z-10 pointer-events-none" />

        {/* Fill */}
        <div
          className={cn(
            "w-full transition-all duration-700 ease-out rounded-b-xl",
            fillColor
          )}
          style={{ height: `${fillPercent}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-x-0 top-0 h-1 bg-foreground/20 rounded-full" />
        </div>

        {/* Grid lines */}
        {[25, 50, 75].map((line) => (
          <div
            key={line}
            className="absolute left-0 right-0 border-t border-border/50"
            style={{ bottom: `${line}%` }}
          />
        ))}
      </div>
      <span className="text-lg font-bold font-mono text-card-foreground">
        {formatCurrency(cash)}
      </span>
    </div>
  );
}
