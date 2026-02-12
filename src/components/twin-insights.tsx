"use client";

export function TwinInsights() {
  return (
    <section
      aria-label="AI Twin Insights"
      className="rounded-2xl border border-dashed border-border bg-card/50 p-6"
    >
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        AI Twin Insights
      </h2>
      <span className="mb-5 inline-block rounded-full bg-accent/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
        Coming Soon
      </span>

      <div className="mt-4 flex flex-col gap-3">
        {/* TODO: GPT recommendations */}
        <InsightPlaceholder
          label="Smart Recommendations"
          description="AI-powered decision suggestions based on your burn trajectory"
        />
        {/* TODO: Monte Carlo risk simulation */}
        <InsightPlaceholder
          label="Monte Carlo Risk Simulation"
          description="Probabilistic survival modeling across 10,000 scenarios"
        />
        {/* TODO: Investor benchmarking */}
        <InsightPlaceholder
          label="Investor Benchmarking"
          description="Compare your runway metrics against stage-matched peers"
        />
      </div>
    </section>
  );
}

function InsightPlaceholder({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/50 p-4">
      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent/40" />
      <div>
        <p className="text-xs font-semibold text-card-foreground/60">
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
