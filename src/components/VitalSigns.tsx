import { useEffect, useState } from 'react';

interface VitalSignsProps {
  cash: number;
  burnRate: number;
  runwayMonths: number;
  survivalStatus: 'safe' | 'warning' | 'critical';
  statusColor: string;
}

export default function VitalSigns({
  cash,
  burnRate,
  runwayMonths,
  survivalStatus,
  statusColor,
}: VitalSignsProps) {
  const [animatedCash, setAnimatedCash] = useState(0);
  const [animatedBurn, setAnimatedBurn] = useState(0);
  const [animatedRunway, setAnimatedRunway] = useState(0);

  // Animate counter values
  useEffect(() => {
    const animateTo = (current: number, target: number, setCurrent: (val: number) => void, duration: number = 500) => {
      const increment = target / (duration / 30);
      let value = current;
      const interval = setInterval(() => {
        value += increment;
        if (value >= target) {
          setCurrent(target);
          clearInterval(interval);
        } else {
          setCurrent(Math.round(value));
        }
      }, 30);
    };

    animateTo(animatedCash, cash, setAnimatedCash);
    animateTo(animatedBurn, Math.abs(burnRate), setAnimatedBurn);
    animateTo(animatedRunway, Math.min(runwayMonths, 999), setAnimatedRunway);
  }, [cash, burnRate, runwayMonths]);

  const getStatusBgColor = () => {
    if (survivalStatus === 'safe') return 'bg-green-900/20 border-green-700/40';
    if (survivalStatus === 'warning') return 'bg-amber-900/20 border-amber-700/40';
    return 'bg-red-900/20 border-red-700/40 pulse-glow';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cash Remaining */}
      <div className="border border-slate-700 rounded-2xl p-6 backdrop-blur-sm bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-semibold">Cash Remaining</div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-3xl md:text-4xl font-bold text-slate-100">
            ${(animatedCash / 1000).toFixed(0)}k
          </div>
        </div>
        <div className="text-sm text-slate-400">
          Fuel for survival
        </div>
      </div>

      {/* Monthly Burn Rate */}
      <div className="border border-slate-700 rounded-2xl p-6 backdrop-blur-sm bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-semibold">Monthly Burn Rate</div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-3xl md:text-4xl font-bold" style={{ color: burnRate > 0 ? '#ef4444' : '#10b981' }}>
            {burnRate > 0 ? '-' : '+'} ${(Math.abs(animatedBurn) / 1000).toFixed(1)}k
          </div>
        </div>
        <div className="text-sm text-slate-400">
          {burnRate > 0 ? 'Losing runway' : 'Profitable'}
        </div>
      </div>

      {/* Runway Months */}
      <div className="border border-slate-700 rounded-2xl p-6 backdrop-blur-sm bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-semibold">Runway Months</div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-3xl md:text-4xl font-bold text-slate-100">
            {animatedRunway >= 999 ? '∞' : animatedRunway.toFixed(1)}
          </div>
          <div className="text-sm text-slate-400">months</div>
        </div>
        <div className="text-sm text-slate-400">
          Time to horizon
        </div>
      </div>

      {/* Survival Status */}
      <div className={`border rounded-2xl p-6 backdrop-blur-sm transition-all ${getStatusBgColor()}`}>
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-semibold">Status</div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColor }} />
          <div className="text-2xl font-bold" style={{ color: statusColor }}>
            {survivalStatus.charAt(0).toUpperCase() + survivalStatus.slice(1)}
          </div>
        </div>
        <div className="text-sm text-slate-400 mt-3">
          {survivalStatus === 'safe' && 'Healthy runway'}
          {survivalStatus === 'warning' && 'Act soon'}
          {survivalStatus === 'critical' && 'Immediate action'}
        </div>
      </div>
    </div>
  );
}
