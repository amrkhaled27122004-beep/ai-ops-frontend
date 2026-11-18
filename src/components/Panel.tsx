import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Panel({ title, icon, action, children, className = '' }: PanelProps) {
  return (
    <div className={`cyber-card ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          {icon && <span className="text-cyber-cyan">{icon}</span>}
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
