"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  type SimulationState,
  type Scenario,
  getInitialState,
  computeMetrics,
  generateProjection,
  formatCurrency,
  formatMonths,
} from "@/lib/simulation";
import HeroHeader from "@/components/hero-header";
import VitalCard from "@/components/vital-card";
import FuelTank from "@/components/fuel-tank";
import RunwayStrip from "@/components/runway-strip";
import DecisionLab from "@/components/decision-lab";
import ScenarioForecast from "@/components/scenario-forecast";
import SensitivityPanel from "@/components/sensitivity-panel";
import AICopilot from "@/components/ai-copilot";

export default function CockpitPage() {
  const [state, setState] = useState<SimulationState>(getInitialState);
  const bgRef = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<"healthy" | "caution" | "critical">("healthy");

  const metrics = computeMetrics(state);
  const projection = generateProjection(state);

  const handleStateChange = useCallback(
    (update: Partial<SimulationState>) => {
      setState((prev) => ({ ...prev, ...update }));
    },
    []
  );

  const handleScenarioChange = useCallback((scenario: Scenario) => {
    setState((prev) => ({ ...prev, scenario }));
  }, []);

  // Critical pulse mode - background glow intensifies
  useEffect(() => {
    if (!bgRef.current) return;
    if (metrics.status === "critical" && prevStatusRef.current !== "critical") {
      gsap.to(bgRef.current, {
        backgroundColor: "rgba(239, 68, 68, 0.03)",
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    } else if (metrics.status !== "critical") {
      gsap.killTweensOf(bgRef.current);
      gsap.to(bgRef.current, {
        backgroundColor: "rgba(0, 0, 0, 0)",
        duration: 0.5,
      });
    }
    prevStatusRef.current = metrics.status;
  }, [metrics.status]);

  return (
    <div ref={bgRef} className="min-h-screen bg-background">
      {/* Section 1: Hero Header */}
      <HeroHeader />

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-20 lg:px-8">
        {/* Section 2: Twin Vital Signs Panel */}
        <section aria-label="Vital signs">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Twin Vital Signs
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <VitalCard
              title="Cash Remaining"
              value={formatCurrency(state.cash)}
              numericValue={state.cash}
              icon="cash"
              status={metrics.status}
              isCritical={metrics.status === "critical"}
            />
            <VitalCard
              title="Monthly Burn Rate"
              value={`$${(metrics.burnRate / 1000).toFixed(1)}K`}
              numericValue={metrics.burnRate}
              icon="burn"
              status={
                metrics.burnRate > 15000
                  ? "critical"
                  : metrics.burnRate > 10000
                    ? "caution"
                    : "healthy"
              }
              isCritical={metrics.status === "critical"}
            />
            <VitalCard
              title="Runway Months Left"
              value={formatMonths(metrics.runwayMonths)}
              numericValue={metrics.runwayMonths}
              icon="runway"
              status={metrics.status}
              isCritical={metrics.status === "critical"}
            />
            <VitalCard
              title="Break-even ETA"
              value={
                metrics.breakEvenMonth
                  ? `Month ${metrics.breakEvenMonth}`
                  : "N/A"
              }
              numericValue={metrics.breakEvenMonth ?? 0}
              icon="breakeven"
              status={
                metrics.breakEvenMonth && metrics.breakEvenMonth <= 12
                  ? "healthy"
                  : metrics.breakEvenMonth && metrics.breakEvenMonth <= 24
                    ? "caution"
                    : "critical"
              }
              isCritical={metrics.status === "critical"}
            />
          </div>
        </section>

        {/* Section 3: Central Digital Twin Visualization */}
        <section
          aria-label="Digital twin visualization"
          className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr]"
        >
          <div className="flex justify-center">
            <FuelTank
              cashPercent={metrics.cashPercent}
              status={metrics.status}
              burnRate={metrics.burnRate}
            />
          </div>
          <div className="flex flex-col justify-center gap-6">
            <RunwayStrip
              runwayMonths={metrics.runwayMonths}
              breakEvenMonth={metrics.breakEvenMonth}
              status={metrics.status}
            />

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Fixed Costs
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {formatCurrency(state.fixedCosts)}
                  <span className="text-muted-foreground">/mo</span>
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Variable Costs
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {formatCurrency(state.variableCosts)}
                  <span className="text-muted-foreground">/mo</span>
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Revenue
                </p>
                <p className="font-mono text-sm font-bold text-success">
                  {formatCurrency(state.revenue)}
                  <span className="text-muted-foreground">/mo</span>
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Growth Rate
                </p>
                <p className="font-mono text-sm font-bold text-accent">
                  {(state.revenueGrowthRate * 100).toFixed(0)}%
                  <span className="text-muted-foreground">/mo</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 & 5: Decision Lab + Scenario Forecast */}
        <section
          aria-label="Decision lab and forecasting"
          className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]"
        >
          <div className="rounded-2xl border border-border bg-card/50 p-6">
            <DecisionLab state={state} onStateChange={handleStateChange} />
          </div>
          <div className="rounded-2xl border border-border bg-card/50 p-6">
            <ScenarioForecast
              projection={projection}
              scenario={state.scenario}
              breakEvenMonth={metrics.breakEvenMonth}
              onScenarioChange={handleScenarioChange}
            />
          </div>
        </section>

        {/* Section 6 & 7: Sensitivity + AI Copilot */}
        <section
          aria-label="Analysis and insights"
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <div className="rounded-2xl border border-border bg-card/50 p-6">
            <SensitivityPanel state={state} metrics={metrics} />
          </div>
          <div className="rounded-2xl border border-border bg-card/50 p-6">
            <AICopilot metrics={metrics} />
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-2 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            RunwayTwin simulates startup existence, not just runway.
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            All projections are simulated. Not financial advice.
          </p>
        </footer>
      </main>
    </div>
  );
}
