"use client";

import { cn, formatMonths } from "@/lib/utils";
import type { RiskStatus } from "@/lib/use-simulation";

interface RunwayTimelineProps {
  runwayMonths: number;
  maxMonths?: number;
  riskStatus: RiskStatus;
}

export function RunwayTimeline({
  runwayMonths,
  maxMonths = 24,
  riskStatus,
}: RunwayTimelineProps) {
  const fillPercent = Math.max(
    2,
    Math.min(100, (runwayMonths / maxMonths) * 100)
  );

  const barColor =
    riskStatus === "Critical"
      ? "bg-destructive"
      : riskStatus === "Warning"
        ? "bg-amber-400"
        : "bg-primary";

  const glowClass =
    riskStatus === "Critical"
      ? "glow-critical"
      : riskStatus === "Safe"
        ? "glow-safe"
        : "";

  // TODO: GSAP animate runway shrink/expand smoothly
  // TODO: GSAP pulse critical warning state

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Runway Timeline
        </span>
        <span className="font-mono text-sm text-card-foreground">
          {formatMonths(runwayMonths)} months
        </span>
      </div>

      <div
        className={cn(
          "relative h-8 overflow-hidden rounded-2xl border border-border bg-muted",
          glowClass
        )}
        role="meter"
        aria-valuenow={runwayMonths}
        aria-valuemin={0}
        aria-valuemax={maxMonths}
        aria-label="Runway timeline"
      >
        <div
          className={cn(
            "h-full transition-all duration-700 ease-out rounded-2xl",
            barColor
          )}
          style={{ width: `${fillPercent}%` }}
        />

        {/* Markers */}
        {[3, 6, 12, 18].map((m) => {
          const pos = (m / maxMonths) * 100;
          if (pos > 100) return null;
          return (
            <div
              key={m}
              className="absolute top-0 bottom-0 flex flex-col items-center justify-end"
              style={{ left: `${pos}%` }}
            >
              <div className="h-full w-px bg-border/60" />
              <span className="absolute -bottom-5 text-[10px] font-mono text-muted-foreground">
                {m}mo
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-4" />
    </div>
  );
}
