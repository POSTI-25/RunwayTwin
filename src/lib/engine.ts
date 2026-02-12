// ============================================================
// RunwayTwin Financial Simulation Engine
// ============================================================

export interface StartupInputs {
  // Baseline Financials
  baseline_cash: number;
  baseline_revenue: number;
  baseline_fixed_expenses: number;
  baseline_growth_rate: number; // decimal, e.g. 0.10 = 10%
  gross_margin: number; // decimal, e.g. 0.70 = 70%

  // Team
  total_team_size: number;
  avg_cost_per_hire: number;

  // Decision Levers (% modifiers)
  employees_hired: number;
  marketing_spend: number;
  pricing_change_percent: number; // e.g. +5 means 5% price increase
  cost_cut_percent: number; // e.g. 10 means 10% cost cut
  revenue_shock_percent: number; // e.g. -20 means 20% revenue drop
  market_index: number; // 0.0 - 1.0, 1.0 = booming

  // Fundraising
  equity_raised: number;
  loan_taken: number;
  interest_rate: number; // annual, decimal
}

export interface TwinOutputs {
  // HR
  total_team_size: number;
  total_new_salary_expense: number;
  revenue_per_employee: number;

  // Growth
  adjusted_revenue: number;
  marketing_spend: number;

  // Fundraising
  loan_interest_payment_monthly: number;

  // Financial Engine
  adjusted_fixed_expenses: number;
  burn_rate: number;
  current_cash_available: number;
  runway_months: number;

  // Break-even
  break_even_month_estimate: number;
  months_to_break_even: number;
  is_break_even_achieved: boolean;

  // Financial Health (0-1 scores)
  cash_ratio: number;
  debt_to_cash_ratio: number;
  burn_sensitivity_index: number;
  growth_volatility_index: number;
  market_dependency_index: number;

  // Survival Intelligence
  risk_score: number; // 0-100
  survival_probability: number; // 0-100
  collapse_within_12_months: boolean;

  // Forecast (12 month cash trajectory)
  cash_trajectory: number[];
  revenue_trajectory: number[];
  break_even_month: number | null;
  bankruptcy_month: number | null;
}

export type ScenarioType = "expected" | "best" | "worst";

const SCENARIO_MULTIPLIERS: Record<
  ScenarioType,
  { revenue: number; expenses: number; growth: number }
> = {
  expected: { revenue: 1.0, expenses: 1.0, growth: 1.0 },
  best: { revenue: 1.25, expenses: 0.85, growth: 1.4 },
  worst: { revenue: 0.65, expenses: 1.2, growth: 0.5 },
};

