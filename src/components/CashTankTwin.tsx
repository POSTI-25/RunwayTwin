"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { type TwinOutputs, formatCurrency, getStatusLevel } from "@/lib/engine";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface CashTankTwinProps {
  outputs: TwinOutputs;
  initialCash: number;
}

export default function CashTankTwin({ outputs, initialCash }: CashTankTwinProps) {
  const tankRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const status = getStatusLevel(outputs.runway_months);

  const fillPercent = Math.max(
    0,
    Math.min(100, (outputs.current_cash_available / Math.max(initialCash, 1)) * 100)
  );

  const animatedFill = useAnimatedNumber(fillPercent);

  useEffect(() => {
    if (!liquidRef.current) return;

    gsap.to(liquidRef.current, {
      height: `${animatedFill}%`,
      duration: 1.2,
      ease: "power3.out",
    });
  }, [animatedFill]);

  // Bubble effect
  useEffect(() => {
    if (!bubbleContainerRef.current) return;
    const container = bubbleContainerRef.current;

    const interval = setInterval(() => {
      const bubble = document.createElement("div");
      const size = Math.random() * 6 + 2;
      const left = Math.random() * 80 + 10;

      bubble.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(6, 214, 160, 0.3);
        pointer-events: none;
      `;

      container.appendChild(bubble);

      gsap.to(bubble, {
        y: -(Math.random() * 150 + 50),
        opacity: 0,
        duration: Math.random() * 2 + 1,
        ease: "power1.out",
        onComplete: () => bubble.remove(),
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const liquidColor =
    status === "critical"
      ? "from-critical/60 to-critical/30"
      : status === "warning"
        ? "from-warning/60 to-warning/30"
        : "from-accent/60 to-accent/30";

  const borderColor =
    status === "critical"
      ? "border-critical/30"
      : status === "warning"
        ? "border-warning/30"
        : "border-accent/20";

  return (
    <div className={`flex flex-col items-center gap-4 rounded-xl border bg-card p-5 ${borderColor}`}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Cash Fuel Tank
      </h3>

      {/* Tank */}
      <div
        ref={tankRef}
        className="relative h-56 w-20 overflow-hidden rounded-2xl border border-border bg-muted"
        role="meter"
        aria-valuenow={Math.round(fillPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Cash fuel level"
      >
        {/* Grid lines */}
        {[25, 50, 75].map((line) => (
          <div
            key={line}
            className="absolute left-0 right-0 border-t border-border/50"
            style={{ bottom: `${line}%` }}
          >
            <span className="absolute -right-7 -top-2 text-[9px] font-mono text-muted-foreground">
              {line}%
            </span>
          </div>
        ))}

        {/* Liquid */}
        <div
          ref={liquidRef}
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${liquidColor} transition-colors duration-500`}
          style={{ height: `${fillPercent}%` }}
        >
          {/* Wave effect */}
          <div className="absolute -top-1 left-0 right-0 h-2 opacity-40">
            <svg viewBox="0 0 80 8" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 L80 8 L0 8 Z"
                fill="currentColor"
                className={
                  status === "critical"
                    ? "text-critical"
                    : status === "warning"
                      ? "text-warning"
                      : "text-accent"
                }
              />
            </svg>
          </div>
        </div>

        {/* Bubbles */}
        <div ref={bubbleContainerRef} className="absolute inset-0 overflow-hidden" />
      </div>

      {/* Stats */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-lg font-bold text-foreground tabular-nums">
          {formatCurrency(outputs.current_cash_available)}
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(fillPercent)}% remaining
        </span>
      </div>
    </div>
  );
}
