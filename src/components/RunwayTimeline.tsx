"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { type TwinOutputs, getStatusLevel } from "@/lib/engine";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface RunwayTimelineProps {
  outputs: TwinOutputs;
}

export default function RunwayTimeline({ outputs }: RunwayTimelineProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const status = getStatusLevel(outputs.runway_months);
  const maxMonths = 24;
  const fillPercent = Math.min(100, (outputs.runway_months / maxMonths) * 100);
  const animatedRunway = useAnimatedNumber(Math.min(outputs.runway_months, 99));

  useEffect(() => {
    if (!barRef.current) return;
    gsap.to(barRef.current, {
      width: `${fillPercent}%`,
      duration: 1,
      ease: "power3.out",
    });
  }, [fillPercent]);

  const barColor =
    status === "critical"
      ? "bg-critical"
      : status === "warning"
        ? "bg-warning"
        : "bg-accent";

  const glowClass =
    status === "critical"
      ? "glow-critical"
      : status === "warning"
        ? "glow-warning"
        : "glow-accent";

  const borderColor =
    status === "critical"
      ? "border-critical/30"
      : status === "warning"
        ? "border-warning/30"
        : "border-accent/20";

  return (
    <div className={`rounded-xl border bg-card p-5 ${borderColor}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Runway Timeline
        </h3>
        <span className="font-mono text-sm font-bold tabular-nums text-foreground">
          {animatedRunway >= 99
            ? "Infinite"
            : `${animatedRunway.toFixed(1)} months`}
        </span>
      </div>

      {/* Timeline bar */}
      <div className="relative h-6 w-full overflow-hidden rounded-full bg-muted">
        <div
          ref={barRef}
          className={`absolute left-0 top-0 h-full rounded-full ${barColor} ${glowClass} transition-colors duration-500`}
          style={{ width: `${fillPercent}%` }}
        />

        {/* Month markers */}
        {[3, 6, 12, 18].map((month) => {
          const pos = (month / maxMonths) * 100;
          return (
            <div
              key={month}
              className="absolute top-0 h-full border-l border-border/60"
              style={{ left: `${pos}%` }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2">
        {[0, 3, 6, 12, 18, 24].map((month) => (
          <span
            key={month}
            className="text-[10px] font-mono text-muted-foreground"
          >
            {month}m
          </span>
        ))}
      </div>

      {/* Milestones */}
      <div className="flex flex-wrap gap-3 mt-4">
        {outputs.break_even_month && (
          <span className="rounded-md bg-safe/10 px-2 py-1 text-xs font-medium text-safe">
            Break-even: Month {outputs.break_even_month}
          </span>
        )}
        {outputs.bankruptcy_month && (
          <span className="rounded-md bg-critical/10 px-2 py-1 text-xs font-medium text-critical animate-critical-pulse">
            Cash-out: Month {outputs.bankruptcy_month}
          </span>
        )}
        {!outputs.break_even_month && !outputs.bankruptcy_month && (
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            No critical events in 12-month window
          </span>
        )}
      </div>
    </div>
  );
}
