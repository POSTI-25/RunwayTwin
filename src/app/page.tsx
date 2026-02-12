"use client";

import { useSimulation } from "@/lib/use-simulation";
import { CockpitHeader } from "@/components/cockpit-header";
import { VitalSignsPanel } from "@/components/vital-signs-panel";
import { DigitalTwinViz } from "@/components/digital-twin-viz";
import { DecisionLab } from "@/components/decision-lab";
import { ScenarioForecast } from "@/components/scenario-forecast";
import { TwinInsights } from "@/components/twin-insights";

const MAX_CASH = 500_000;

export default function Home() {
  const {
    state,
    scenario,
    setScenario,
    derived,
    forecast,
    collapseMonth,
    breakEvenMonth,
    hireEngineer,
    increaseMarketing,
    reduceCosts,
    resetSimulation,
  } = useSimulation();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <CockpitHeader riskStatus={derived.riskStatus} />

        {/* Vital Signs */}
        <VitalSignsPanel
          cash={state.cash}
          burnRate={derived.burnRate}
          runwayMonths={derived.runwayMonths}
          riskStatus={derived.riskStatus}
        />

        {/* Center: Twin Viz + Decision Lab */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DigitalTwinViz
              cash={state.cash}
              maxCash={MAX_CASH}
              runwayMonths={derived.runwayMonths}
              riskStatus={derived.riskStatus}
            />
          </div>
          <div>
            <DecisionLab
              onHire={hireEngineer}
              onMarketing={increaseMarketing}
              onCut={reduceCosts}
              onReset={resetSimulation}
              hires={state.hires}
              marketingBoosts={state.marketingBoosts}
              costCuts={state.costCuts}
            />
          </div>
        </div>

        {/* Forecast + Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ScenarioForecast
              scenario={scenario}
              onScenarioChange={setScenario}
              forecast={forecast}
              collapseMonth={collapseMonth}
              breakEvenMonth={breakEvenMonth}
            />
          </div>
          <div>
            <TwinInsights />
          </div>
        </div>
      </main>
    </div>
  );
}