export function computeTwin(
  inputs: StartupInputs,
  scenario: ScenarioType = "expected"
): TwinOutputs {
  const mult = SCENARIO_MULTIPLIERS[scenario];

  // --- HR ---
  const total_team_size = inputs.total_team_size + inputs.employees_hired;
  const total_new_salary_expense =
    inputs.employees_hired * inputs.avg_cost_per_hire;

  // --- Revenue ---
  const pricing_factor = 1 + inputs.pricing_change_percent / 100;
  const market_factor = 0.5 + inputs.market_index * 0.5; // 0.5 to 1.0
  const shock_factor = 1 + inputs.revenue_shock_percent / 100;
  const adjusted_revenue =
    inputs.baseline_revenue *
    pricing_factor *
    market_factor *
    shock_factor *
    mult.revenue;

  const revenue_per_employee =
    total_team_size > 0 ? adjusted_revenue / total_team_size : 0;

  // --- Expenses ---
  const cost_cut_factor = 1 - inputs.cost_cut_percent / 100;
  const adjusted_fixed_expenses =
    (inputs.baseline_fixed_expenses + total_new_salary_expense) *
    cost_cut_factor *
    mult.expenses;

  // --- Fundraising ---
  const loan_interest_payment_monthly =
    (inputs.loan_taken * inputs.interest_rate) / 12;

  // --- Burn ---
  const gross_profit = adjusted_revenue * inputs.gross_margin;
  const burn_rate =
    adjusted_fixed_expenses +
    inputs.marketing_spend +
    loan_interest_payment_monthly -
    gross_profit;

  // --- Cash ---
  const current_cash_available =
    inputs.baseline_cash + inputs.equity_raised + inputs.loan_taken;

  // --- Runway ---
  const runway_months =
    burn_rate > 0
      ? current_cash_available / burn_rate
      : burn_rate === 0
        ? 999
        : 999; // profitable

  // --- 12 month forecast ---
  const cash_trajectory: number[] = [];
  const revenue_trajectory: number[] = [];
  let monthly_cash = current_cash_available;
  let monthly_revenue = adjusted_revenue;
  const growth_rate = inputs.baseline_growth_rate * mult.growth;
  let break_even_month: number | null = null;
  let bankruptcy_month: number | null = null;

  for (let m = 0; m < 12; m++) {
    const month_gross = monthly_revenue * inputs.gross_margin;
    const month_burn =
      adjusted_fixed_expenses +
      inputs.marketing_spend +
      loan_interest_payment_monthly -
      month_gross;

    monthly_cash -= month_burn;
    cash_trajectory.push(Math.round(monthly_cash));
    revenue_trajectory.push(Math.round(monthly_revenue));

    if (month_burn <= 0 && break_even_month === null) {
      break_even_month = m + 1;
    }
    if (monthly_cash <= 0 && bankruptcy_month === null) {
      bankruptcy_month = m + 1;
    }

    monthly_revenue *= 1 + growth_rate / 12;
  }

  // --- Break-even ---
  const is_break_even_achieved = burn_rate <= 0;
  const break_even_month_estimate = break_even_month ?? (burn_rate <= 0 ? 0 : -1);
  const months_to_break_even = break_even_month ?? -1;

  // --- Financial Health Ratios ---
  const cash_ratio =
    adjusted_fixed_expenses > 0
      ? Math.min(current_cash_available / (adjusted_fixed_expenses * 6), 1)
      : 1;

  const debt_to_cash_ratio =
    current_cash_available > 0
      ? Math.min(inputs.loan_taken / current_cash_available, 1)
      : 1;

  const burn_sensitivity_index =
    adjusted_revenue > 0
      ? Math.min(Math.abs(burn_rate) / adjusted_revenue, 1)
      : 1;

  const growth_volatility_index = Math.abs(
    inputs.revenue_shock_percent / 100
  );

  const market_dependency_index = 1 - inputs.market_index;

  // --- Risk Score (0-100, higher = more risky) ---
  const runway_risk = runway_months < 3 ? 40 : runway_months < 6 ? 25 : runway_months < 12 ? 10 : 0;
  const debt_risk = debt_to_cash_ratio * 20;
  const burn_risk = burn_sensitivity_index * 20;
  const market_risk = market_dependency_index * 10;
  const team_risk = total_team_size > 20 && revenue_per_employee < 5000 ? 10 : 0;

  const risk_score = Math.min(
    100,
    Math.round(runway_risk + debt_risk + burn_risk + market_risk + team_risk)
  );

  const survival_probability = Math.max(0, 100 - risk_score);
  const collapse_within_12_months = bankruptcy_month !== null && bankruptcy_month <= 12;

  return {
    total_team_size,
    total_new_salary_expense,
    revenue_per_employee,
    adjusted_revenue,
    marketing_spend: inputs.marketing_spend,
    loan_interest_payment_monthly,
    adjusted_fixed_expenses,
    burn_rate,
    current_cash_available,
    runway_months: Math.min(runway_months, 999),
    break_even_month_estimate,
    months_to_break_even,
    is_break_even_achieved,
    cash_ratio,
    debt_to_cash_ratio,
    burn_sensitivity_index,
    growth_volatility_index,
    market_dependency_index,
    risk_score,
    survival_probability,
    collapse_within_12_months,
    cash_trajectory,
    revenue_trajectory,
    break_even_month,
    bankruptcy_month,
  };
}

export function getStatusLevel(runway: number): "safe" | "warning" | "critical" {
  if (runway >= 12) return "safe";
  if (runway >= 4) return "warning";
  return "critical";
}

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export const DEFAULT_INPUTS: StartupInputs = {
  baseline_cash: 500000,
  baseline_revenue: 30000,
  baseline_fixed_expenses: 45000,
  baseline_growth_rate: 0.12,
  gross_margin: 0.70,
  total_team_size: 8,
  avg_cost_per_hire: 6000,
  employees_hired: 0,
  marketing_spend: 5000,
  pricing_change_percent: 0,
  cost_cut_percent: 0,
  revenue_shock_percent: 0,
  market_index: 0.7,
  equity_raised: 0,
  loan_taken: 0,
  interest_rate: 0.08,
};
