interface DigitalTwinVisualizationProps {
  cash: number;
  burnRate: number;
  runwayMonths: number;
  survivalStatus: 'safe' | 'warning' | 'critical';
  maxCash: number;
  maxRunway: number;
  statusColor: string;
}

export default function DigitalTwinVisualization({
  cash,
  burnRate,
  runwayMonths,
  survivalStatus,
  maxCash,
  maxRunway,
  statusColor,
}: DigitalTwinVisualizationProps) {
  const cashPercentage = (cash / maxCash) * 100;
  const runwayPercentage = Math.min((runwayMonths / maxRunway) * 100, 100);

  return (
    <div className="border border-slate-700 rounded-2xl p-8 backdrop-blur-sm bg-slate-900/40 overflow-hidden">
      <div className="space-y-8">
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Digital Twin Status</h2>
          <p className="text-sm text-slate-400">Real-time mirror of your startup survival</p>
        </div>

        {/* Cash Tank Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-300">Cash Fuel Tank</label>
            <span className="text-xs text-slate-400">{cashPercentage.toFixed(1)}% full</span>
          </div>
          <div className="relative h-24 border-2 border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
            {/* Tank fill animation */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-blue-500 via-cyan-400 to-transparent transition-all duration-500"
              style={{
                height: `${cashPercentage}%`,
                opacity: 0.6,
              }}
            >
              {/* Fluid wave effect */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  animation: 'slide-left 3s linear infinite',
                }}
              />
            </div>
            {/* Tank labels */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 text-xs text-slate-300 pointer-events-none">
              <div>{maxCash / 1000}k</div>
              <div>0</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {/* TODO: GSAP animate tank level when burn changes */}
            Current: ${(cash / 1000).toFixed(0)}k | Burn: ${(Math.abs(burnRate) / 1000).toFixed(1)}k/month
          </p>
        </div>

        {/* Runway Timeline Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-300">Runway Timeline</label>
            <span className="text-xs text-slate-400">{runwayMonths >= 999 ? '∞' : runwayMonths.toFixed(1)} months</span>
          </div>
          <div className="relative h-8 border-2 border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
            {/* Runway fill */}
            <div
              className="absolute inset-y-0 left-0 transition-all duration-500 flex items-center"
              style={{
                width: `${runwayPercentage}%`,
                background: survivalStatus === 'critical'
                  ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                  : survivalStatus === 'warning'
                    ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
              }}
            >
              {/* Glow effect for critical */}
              {survivalStatus === 'critical' && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                />
              )}
            </div>
            {/* Timeline markers */}
            {[0, 3, 6, 12].map((month) => (
              <div
                key={month}
                className="absolute top-0 h-full border-l border-slate-600/30 text-xs text-slate-500 flex items-center justify-center"
                style={{
                  left: `${(month / maxRunway) * 100}%`,
                  width: '1px',
                  paddingLeft: '4px',
                  pointerEvents: 'none',
                }}
              >
                <span className="absolute top-full mt-1 text-slate-400">{month}m</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            {/* TODO: GSAP pulse critical warning state */}
            {runwayMonths < 3 ? '⚠️ Critical: Less than 3 months' : runwayMonths < 6 ? '⚠️ Warning: Less than 6 months' : '✓ Safe: Healthy runway'}
          </p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Burn Direction</div>
            <div className={`text-sm font-medium ${burnRate > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {burnRate > 0 ? '📉 Negative' : '📈 Positive'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">System Status</div>
            <div className="text-sm font-medium" style={{ color: statusColor }}>
              ● {survivalStatus.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
