"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { type TwinOutputs, formatCurrency, getStatusLevel } from "@/lib/engine";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface CashTankTwinProps {
  outputs: TwinOutputs;
  initialCash: number;
}

// Reference ceiling for the tank -- represents "100% full"
// Use the greater of 2x the initial cash or 2M so small values don't instantly fill the tank
function getTankCapacity(initialCash: number): number {
  return Math.max(initialCash * 1.5, 2_000_000);
}

export default function CashTankTwin({ outputs, initialCash }: CashTankTwinProps) {
  const tankRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const status = getStatusLevel(outputs.runway_months);

  const capacity = getTankCapacity(initialCash);
  const fillPercent = Math.max(
    0,
    Math.min(100, (outputs.current_cash_available / capacity) * 100)
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

  // Bubble color based on status
  const bubbleColor = useCallback(() => {
    if (status === "critical") return "rgba(239, 68, 68, 0.35)";
    if (status === "warning") return "rgba(245, 158, 11, 0.35)";
    return "rgba(6, 214, 160, 0.3)";
  }, [status]);

  // Bubble effect -- only inside liquid
  useEffect(() => {
    if (!bubbleContainerRef.current) return;
    const container = bubbleContainerRef.current;

    // No bubbles when there's basically no liquid (< 3%)
    if (fillPercent < 3) return;

    const interval = setInterval(() => {
      // Double-check fill is still meaningful
      if (fillPercent < 3) return;

      const bubble = document.createElement("div");
      const size = Math.random() * 5 + 2;
      const left = Math.random() * 70 + 15;

      // Max travel distance = liquid height so bubbles don't escape
      // Container is the liquid div itself, so bottom:0 is the tank bottom
      // and we travel upward at most 90% of the current liquid height
      const liquidHeightPx = container.parentElement
        ? container.parentElement.clientHeight * (fillPercent / 100)
        : 50;
      const maxTravel = Math.max(liquidHeightPx * 0.85, 10);

      bubble.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${bubbleColor()};
        pointer-events: none;
      `;

      container.appendChild(bubble);

      gsap.to(bubble, {
        y: -(Math.random() * maxTravel),
        opacity: 0,
        duration: Math.random() * 1.8 + 0.8,
        ease: "power1.out",
        onComplete: () => bubble.remove(),
      });
    }, 500);

    return () => {
      clearInterval(interval);
      // Clean up any leftover bubbles
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [fillPercent, bubbleColor]);

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

  const glowClass =
    status === "critical"
      ? "glow-critical"
      : status === "warning"
        ? "glow-warning"
        : "glow-accent";

  return (
    <div className={`flex flex-col items-center gap-4 rounded-xl border bg-card p-5 ${borderColor} ${glowClass}`}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Cash Fuel Tank
      </h3>

      {/* Capacity label */}
      <span className="text-[9px] font-mono text-muted-foreground -mt-2">
        Cap: {formatCurrency(capacity)}
      </span>

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
          {/* Wave effect -- only show when there's visible liquid */}
          {fillPercent > 2 && (
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
          )}

          {/* Bubbles live INSIDE the liquid div */}
          <div ref={bubbleContainerRef} className="absolute inset-0 overflow-hidden" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-lg font-bold text-foreground tabular-nums">
          {formatCurrency(outputs.current_cash_available)}
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(fillPercent)}% of capacity
        </span>
      </div>
    </div>
  );
}
