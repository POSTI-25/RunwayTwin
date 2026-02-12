"use client";

import { type TwinOutputs, type StartupInputs, formatCurrency, computeTwin } from "@/lib/engine";

interface SurvivalOutcomesProps {
  outputs: TwinOutputs;
  inputs: StartupInputs;
}

interface Outcome {
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
}

function generateOutcomes(outputs: TwinOutputs, inputs: StartupInputs): Outcome[] {
  const outcomes: Outcome[] = [];

  // Hiring impact
  if (inputs.employees_hired > 0) {
    const withoutHiring = computeTwin({ ...inputs, employees_hired: 0 });
    const runwayDiff = withoutHiring.runway_months - outputs.runway_months;
    if (runwayDiff > 0) {
      outcomes.push({
        title: `Hiring ${inputs.employees_hired} reduces runway by ${runwayDiff.toFixed(1)} months`,
        description: `New salary expense: ${formatCurrency(outputs.total_new_salary_expense)}/mo. Revenue per employee drops to ${formatCurrency(outputs.revenue_per_employee)}.`,
        impact: "negative",
      });
    } else {
      outcomes.push({
        title: `Hiring ${inputs.employees_hired} is sustainable at current margins`,
        description: `Revenue per employee: ${formatCurrency(outputs.revenue_per_employee)}. Team is still efficient.`,
        impact: "positive",
      });
    }
  }

  // Marketing impact
  if (inputs.marketing_spend > 5000) {
    const burnIncrease = ((inputs.marketing_spend - 5000) / Math.max(outputs.burn_rate, 1)) * 100;
    outcomes.push({
      title: `Marketing spend accelerates burn by +${burnIncrease.toFixed(0)}%`,
      description: `At ${formatCurrency(inputs.marketing_spend)}/mo, this consumes ${((inputs.marketing_spend / Math.max(outputs.current_cash_available, 1)) * 100).toFixed(1)}% of cash monthly.`,
      impact: burnIncrease > 30 ? "negative" : "neutral",
    });
  }

  // Revenue shock
  if (inputs.revenue_shock_percent < -10) {
    outcomes.push({
      title: `${Math.abs(inputs.revenue_shock_percent)}% revenue shock detected`,
      description: `Adjusted revenue: ${formatCurrency(outputs.adjusted_revenue)}/mo. ${outputs.collapse_within_12_months ? `Collapse projected in Month ${outputs.bankruptcy_month}.` : "Cash runway absorbs the shock."}`,
      impact: "negative",
    });
  }

  // Break-even insight
  if (outputs.is_break_even_achieved) {
    outcomes.push({
      title: "Break-even achieved - startup is self-sustaining",
      description: `Gross profit exceeds total expenses. Cash position will grow over time.`,
      impact: "positive",
    });
  } else if (outputs.break_even_month) {
    outcomes.push({
      title: `Break-even projected at Month ${outputs.break_even_month}`,
      description: `With ${(inputs.baseline_growth_rate * 100).toFixed(0)}% growth rate, revenue will cover costs by month ${outputs.break_even_month}.`,
      impact: "neutral",
    });
  }

  // Debt warning
  if (outputs.debt_to_cash_ratio > 0.5) {
    outcomes.push({
      title: `High debt-to-cash ratio: ${(outputs.debt_to_cash_ratio * 100).toFixed(0)}%`,
      description: `Loan interest: ${formatCurrency(outputs.loan_interest_payment_monthly)}/mo. Debt is consuming a significant portion of cash reserves.`,
      impact: "negative",
    });
  }

  // Collapse warning
  if (outputs.collapse_within_12_months) {
    outcomes.push({
      title: `Worst case collapse in Month ${outputs.bankruptcy_month}`,
      description: `At current burn rate of ${formatCurrency(outputs.burn_rate)}/mo, cash will be fully depleted. Immediate action required.`,
      impact: "negative",
    });
  }

  // Pricing insight
  if (inputs.pricing_change_percent > 0) {
    outcomes.push({
      title: `${inputs.pricing_change_percent}% price increase boosts monthly revenue`,
      description: `Adjusted revenue: ${formatCurrency(outputs.adjusted_revenue)}/mo. Monitor for churn impact.`,
      impact: "positive",
    });
  }

  // Cost cutting
  if (inputs.cost_cut_percent > 0) {
    const savings = inputs.baseline_fixed_expenses * (inputs.cost_cut_percent / 100);
    outcomes.push({
      title: `${inputs.cost_cut_percent}% cost cut saves ${formatCurrency(savings)}/mo`,
      description: `Adjusted expenses: ${formatCurrency(outputs.adjusted_fixed_expenses)}/mo. Extended runway by reducing overhead.`,
      impact: "positive",
    });
  }

  // Default if no outcomes
  if (outcomes.length === 0) {
    outcomes.push({
      title: "Baseline scenario - no active decisions",
      description: `Startup is operating at default parameters. Use the Decision Lab to simulate scenarios.`,
      impact: "neutral",
    });
  }

  return outcomes.slice(0, 6);
}

export default function SurvivalOutcomes({ outputs, inputs }: SurvivalOutcomesProps) {
  const outcomes = generateOutcomes(outputs, inputs);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Survival Outcomes
      </h2>
      <div className="flex flex-col gap-2">
        {outcomes.map((outcome, i) => (
          <div
            key={i}
            className={`rounded-lg border p-3 ${
              outcome.impact === "negative"
                ? "border-critical/20 bg-critical/5"
                : outcome.impact === "positive"
                  ? "border-safe/20 bg-safe/5"
                  : "border-border bg-muted/50"
            }`}
          >
            <h4
              className={`text-sm font-semibold ${
                outcome.impact === "negative"
                  ? "text-critical"
                  : outcome.impact === "positive"
                    ? "text-safe"
                    : "text-foreground"
              }`}
            >
              {outcome.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {outcome.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
