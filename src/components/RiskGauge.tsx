import { riskColor, riskBg } from '@/lib/utils';

interface RiskGaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function RiskGauge({ value, size = 'md', label }: RiskGaugeProps) {
  const dimensions = {
    sm: { box: 'w-16 h-16', text: 'text-base', stroke: 6, radius: 28 },
    md: { box: 'w-24 h-24', text: 'text-2xl', stroke: 8, radius: 42 },
    lg: { box: 'w-32 h-32', text: 'text-3xl', stroke: 10, radius: 56 },
  };
  const d = dimensions[size];
  const circumference = 2 * Math.PI * d.radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${d.box}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={d.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={d.stroke}
            className="text-cyber-border"
          />
          <circle
            cx="50"
            cy="50"
            r={d.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={d.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${riskColor(value)} transition-all duration-700`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${riskColor(value)} ${d.text}`}>{value}</span>
        </div>
      </div>
      {label && <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{label}</span>}
    </div>
  );
}
