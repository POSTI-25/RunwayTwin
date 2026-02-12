"use client";

import { Bot, Lightbulb, ShieldAlert, TrendingDown } from "lucide-react";
import type { SimulationMetrics } from "@/lib/simulation";

interface AICopilotProps {
  metrics: SimulationMetrics;
}

export default function AICopilot({ metrics }: AICopilotProps) {
  const insights = [
    {
      icon: <ShieldAlert className="h-4 w-4 text-warning" />,
      text:
        metrics.status === "critical"
          ? "CRITICAL: Hiring now increases collapse probability by 42%. Immediate cost reduction recommended."
          : "Hiring now increases collapse probability by 22%. Consider delaying non-essential roles.",
    },
    {
      icon: <Lightbulb className="h-4 w-4 text-accent" />,
      text: "Safest lever: reduce fixed burn. Each $1K saved extends runway by ~0.8 months at current trajectory.",
    },
    {
      icon: <TrendingDown className="h-4 w-4 text-destructive" />,
      text:
        metrics.runwayMonths < 6
          ? "Revenue growth must exceed 12% MoM to avoid collapse. Current trajectory insufficient."
          : "Revenue growth rate is the most sensitive lever. A 5% improvement could extend break-even by 3 months.",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-accent/10 p-2.5">
          <Bot className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">
              AI Twin Copilot
            </h3>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Predictive insights from your digital twin
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4"
          >
            <div className="mt-0.5 shrink-0">{insight.icon}</div>
            <p className="text-sm leading-relaxed text-foreground/80">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
