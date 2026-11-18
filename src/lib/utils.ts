import type { ServerStatus, AlertSeverity } from '@/types';

export function statusColor(status: ServerStatus): string {
  switch (status) {
    case 'healthy':
      return 'text-emerald-400';
    case 'warning':
      return 'text-amber-400';
    case 'critical':
      return 'text-red-400';
    case 'offline':
      return 'text-slate-500';
  }
}

export function statusBg(status: ServerStatus): string {
  switch (status) {
    case 'healthy':
      return 'bg-emerald-500/10 border-emerald-500/30';
    case 'warning':
      return 'bg-amber-500/10 border-amber-500/30';
    case 'critical':
      return 'bg-red-500/10 border-red-500/30';
    case 'offline':
      return 'bg-slate-700/30 border-slate-600/30';
  }
}

export function statusDot(status: ServerStatus): string {
  switch (status) {
    case 'healthy':
      return 'bg-emerald-400';
    case 'warning':
      return 'bg-amber-400';
    case 'critical':
      return 'bg-red-400 animate-pulse';
    case 'offline':
      return 'bg-slate-600';
  }
}

export function severityColor(severity: AlertSeverity | 'info'): string {
  switch (severity) {
    case 'critical':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'high':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'medium':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    case 'low':
      return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    case 'info':
      return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  }
}

export function riskColor(risk: number): string {
  if (risk >= 80) return 'text-red-400';
  if (risk >= 60) return 'text-amber-400';
  if (risk >= 30) return 'text-yellow-400';
  return 'text-emerald-400';
}

export function riskBg(risk: number): string {
  if (risk >= 80) return 'bg-red-500';
  if (risk >= 60) return 'bg-amber-500';
  if (risk >= 30) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
