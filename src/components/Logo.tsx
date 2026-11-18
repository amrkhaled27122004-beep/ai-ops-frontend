import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { box: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-2xl', sub: 'text-xs' },
  };
  const s = sizes[size];

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className={`${s.box} rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-teal flex items-center justify-center cyber-glow transition-transform group-hover:scale-105`}>
        <Cpu className={`${s.icon} text-cyber-bg`} />
      </div>
      <div>
        <div className={`font-bold text-white ${s.text} tracking-wide`}>AI Ops</div>
        <div className={`text-slate-500 font-mono ${s.sub} uppercase tracking-widest`}>Operations Platform</div>
      </div>
    </Link>
  );
}
