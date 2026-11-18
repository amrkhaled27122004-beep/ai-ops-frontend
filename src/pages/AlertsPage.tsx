import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import Panel from '@/components/Panel';
import { alerts as initialAlerts } from '@/lib/mock-data';
import type { Alert, AlertStatus, AlertSeverity } from '@/types';
import { severityColor, formatTimeAgo } from '@/lib/utils';

type StatusFilter = 'all' | AlertStatus;
type SevFilter = 'all' | AlertSeverity;

export default function AlertsPage() {
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sevFilter, setSevFilter] = useState<SevFilter>('all');

  const filtered = alertList.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.serverName.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSev = sevFilter === 'all' || a.severity === sevFilter;
    return matchesSearch && matchesStatus && matchesSev;
  });

  const activeCount = alertList.filter((a) => a.status === 'active').length;
  const ackCount = alertList.filter((a) => a.status === 'acknowledged').length;
  const resolvedCount = alertList.filter((a) => a.status === 'resolved').length;

  const updateAlertStatus = (id: string, status: AlertStatus) => {
    setAlertList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const statusFilters: { label: string; value: StatusFilter; count: number }[] = [
    { label: 'All', value: 'all', count: alertList.length },
    { label: 'Active', value: 'active', count: activeCount },
    { label: 'Acknowledged', value: 'acknowledged', count: ackCount },
    { label: 'Resolved', value: 'resolved', count: resolvedCount },
  ];

  const sevFilters: { label: string; value: SevFilter }[] = [
    { label: 'All Severities', value: 'all' },
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Predictive Alerts</h1>
        <p className="text-sm text-slate-500 mt-1">
          {activeCount} active · {ackCount} acknowledged · {resolvedCount} resolved
        </p>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: activeCount, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Acknowledged', value: ackCount, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Resolved', value: resolvedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Total', value: alertList.length, color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10 border-cyber-cyan/20' },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-lg border ${s.bg}`}>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts..."
            className="w-full pl-10 pr-4 py-2.5 bg-cyber-surface border border-cyber-border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/50 transition-all"
          />
        </div>
        <select
          value={sevFilter}
          onChange={(e) => setSevFilter(e.target.value as SevFilter)}
          className="px-3 py-2.5 bg-cyber-surface border border-cyber-border rounded-lg text-sm text-slate-300 focus:outline-none focus:border-cyber-cyan/50 transition-all"
        >
          {sevFilters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-500 mr-1" />
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f.value
                  ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                  : 'text-slate-400 hover:text-white border border-cyber-border hover:border-cyber-border-bright'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((alert) => (
            <AlertRow key={alert.id} alert={alert} onStatusChange={updateAlertStatus} />
          ))
        ) : (
          <div className="cyber-card p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No alerts match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertRow({
  alert,
  onStatusChange,
}: {
  alert: Alert;
  onStatusChange: (id: string, status: AlertStatus) => void;
}) {
  return (
    <div className={`cyber-card cyber-card-hover p-5 ${alert.status === 'active' && alert.severity === 'critical' ? 'cyber-glow-red' : ''}`}>
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Left: severity + info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${severityColor(alert.severity)}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${severityColor(alert.severity)}`}>
                {alert.severity}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                alert.status === 'active' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                alert.status === 'acknowledged' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {alert.status}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-2">{alert.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-slate-500">{alert.serverName}</span>
              <span className="text-xs font-mono text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-500">{alert.metric}: {alert.current}% / {alert.threshold}%</span>
              <span className="text-xs font-mono text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-500">{formatTimeAgo(alert.createdAt)}</span>
            </div>
            <div className="flex items-start gap-2 mt-3 p-2.5 rounded-lg bg-cyber-bg/50 border border-cyber-cyan/10">
              <ArrowRight className="w-3.5 h-3.5 text-cyber-cyan flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400">
                <span className="text-cyber-cyan font-mono">Prediction: </span>
                {alert.prediction}
              </p>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {alert.status === 'active' && (
            <button
              onClick={() => onStatusChange(alert.id, 'acknowledged')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium hover:bg-amber-500/20 transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              Acknowledge
            </button>
          )}
          {alert.status !== 'resolved' && (
            <button
              onClick={() => onStatusChange(alert.id, 'resolved')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
