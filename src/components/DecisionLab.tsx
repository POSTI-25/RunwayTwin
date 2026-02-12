interface DecisionLabProps {
  onDecision: (type: string) => void;
  currentCosts: {
    fixed: number;
    variable: number;
  };
}

export default function DecisionLab({ onDecision, currentCosts }: DecisionLabProps) {
  return (
    <div className="border border-slate-700 rounded-2xl p-8 backdrop-blur-sm bg-slate-900/40">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Decision Lab</h2>
          <p className="text-sm text-slate-400">Test reality before it happens</p>
        </div>

        {/* Current Costs Display */}
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Fixed Expenses</span>
            <span className="font-semibold text-slate-200">${currentCosts.fixed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Variable Costs</span>
            <span className="font-semibold text-slate-200">${currentCosts.variable.toLocaleString()}</span>
          </div>
          <div className="border-t border-slate-700/50 pt-2 flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">Total Monthly</span>
            <span className="text-slate-100">${(currentCosts.fixed + currentCosts.variable).toLocaleString()}</span>
          </div>
        </div>

        {/* Decision Buttons */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">Actions</div>

          {/* Hire Decision */}
          <button
            onClick={() => onDecision('hire')}
            className="w-full group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/40 p-4 text-left transition-all hover:border-orange-500/50 hover:bg-slate-800/60 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/0 transition-all" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-100 group-hover:text-orange-400 transition-colors">
                  ➕ Hire Engineer
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  +$5,000 monthly burn
                </div>
              </div>
              <span className="text-xl group-hover:scale-110 transition-transform">🚀</span>
            </div>
          </button>

          {/* Marketing Decision */}
          <button
            onClick={() => onDecision('marketing')}
            className="w-full group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/40 p-4 text-left transition-all hover:border-orange-500/50 hover:bg-slate-800/60 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/0 transition-all" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-100 group-hover:text-orange-400 transition-colors">
                  ➕ Increase Marketing
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  +$2,000 monthly burn
                </div>
              </div>
              <span className="text-xl group-hover:scale-110 transition-transform">📈</span>
            </div>
          </button>

          {/* Reduce Costs Decision */}
          <button
            onClick={() => onDecision('reduce')}
            className="w-full group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/40 p-4 text-left transition-all hover:border-green-500/50 hover:bg-slate-800/60 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-green-500/5 group-hover:to-green-500/0 transition-all" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-100 group-hover:text-green-400 transition-colors">
                  ✂️ Reduce Costs
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  -$1,500 monthly expenses
                </div>
              </div>
              <span className="text-xl group-hover:scale-110 transition-transform">💰</span>
            </div>
          </button>
        </div>

        {/* Microcopy */}
        <div className="border-t border-slate-700 pt-4">
          <p className="text-xs text-slate-400 italic">
            "Experiment safely. Survive longer."
          </p>
        </div>
      </div>
    </div>
  );
}
