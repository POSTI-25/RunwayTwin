"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface RunwayStripProps {
  runwayMonths: number;
  breakEvenMonth: number | null;
  status: "healthy" | "caution" | "critical";
}

export default function RunwayStrip({
  runwayMonths,
  breakEvenMonth,
  status,
}: RunwayStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const collapseRef = useRef<HTMLDivElement>(null);
  const breakEvenRef = useRef<HTMLDivElement>(null);

  const maxMonths = 24;
  const runwayPercent = Math.min((runwayMonths / maxMonths) * 100, 100);
  const breakEvenPercent = breakEvenMonth
    ? Math.min((breakEvenMonth / maxMonths) * 100, 100)
    : null;

  const barColor =
    status === "critical"
      ? "bg-destructive"
      : status === "caution"
        ? "bg-warning"
        : "bg-accent";

  useEffect(() => {
    if (!stripRef.current) return;
    gsap.to(stripRef.current, {
      width: `${runwayPercent}%`,
      duration: 1,
      ease: "power3.out",
    });
  }, [runwayPercent]);

  useEffect(() => {
    if (!collapseRef.current) return;
    gsap.to(collapseRef.current, {
      left: `${runwayPercent}%`,
      duration: 1,
      ease: "power3.out",
    });
  }, [runwayPercent]);

  useEffect(() => {
    if (!breakEvenRef.current || breakEvenPercent === null) return;
    gsap.to(breakEvenRef.current, {
      left: `${breakEvenPercent}%`,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    });
  }, [breakEvenPercent]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
        Runway Timeline
      </h3>
      <div className="relative h-10 overflow-hidden rounded-xl border border-border bg-muted/50">
        {/* Active runway bar */}
        <div
          ref={stripRef}
          className={`absolute inset-y-0 left-0 ${barColor} transition-colors duration-500`}
          style={{ width: `${runwayPercent}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-foreground/10" />
        </div>

        {/* Collapse marker */}
        <div
          ref={collapseRef}
          className="absolute top-0 h-full w-0.5 bg-destructive"
          style={{ left: `${runwayPercent}%` }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground">
            Collapse
          </div>
        </div>

        {/* Break-even marker */}
        {breakEvenPercent !== null && (
          <div
            ref={breakEvenRef}
            className="absolute top-0 h-full w-0.5 bg-success opacity-0"
            style={{ left: `${breakEvenPercent}%` }}
          >
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-success px-1.5 py-0.5 text-[10px] font-medium text-success-foreground">
              Break-even
            </div>
          </div>
        )}
      </div>

      {/* Scale */}
      <div className="flex justify-between px-1">
        {[0, 6, 12, 18, 24].map((m) => (
          <span key={m} className="text-[10px] text-muted-foreground">
            {m}mo
          </span>
        ))}
      </div>
    </div>
  );
}
