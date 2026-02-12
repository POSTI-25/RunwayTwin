"use client";

interface DecisionLabProps {
  onHire: () => void;
  onMarketing: () => void;
  onCut: () => void;
  onReset: () => void;
  hires: number;
  marketingBoosts: number;
  costCuts: number;
}

function DecisionButton({
  label,
  impact,
  onClick,
  count,
  variant,
}: {
  label: string;
  impact: string;
  onClick: () => void;
  count: number;
  variant: "burn" | "save";
}) {
  const base =
    "group relative flex flex-col items-start gap-1 rounded-2xl border px-5 py-4 text-left transition-all duration-200 cursor-pointer";
  const styles =
    variant === "burn"
      ? "border-border bg-card hover:border-destructive/40 hover:bg-destructive/5"
      : "border-border bg-card hover:border-primary/40 hover:bg-primary/5";
  const impactColor =
    variant === "burn" ? "text-destructive" : "text-primary";

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      <span className="text-sm font-semibold text-card-foreground">
        {label}
      </span>
      <span className={`text-xs font-mono font-medium ${impactColor}`}>
        {impact}
      </span>
      {count > 0 && (
        <span className="absolute top-3 right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
          x{count}
        </span>
      )}
    </button>
  );
}

export function DecisionLab({
  onHire,
  onMarketing,
  onCut,
  onReset,
  hires,
  marketingBoosts,
  costCuts,
}: DecisionLabProps) {
  return (
    <section
      aria-label="Decision Lab"
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Decision Lab
        </h2>
        <button
          onClick={onReset}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-card-foreground cursor-pointer"
        >
          Reset
        </button>
      </div>
      <p className="mb-5 text-xs text-muted-foreground italic">
        Test Reality Before It Happens
      </p>

      <div className="flex flex-col gap-3">
        <DecisionButton
          label="Hire Engineer"
          impact="+$5,000 burn/mo"
          onClick={onHire}
          count={hires}
          variant="burn"
        />
        <DecisionButton
          label="Increase Marketing"
          impact="+$2,000 burn/mo"
          onClick={onMarketing}
          count={marketingBoosts}
          variant="burn"
        />
        <DecisionButton
          label="Reduce Costs"
          impact="-$1,500 burn/mo"
          onClick={onCut}
          count={costCuts}
          variant="save"
        />
      </div>

      <p className="mt-5 text-center text-[11px] text-muted-foreground">
        Experiment safely. Survive longer.
      </p>
    </section>
  );
}
