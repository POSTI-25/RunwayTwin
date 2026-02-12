"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { type StartupInputs, type ScenarioType, computeTwin, DEFAULT_INPUTS } from "@/lib/engine";
import TwinVitals from "@/components/TwinVitals";
import CashTankTwin from "@/components/CashTankTwin";
import RunwayTimeline from "@/components/RunwayTimeline";
import DecisionLab from "@/components/DecisionLab";
import ScenarioForecast from "@/components/ScenarioForecast";
import SurvivalOutcomes from "@/components/SurvivalOutcomes";
import HealthMetrics from "@/components/HealthMetrics";
import TwinInsights from "@/components/TwinInsights";
import AICopilot from "@/components/AICopilot";

export default function Home() {
  const [inputs, setInputs] = useState<StartupInputs>(DEFAULT_INPUTS);
  const [scenario, setScenario] = useState<ScenarioType>("expected");
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const outputs = computeTwin(inputs, scenario);
  const initialCash =
    inputs.baseline_cash + inputs.equity_raised + inputs.loan_taken;

  // Entry animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-animate]", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setScenario("expected");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-accent"
              >
                <path
                  d="M2 14L8 2L14 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 10H12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">
                RunwayTwin
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wide">
                Startup Survival Cockpit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden text-xs text-muted-foreground italic md:block">
              {"\"Most tools calculate runway. RunwayTwin simulates survival.\""}
            </p>
            <button
              onClick={handleReset}
              className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-accent/30"
            >
              Reset Twin
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main ref={mainRef} className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">
        {/* Vitals Row */}
        <div data-animate>
          <TwinVitals outputs={outputs} />
        </div>

        {/* Main Grid: Decision Lab (Left) + Visualizations (Right) */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column - Decision Lab */}
          <div className="lg:col-span-4 xl:col-span-3" data-animate>
            <div className="sticky top-20">
              <DecisionLab inputs={inputs} onChange={setInputs} />
            </div>
          </div>

          {/* Right Column - Everything else */}
          <div className="flex flex-col gap-6 lg:col-span-8 xl:col-span-9">
            {/* Twin Visualization Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12" data-animate>
              {/* Cash Tank */}
              <div className="md:col-span-3">
                <CashTankTwin outputs={outputs} initialCash={initialCash} />
              </div>
              {/* Runway + Health */}
              <div className="flex flex-col gap-6 md:col-span-9">
                <RunwayTimeline outputs={outputs} />
                <HealthMetrics outputs={outputs} />
              </div>
            </div>

            {/* Scenario Forecast */}
            <div data-animate>
              <ScenarioForecast
                inputs={inputs}
                activeScenario={scenario}
                onScenarioChange={setScenario}
              />
            </div>

            {/* Bottom Row: Outcomes + Insights */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-animate>
              <SurvivalOutcomes outputs={outputs} inputs={inputs} />
              <TwinInsights outputs={outputs} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-border py-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              RunwayTwin v1.0 -- Digital Twin Financial Simulator
            </p>
            <p className="text-xs text-muted-foreground">
              All calculations are simulations, not financial advice.
            </p>
          </div>
        </footer>
      </main>

      {/* AI Copilot Sidebar */}
      <AICopilot inputs={inputs} outputs={outputs} scenario={scenario} />
    </div>
  );
}
