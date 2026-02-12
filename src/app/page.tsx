'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VitalSigns from '@/components/VitalSigns';
import DigitalTwinVisualization from '@/components/DigitalTwinVisualization';
import DecisionLab from '@/components/DecisionLab';
import ScenarioForecast from '@/components/ScenarioForecast';
import InsightsPanel from '@/components/InsightsPanel';

interface SimulationState {
  cash: number;
  monthlyRevenue: number;
  fixedExpenses: number;
  variableCosts: number;
  burnRate: number;
  runwayMonths: number;
  survivalStatus: 'safe' | 'warning' | 'critical';
  scenario: 'expected' | 'best' | 'worst';
  projections: number[];
}

export default function Home() {
  const [simulation, setSimulation] = useState<SimulationState>({
    cash: 500000,
    monthlyRevenue: 25000,
    fixedExpenses: 15000,
    variableCosts: 8000,
    burnRate: 0,
    runwayMonths: 0,
    survivalStatus: 'safe',
    scenario: 'expected',
    projections: [],
  });

  // Calculate derived metrics
  useEffect(() => {
    const baseRevenue = simulation.monthlyRevenue;
    const totalExpenses = simulation.fixedExpenses + simulation.variableCosts;

    // Apply scenario multipliers
    let scenarioRevenue = baseRevenue;
    if (simulation.scenario === 'best') {
      scenarioRevenue = baseRevenue * 1.15;
    } else if (simulation.scenario === 'worst') {
      scenarioRevenue = baseRevenue * 0.85;
    }

    const newBurnRate = totalExpenses - scenarioRevenue;
    const newRunwayMonths = newBurnRate > 0 ? simulation.cash / newBurnRate : 999;

    let survivalStatus: 'safe' | 'warning' | 'critical' = 'safe';
    if (newRunwayMonths < 3) {
      survivalStatus = 'critical';
    } else if (newRunwayMonths < 6) {
      survivalStatus = 'warning';
    }

    // Generate 12-month projections
    const projections: number[] = [];
    let currentCash = simulation.cash;
    for (let i = 0; i < 12; i++) {
      currentCash -= newBurnRate;
      projections.push(Math.max(0, currentCash));
    }

    setSimulation((prev) => ({
      ...prev,
      burnRate: newBurnRate,
      runwayMonths: newRunwayMonths,
      survivalStatus,
      projections,
    }));
  }, [simulation.cash, simulation.monthlyRevenue, simulation.fixedExpenses, simulation.variableCosts, simulation.scenario]);

  const handleDecision = (type: string) => {
    setSimulation((prev) => {
      let newVariableCosts = prev.variableCosts;
      let newFixedExpenses = prev.fixedExpenses;

      if (type === 'hire') {
        newVariableCosts += 5000;
      } else if (type === 'marketing') {
        newVariableCosts += 2000;
      } else if (type === 'reduce') {
        newFixedExpenses = Math.max(0, prev.fixedExpenses - 1500);
      }

      return {
        ...prev,
        fixedExpenses: newFixedExpenses,
        variableCosts: newVariableCosts,
      };
    });
  };

  const handleScenarioChange = (scenario: 'expected' | 'best' | 'worst') => {
    setSimulation((prev) => ({
      ...prev,
      scenario,
    }));
  };

  const getStatusColor = (status: string) => {
    if (status === 'safe') return '#10b981';
    if (status === 'warning') return '#f59e0b';
    return '#ef4444';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'safe') return 'Safe';
    if (status === 'warning') return 'Warning';
    return 'Critical';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-slate-800">
      {/* Grid background effect */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 107, 53, .1) 25%, rgba(255, 107, 53, .1) 26%, transparent 27%, transparent 74%, rgba(255, 107, 53, .1) 75%, rgba(255, 107, 53, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 107, 53, .1) 25%, rgba(255, 107, 53, .1) 26%, transparent 27%, transparent 74%, rgba(255, 107, 53, .1) 75%, rgba(255, 107, 53, .1) 76%, transparent 77%, transparent)',
        backgroundSize: '50px 50px',
      }} />

      <div className="relative z-10">
        <Header />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Vital Signs Panel */}
          <div className="slide-up">
            <VitalSigns
              cash={simulation.cash}
              burnRate={simulation.burnRate}
              runwayMonths={simulation.runwayMonths}
              survivalStatus={simulation.survivalStatus}
              statusColor={getStatusColor(simulation.survivalStatus)}
            />
          </div>

          {/* Digital Twin Visualization */}
          <div className="slide-up" style={{ animationDelay: '0.1s' }}>
            <DigitalTwinVisualization
              cash={simulation.cash}
              burnRate={simulation.burnRate}
              runwayMonths={simulation.runwayMonths}
              survivalStatus={simulation.survivalStatus}
              maxCash={500000}
              maxRunway={12}
              statusColor={getStatusColor(simulation.survivalStatus)}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Decision Lab */}
            <div className="slide-up" style={{ animationDelay: '0.2s' }}>
              <DecisionLab
                onDecision={handleDecision}
                currentCosts={{
                  fixed: simulation.fixedExpenses,
                  variable: simulation.variableCosts,
                }}
              />
            </div>

            {/* Scenario Forecast */}
            <div className="slide-up" style={{ animationDelay: '0.3s' }}>
              <ScenarioForecast
                scenario={simulation.scenario}
                onScenarioChange={handleScenarioChange}
                projections={simulation.projections}
                cash={simulation.cash}
                burnRate={simulation.burnRate}
              />
            </div>
          </div>

          {/* Insights Panel */}
          <div className="slide-up" style={{ animationDelay: '0.4s' }}>
            <InsightsPanel />
          </div>

          {/* Footer Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
            <div className="border border-slate-700 rounded-lg p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-wider mb-2">Monthly Revenue</div>
              <div className="text-xl font-semibold text-slate-200">${simulation.monthlyRevenue.toLocaleString()}</div>
            </div>
            <div className="border border-slate-700 rounded-lg p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-wider mb-2">Fixed Expenses</div>
              <div className="text-xl font-semibold text-slate-200">${simulation.fixedExpenses.toLocaleString()}</div>
            </div>
            <div className="border border-slate-700 rounded-lg p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-wider mb-2">Variable Costs</div>
              <div className="text-xl font-semibold text-slate-200">${simulation.variableCosts.toLocaleString()}</div>
            </div>
            <div className="border border-slate-700 rounded-lg p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-wider mb-2">Status</div>
              <div
                className="text-xl font-semibold"
                style={{ color: getStatusColor(simulation.survivalStatus) }}
              >
                {getStatusLabel(simulation.survivalStatus)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
