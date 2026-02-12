"use client";

import { useState, useCallback, useMemo } from "react";

export type RiskStatus = "Safe" | "Warning" | "Critical";
export type Scenario = "expected" | "best" | "worst";

export interface SimulationState {
  cash: number;
  monthlyRevenue: number;
  fixedExpenses: number;
  variableCosts: number;
  hires: number;
  marketingBoosts: number;
  costCuts: number;
}

export interface DerivedMetrics {
  burnRate: number;
  runwayMonths: number;
  riskStatus: RiskStatus;
  totalExpenses: number;
}

export interface ForecastPoint {
  month: number;
  label: string;
  cash: number;
  revenue: number;
  expenses: number;
}

const INITIAL_STATE: SimulationState = {
  cash: 500_000,
  monthlyRevenue: 18_000,
  fixedExpenses: 25_000,
  variableCosts: 5_000,
  hires: 0,
  marketingBoosts: 0,
  costCuts: 0,
};

const HIRE_COST = 5_000;
const MARKETING_COST = 2_000;
const CUT_SAVINGS = 1_500;

function getScenarioMultiplier(scenario: Scenario): number {
  switch (scenario) {
    case "best":
      return 1.15;
    case "worst":
      return 0.85;
    default:
      return 1;
  }
}

function getRiskStatus(runwayMonths: number): RiskStatus {
  if (runwayMonths > 6) return "Safe";
  if (runwayMonths > 3) return "Warning";
  return "Critical";
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const [scenario, setScenario] = useState<Scenario>("expected");

  const derived = useMemo<DerivedMetrics>(() => {
    const multiplier = getScenarioMultiplier(scenario);
    const adjustedRevenue = state.monthlyRevenue * multiplier;
    const totalExpenses =
      state.fixedExpenses +
      state.variableCosts +
      state.hires * HIRE_COST +
      state.marketingBoosts * MARKETING_COST -
      state.costCuts * CUT_SAVINGS;

    const burnRate = Math.max(0, totalExpenses - adjustedRevenue);
    const runwayMonths = burnRate > 0 ? state.cash / burnRate : 99;

    // TODO: Add real finance modeling:
    // - payroll schedules
    // - funding events
    // - churn + retention
    // - uncertainty modeling

    return {
      burnRate,
      runwayMonths: Math.min(99, runwayMonths),
      riskStatus: getRiskStatus(runwayMonths),
      totalExpenses,
    };
  }, [state, scenario]);

  const forecast = useMemo<ForecastPoint[]>(() => {
    const multiplier = getScenarioMultiplier(scenario);
    const adjustedRevenue = state.monthlyRevenue * multiplier;
    const totalExpenses =
      state.fixedExpenses +
      state.variableCosts +
      state.hires * HIRE_COST +
      state.marketingBoosts * MARKETING_COST -
      state.costCuts * CUT_SAVINGS;

    const points: ForecastPoint[] = [];
    let remaining = state.cash;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    for (let i = 0; i < 12; i++) {
      remaining = remaining - totalExpenses + adjustedRevenue;
      points.push({
        month: i + 1,
        label: months[i],
        cash: Math.max(0, Math.round(remaining)),
        revenue: Math.round(adjustedRevenue),
        expenses: Math.round(totalExpenses),
      });
    }
    return points;
  }, [state, scenario]);

  const collapseMonth = useMemo(() => {
    const idx = forecast.findIndex((p) => p.cash === 0);
    return idx >= 0 ? idx + 1 : null;
  }, [forecast]);

  const breakEvenMonth = useMemo(() => {
    const multiplier = getScenarioMultiplier(scenario);
    const adjustedRevenue = state.monthlyRevenue * multiplier;
    const totalExpenses =
      state.fixedExpenses +
      state.variableCosts +
      state.hires * HIRE_COST +
      state.marketingBoosts * MARKETING_COST -
      state.costCuts * CUT_SAVINGS;
    if (adjustedRevenue >= totalExpenses) return 0;
    return null;
  }, [state, scenario]);

  const hireEngineer = useCallback(() => {
    setState((prev) => ({ ...prev, hires: prev.hires + 1 }));
  }, []);

  const increaseMarketing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      marketingBoosts: prev.marketingBoosts + 1,
    }));
  }, []);

  const reduceCosts = useCallback(() => {
    setState((prev) => ({ ...prev, costCuts: prev.costCuts + 1 }));
  }, []);

  const resetSimulation = useCallback(() => {
    setState(INITIAL_STATE);
    setScenario("expected");
  }, []);

  return {
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
  };
}
