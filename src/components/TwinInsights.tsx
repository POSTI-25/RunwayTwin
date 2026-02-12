"use client";

import { type TwinOutputs } from "@/lib/engine";

interface TwinInsightsProps {
  outputs: TwinOutputs;
}

function generateInsights(outputs: TwinOutputs): string[] {
  const insights: string[] = [];

  if (outputs.burn_sensitivity_index > 0.5) {
    insights.push("Your burn sensitivity is high - small revenue changes have outsized impact on runway.");
  }

  if (outputs.runway_months < 6 && outputs.runway_months > 0) {
    insights.push("Runway is below 6 months. Consider fundraising or aggressive cost optimization.");
  }

  if (outputs.debt_to_cash_ratio > 0.4) {
    insights.push("Debt is consuming a significant share of your cash position. Prioritize debt reduction.");
  }

  if (outputs.market_dependency_index > 0.5) {
    insights.push("High market dependency detected. Diversify revenue streams to reduce external risk.");
  }

  if (outputs.revenue_per_employee < 3000 && outputs.total_team_size > 5) {
    insights.push("Revenue per employee is low. Team efficiency may need improvement before scaling.");
  }

  if (outputs.is_break_even_achieved) {
    insights.push("Congratulations - you're past break-even. Focus on sustainable growth and margin expansion.");
  }

  if (outputs.survival_probability >= 80) {
    insights.push("Strong survival probability. Your financial fundamentals are healthy.");
  }

  if (insights.length === 0) {
    insights.push("All indicators nominal. Continue monitoring as decisions are applied.");
  }

  return insights.slice(0, 4);
}

export default function TwinInsights({ outputs }: TwinInsightsProps) {
  const insights = generateInsights(outputs);

  return (
    <div className="rounded-xl border border-accent/10 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Twin Insights
        </h2>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">
          AI-Powered
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="text-accent"
              >
                <circle cx="5" cy="5" r="2" fill="currentColor" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
