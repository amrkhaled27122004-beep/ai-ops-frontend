import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  accent?: 'cyan' | 'amber' | 'red' | 'green';
}

export default function MetricCard({
  label,
  value,
  unit,
  trend = 'neutral',
  trendValue,
  icon,
  accent = 'cyan',
}: MetricCardProps) {
  const accentColors = {
    cyan: 'text-cyber-cyan',
    amber: 'text-cyber-amber',
    red: 'text-cyber-red',
    green: 'text-cyber-green',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-red-400'
      : trend === 'down'
        ? 'text-emerald-400'
        : 'text-slate-500';

  return (
    <div className="cyber-card cyber-card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500">{label}</span>
        {icon && <span className={accentColors[accent]}>{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${accentColors[accent]}`}>{value}</span>
        {unit && <span className="text-sm text-slate-500 font-mono">{unit}</span>}
      </div>
      {trendValue && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-mono ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          {trendValue}
        </div>
      )}
    </div>
  );
}
