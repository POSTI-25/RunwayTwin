export type Scenario = "expected" | "best" | "worst";

export interface SimulationState {
  cash: number;
  fixedCosts: number;
  variableCosts: number;
  revenue: number;
  revenueGrowthRate: number;
  scenario: Scenario;
  month: number;
}

export interface SimulationMetrics {
  burnRate: number;
  runwayMonths: number;
  breakEvenMonth: number | null;
  cashPercent: number;
  status: "healthy" | "caution" | "critical";
}

export interface ProjectionPoint {
  month: number;
  cash: number;
  revenue: number;
  expenses: number;
  label: string;
}

const INITIAL_CASH = 500000;

const SCENARIO_MODIFIERS: Record<Scenario, number> = {
  expected: 0,
  best: 0.15,
  worst: -0.15,
};

export function getInitialState(): SimulationState {
  return {
    cash: INITIAL_CASH,
    fixedCosts: 15000,
    variableCosts: 5000,
    revenue: 8000,
    revenueGrowthRate: 0.05,
    scenario: "expected",
    month: 0,
  };
}

export function computeMetrics(state: SimulationState): SimulationMetrics {
  const modifier = SCENARIO_MODIFIERS[state.scenario];
  const effectiveGrowth = state.revenueGrowthRate + modifier;

  const totalExpenses = state.fixedCosts + state.variableCosts;
  const burnRate = totalExpenses - state.revenue;
  const runwayMonths = burnRate > 0 ? state.cash / burnRate : 999;

  // Find break-even month
  let breakEvenMonth: number | null = null;
  let projRevenue = state.revenue;
  for (let m = 1; m <= 36; m++) {
    projRevenue = projRevenue * (1 + effectiveGrowth);
    if (projRevenue >= totalExpenses) {
      breakEvenMonth = m;
      break;
    }
  }

  const cashPercent = (state.cash / INITIAL_CASH) * 100;

  let status: "healthy" | "caution" | "critical";
  if (runwayMonths < 3 || cashPercent < 15) {
    status = "critical";
  } else if (runwayMonths < 6 || cashPercent < 35) {
    status = "caution";
  } else {
    status = "healthy";
  }

  return {
    burnRate: Math.max(0, burnRate),
    runwayMonths: Math.min(runwayMonths, 999),
    breakEvenMonth,
    cashPercent: Math.max(0, Math.min(100, cashPercent)),
    status,
  };
}

export function generateProjection(state: SimulationState): ProjectionPoint[] {
  const modifier = SCENARIO_MODIFIERS[state.scenario];
  const effectiveGrowth = state.revenueGrowthRate + modifier;
  const points: ProjectionPoint[] = [];

  let cash = state.cash;
  let revenue = state.revenue;
  const totalExpenses = state.fixedCosts + state.variableCosts;

  for (let m = 0; m <= 12; m++) {
    const monthNames = [
      "Now",
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7",
      "M8",
      "M9",
      "M10",
      "M11",
      "M12",
    ];
    points.push({
      month: m,
      cash: Math.max(0, Math.round(cash)),
      revenue: Math.round(revenue),
      expenses: Math.round(totalExpenses),
      label: monthNames[m],
    });

    if (m < 12) {
      const burn = totalExpenses - revenue;
      cash -= burn;
      revenue = revenue * (1 + effectiveGrowth);
    }
  }

  return points;
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatMonths(value: number): string {
  if (value >= 999) return "Safe";
  if (value < 0) return "0 mo";
  return `${value.toFixed(1)} mo`;
}
