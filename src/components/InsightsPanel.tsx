export default function InsightsPanel() {
  return (
    <div className="border border-slate-700 rounded-2xl p-8 backdrop-blur-sm bg-slate-900/40">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Twin Insights</h2>
          <p className="text-sm text-slate-400">AI-powered survival intelligence</p>
        </div>

        {/* Coming Soon Banner */}
        <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-r from-orange-500/10 via-slate-800/50 to-blue-500/10 p-6">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, orange, transparent 50%), radial-gradient(circle at 80% 80%, blue, transparent 50%)',
          }} />
          <div className="relative space-y-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-100">🚀 Coming Soon</div>
              <p className="text-sm text-slate-400 mt-2">
                Advanced AI insights powered by digital twin simulation
              </p>
            </div>
          </div>
        </div>

        {/* Future Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* GPT Recommendations */}
          <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/20 opacity-60">
            <div className="flex gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <div className="text-sm font-semibold text-slate-300">GPT Recommendations</div>
                <div className="text-xs text-slate-500 mt-1">
                  AI-generated survival strategies
                </div>
              </div>
            </div>
            {/* TODO: Add GPT recommendations */}
          </div>

          {/* Monte Carlo Simulation */}
          <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/20 opacity-60">
            <div className="flex gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <div className="text-sm font-semibold text-slate-300">Monte Carlo Risk</div>
                <div className="text-xs text-slate-500 mt-1">
                  Probability of success modeling
                </div>
              </div>
            </div>
            {/* TODO: Add Monte Carlo risk simulation */}
          </div>

          {/* Investor Benchmarking */}
          <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/20 opacity-60">
            <div className="flex gap-3">
              <div className="text-2xl">📈</div>
              <div>
                <div className="text-sm font-semibold text-slate-300">Investor Benchmarks</div>
                <div className="text-xs text-slate-500 mt-1">
                  Compare to industry standards
                </div>
              </div>
            </div>
            {/* TODO: Add investor benchmarking */}
          </div>

          {/* Funding Events */}
          <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/20 opacity-60">
            <div className="flex gap-3">
              <div className="text-2xl">💼</div>
              <div>
                <div className="text-sm font-semibold text-slate-300">Funding Scenarios</div>
                <div className="text-xs text-slate-500 mt-1">
                  Model fundraising impact
                </div>
              </div>
            </div>
            {/* TODO: Add funding event modeling */}
          </div>
        </div>

        {/* Feature Roadmap */}
        <div className="border-t border-slate-700 pt-6">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">Future Capabilities</div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 text-slate-400">
              <span className="text-orange-400 mt-0.5">→</span>
              <span>Real-time AI analysis of survival scenarios</span>
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <span className="text-orange-400 mt-0.5">→</span>
              <span>Stochastic modeling with confidence intervals</span>
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <span className="text-orange-400 mt-0.5">→</span>
              <span>Payroll schedule integration & sensitivity analysis</span>
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <span className="text-orange-400 mt-0.5">→</span>
              <span>Multi-scenario comparison with funding events</span>
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <span className="text-orange-400 mt-0.5">→</span>
              <span>Churn & retention modeling for revenue stability</span>
            </li>
            {/* TODO hooks for AI integration */}
            {/* TODO: Integrate with GPT for recommendations */}
            {/* TODO: Add Monte Carlo risk simulation */}
            {/* TODO: Add investor benchmarking */}
          </ul>
        </div>

        {/* CTA */}
        <div className="border-t border-slate-700 pt-6">
          <p className="text-xs text-slate-400 italic">
            The digital twin learns your startup. Every decision, every scenario, every month. Run simulations before reality.
          </p>
        </div>
      </div>
    </div>
  );
}
