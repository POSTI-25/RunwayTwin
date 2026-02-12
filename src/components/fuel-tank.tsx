"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FuelTankProps {
  cashPercent: number;
  status: "healthy" | "caution" | "critical";
  burnRate: number;
}

export default function FuelTank({
  cashPercent,
  status,
  burnRate,
}: FuelTankProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);

  // Animate fill level
  useEffect(() => {
    if (!fillRef.current) return;
    gsap.to(fillRef.current, {
      height: `${cashPercent}%`,
      duration: 1.2,
      ease: "power3.out",
    });
  }, [cashPercent]);

  // Bubble animation - drain speed reflects burn rate
  useEffect(() => {
    if (!bubblesRef.current) return;
    const bubbles = bubblesRef.current.children;
    const speed = Math.max(1.5, 5 - burnRate / 5000);

    Array.from(bubbles).forEach((bubble, i) => {
      gsap.killTweensOf(bubble);
      gsap.set(bubble, {
        y: 0,
        x: gsap.utils.random(-8, 8),
        opacity: 0,
      });
      gsap.to(bubble, {
        y: -120 - i * 30,
        opacity: [0, 0.6, 0],
        duration: speed + i * 0.4,
        repeat: -1,
        delay: i * 0.8,
        ease: "sine.inOut",
      });
    });

    return () => {
      Array.from(bubbles).forEach((bubble) => gsap.killTweensOf(bubble));
    };
  }, [burnRate]);

  const gradientClass =
    status === "critical"
      ? "fuel-gradient-critical"
      : status === "caution"
        ? "fuel-gradient-warning"
        : "fuel-gradient";

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
        Cash Fuel Tank
      </h3>
      <div className="relative h-64 w-24 overflow-hidden rounded-2xl border border-border bg-muted/50 lg:h-80">
        {/* Fill level */}
        <div
          ref={fillRef}
          className={`absolute inset-x-0 bottom-0 ${gradientClass} transition-colors duration-500`}
          style={{ height: `${cashPercent}%` }}
        >
          {/* Bubbles */}
          <div ref={bubblesRef} className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-foreground/20"
                style={{
                  width: 4 + i * 2,
                  height: 4 + i * 2,
                  left: `${20 + i * 15}%`,
                  bottom: "10%",
                }}
              />
            ))}
          </div>

          {/* Surface shimmer */}
          <div className="absolute inset-x-0 top-0 h-1 bg-foreground/20" />
        </div>

        {/* Scale markers */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute inset-x-0 flex items-center"
            style={{ bottom: `${mark}%` }}
          >
            <div className="h-px w-3 bg-muted-foreground/30" />
            <span className="ml-1 text-[9px] text-muted-foreground/50">
              {mark}%
            </span>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">
          {cashPercent.toFixed(0)}%
        </p>
        <p className="text-xs text-muted-foreground">Fuel Remaining</p>
      </div>
    </div>
  );
}
