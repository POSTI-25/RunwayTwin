"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import {
  UserPlus,
  Megaphone,
  TrendingDown,
  Zap,
} from "lucide-react";
import type { SimulationState } from "@/lib/simulation";

interface DecisionLabProps {
  state: SimulationState;
  onStateChange: (update: Partial<SimulationState>) => void;
}

interface DecisionButton {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  action: (state: SimulationState) => Partial<SimulationState>;
}

export default function DecisionLab({
  state,
  onStateChange,
}: DecisionLabProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const flashEffect = useCallback((element: HTMLElement, color: string) => {
    gsap.fromTo(
      element,
      { boxShadow: `0 0 0px ${color}` },
      {
        boxShadow: `0 0 30px ${color}`,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      }
    );
  }, []);

  const decisions: DecisionButton[] = [
    {
      label: "Hire Engineer",
      description: "+$5,000/mo burn",
      icon: <UserPlus className="h-4 w-4" />,
      color: "rgba(0, 229, 255, 0.4)",
      borderColor: "border-accent/30 hover:border-accent/60",
      action: () => ({
        fixedCosts: state.fixedCosts + 5000,
      }),
    },
    {
      label: "Boost Marketing",
      description: "+$2,000/mo burn",
      icon: <Megaphone className="h-4 w-4" />,
      color: "rgba(245, 158, 11, 0.4)",
      borderColor: "border-warning/30 hover:border-warning/60",
      action: () => ({
        variableCosts: state.variableCosts + 2000,
      }),
    },
    {
      label: "Reduce Costs",
      description: "-$1,500/mo burn",
      icon: <TrendingDown className="h-4 w-4" />,
      color: "rgba(16, 185, 129, 0.4)",
      borderColor: "border-success/30 hover:border-success/60",
      action: () => ({
        fixedCosts: Math.max(0, state.fixedCosts - 1500),
      }),
    },
    {
      label: "Market Shock",
      description: "Revenue drops 30%",
      icon: <Zap className="h-4 w-4" />,
      color: "rgba(239, 68, 68, 0.4)",
      borderColor: "border-destructive/30 hover:border-destructive/60",
      action: () => ({
        revenue: Math.round(state.revenue * 0.7),
      }),
    },
  ];

  return (
    <div ref={containerRef} className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold text-foreground">Decision Lab</h3>
        <p className="text-sm text-muted-foreground">
          Test reality before it happens
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {decisions.map((d, i) => (
          <button
            key={i}
            onClick={(e) => {
              flashEffect(e.currentTarget, d.color);
              onStateChange(d.action(state));
            }}
            className={`group flex items-center gap-3 rounded-xl border ${d.borderColor} bg-card p-4 text-left transition-all hover:bg-muted/50 active:scale-[0.98]`}
          >
            <div className="rounded-lg bg-muted p-2 text-foreground transition-colors group-hover:text-accent">
              {d.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {d.label}
              </p>
              <p className="text-xs text-muted-foreground">{d.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Pricing slider */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Revenue Growth Rate
          </span>
          <span className="font-mono text-sm font-bold text-accent">
            {(state.revenueGrowthRate * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="-10"
          max="20"
          value={state.revenueGrowthRate * 100}
          onChange={(e) =>
            onStateChange({
              revenueGrowthRate: Number(e.target.value) / 100,
            })
          }
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-accent"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>-10%</span>
          <span>0%</span>
          <span>+20%</span>
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={() =>
          onStateChange({
            cash: 500000,
            fixedCosts: 15000,
            variableCosts: 5000,
            revenue: 8000,
            revenueGrowthRate: 0.05,
          })
        }
        className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Reset Simulation
      </button>
    </div>
  );
}
