'use client';

import { useMemo } from 'react';

interface ScenarioForecastProps {
  scenario: 'expected' | 'best' | 'worst';
  onScenarioChange: (scenario: 'expected' | 'best' | 'worst') => void;
  projections: number[];
  cash: number;
  burnRate: number;
}

export default function ScenarioForecast({
  scenario,
  onScenarioChange,
  projections,
  cash,
  burnRate,
}: ScenarioForecastProps) {
  // Find critical months
  const criticalMonth = useMemo(() => {
    return projections.findIndex((val) => val <= 0);
  }, [projections]);

  // Find break-even month (if applicable)
  const breakEvenMonth = burnRate <= 0 ? 0 : -1;

  // Chart data for simple visualization
  const chartHeight = 200;
  const minValue = Math.min(...projections, 0);
  const maxValue = Math.max(...projections, cash);
  const range = maxValue - minValue;

  const getChartBarHeight = (value: number) => {
    if (range === 0) return 0;
    return ((value - minValue) / range) * chartHeight;
  };

  const getBarColor = (index: number, value: number) => {
    if (value <= 0) return 'bg-red-500/70';
    if (index === criticalMonth) return 'bg-red-500/70';
    if (breakEvenMonth >= 0 && index <= breakEvenMonth) return 'bg-orange-500/50';
    return 'bg-gradient-to-t from-blue-500 to-cyan-400';
  };

  return (
    <div className="border border-slate-700 rounded-2xl p-8 backdrop-blur-sm bg-slate-900/40">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Scenario Forecast Engine</h2>
          <p className="text-sm text-slate-400">12-month cash projection</p>
        </div>

        {/* Scenario Toggles */}
        <div className="flex gap-2 flex-wrap">
          {['expected', 'best', 'worst'].map((s) => (
            <button
              key={s}
              onClick={() => onScenarioChange(s as 'expected' | 'best' | 'worst')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scenario === s
                  ? 'bg-orange-500/80 text-white border border-orange-400'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {s === 'expected' && '📊 Expected Case'}
              {s === 'best' && '📈 Best Case (+15%)'}
              {s === 'worst' && '📉 Worst Case (-15%)'}
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>Month by month cash position</span>
            <span>
              {breakEvenMonth >= 0 ? `Break-even: M${breakEvenMonth + 1}` : 'No break-even'}
              {criticalMonth >= 0 && ` | Collapse: M${criticalMonth + 1}`}
            </span>
          </div>

          {/* Bar Chart */}
          <div className="relative bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 min-h-64">
            <div className="flex items-end justify-between gap-1 h-56">
              {projections.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                  {/* Bar */}
                  <div className="w-full relative">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${getBarColor(index, value)}`}
                      style={{
                        height: `${getChartBarHeight(value)}px`,
                        minHeight: value > 0 ? '2px' : '0px',
                      }}
                    >
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 pointer-events-none z-10">
                        {index + 1}: ${(value / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </div>

                  {/* Month label */}
                  <div className="text-xs text-slate-500 text-center">
                    M{index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-4 bottom-0 flex flex-col justify-between text-xs text-slate-500 pointer-events-none pr-2">
              <div>${(maxValue / 1000).toFixed(0)}k</div>
              <div>${(minValue / 1000).toFixed(0)}k</div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-700 pt-4">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Current Position
            </div>
            <div className="text-sm font-semibold text-slate-200">
              ${(cash / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Projection Status
            </div>
            <div className="text-sm font-semibold">
              {criticalMonth >= 0 ? (
                <span className="text-red-400">💥 Collapse in M{criticalMonth + 1}</span>
              ) : (
                <span className="text-green-400">✓ Sustainable</span>
              )}
            </div>
          </div>
        </div>

        {/* TODO Hook */}
        <div className="text-xs text-slate-500 italic">
          {/* TODO: GSAP smooth chart morph on scenario toggle */}
        </div>
      </div>
    </div>
  );
}
