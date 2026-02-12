"use client";

import { type StartupInputs } from "@/lib/engine";

interface DecisionLabProps {
  inputs: StartupInputs;
  onChange: (inputs: StartupInputs) => void;
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  accent = "accent",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  accent?: "accent" | "warning" | "critical";
}) {
  const accentColor =
    accent === "critical"
      ? "accent-red-500"
      : accent === "warning"
        ? "accent-amber-500"
        : "accent-emerald-500";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
        <span className="font-mono text-xs font-bold tabular-nums text-foreground">
          {unit === "$"
            ? `$${value.toLocaleString()}`
            : unit === "%"
              ? `${value}%`
              : value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted ${accentColor} [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-md`}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  unit,
  onChange,
  min = 0,
  max = 100000000,
  step = 1000,
}: {
  label: string;
  value: number;
  unit?: string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {unit === "$" && (
          <span className="text-xs font-mono text-muted-foreground">$</span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground tabular-nums outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
        />
        {unit === "%" && (
          <span className="text-xs font-mono text-muted-foreground">%</span>
        )}
      </div>
    </div>
  );
}

export default function DecisionLab({ inputs, onChange }: DecisionLabProps) {
  const update = (key: keyof StartupInputs, value: number) => {
    onChange({ ...inputs, [key]: value });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Decision Lab
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Test reality before it happens
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Baseline Financials */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
            Baseline Financials
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Starting Cash"
              value={inputs.baseline_cash}
              unit="$"
              onChange={(v) => update("baseline_cash", v)}
              step={10000}
            />
            <NumberField
              label="Monthly Revenue"
              value={inputs.baseline_revenue}
              unit="$"
              onChange={(v) => update("baseline_revenue", v)}
              step={1000}
            />
            <NumberField
              label="Fixed Expenses"
              value={inputs.baseline_fixed_expenses}
              unit="$"
              onChange={(v) => update("baseline_fixed_expenses", v)}
              step={1000}
            />
            <SliderField
              label="Growth Rate"
              value={Math.round(inputs.baseline_growth_rate * 100)}
              min={-20}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => update("baseline_growth_rate", v / 100)}
            />
            <SliderField
              label="Gross Margin"
              value={Math.round(inputs.gross_margin * 100)}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => update("gross_margin", v / 100)}
            />
            <NumberField
              label="Avg Cost per Hire"
              value={inputs.avg_cost_per_hire}
              unit="$"
              onChange={(v) => update("avg_cost_per_hire", v)}
              step={500}
            />
          </div>
        </div>

        {/* Decision Levers */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-warning mb-3">
            Decision Levers
          </h3>
          <div className="flex flex-col gap-4">
            <SliderField
              label="Hire Engineers"
              value={inputs.employees_hired}
              min={0}
              max={20}
              step={1}
              onChange={(v) => update("employees_hired", v)}
            />
            <SliderField
              label="Marketing Spend"
              value={inputs.marketing_spend}
              min={0}
              max={50000}
              step={500}
              unit="$"
              onChange={(v) => update("marketing_spend", v)}
              accent="warning"
            />
            <SliderField
              label="Pricing Change"
              value={inputs.pricing_change_percent}
              min={-50}
              max={50}
              step={1}
              unit="%"
              onChange={(v) => update("pricing_change_percent", v)}
            />
            <SliderField
              label="Cost Cut"
              value={inputs.cost_cut_percent}
              min={0}
              max={50}
              step={1}
              unit="%"
              onChange={(v) => update("cost_cut_percent", v)}
            />
            <SliderField
              label="Revenue Shock"
              value={inputs.revenue_shock_percent}
              min={-80}
              max={50}
              step={1}
              unit="%"
              onChange={(v) => update("revenue_shock_percent", v)}
              accent="critical"
            />
            <SliderField
              label="Market Index"
              value={Math.round(inputs.market_index * 100)}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => update("market_index", v / 100)}
            />
          </div>
        </div>

        {/* Fundraising */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
            Fundraising & Loans
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Equity Raised"
              value={inputs.equity_raised}
              unit="$"
              onChange={(v) => update("equity_raised", v)}
              step={10000}
            />
            <NumberField
              label="Loan Taken"
              value={inputs.loan_taken}
              unit="$"
              onChange={(v) => update("loan_taken", v)}
              step={10000}
            />
            <SliderField
              label="Interest Rate"
              value={Math.round(inputs.interest_rate * 100)}
              min={0}
              max={30}
              step={0.5}
              unit="%"
              onChange={(v) => update("interest_rate", v / 100)}
              accent="warning"
            />
            <NumberField
              label="Team Size"
              value={inputs.total_team_size}
              onChange={(v) => update("total_team_size", v)}
              min={1}
              max={500}
              step={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
