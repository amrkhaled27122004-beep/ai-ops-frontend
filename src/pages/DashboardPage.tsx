import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
} from 'recharts';
import {
  Server as ServerIcon,
  AlertTriangle,
  Activity,
  TrendingUp,
  Zap,
  ChevronRight,
  Brain,
  ShieldAlert,
  Clock,
  Cpu,
  Network,
} from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import Panel from '@/components/Panel';
import ServerCard from '@/components/ServerCard';
import RiskGauge from '@/components/RiskGauge';
import {
  servers,
  alerts,
  activityStream,
  riskTrend,
  serviceHealth,
} from '@/lib/mock-data';
import {
  statusColor,
  statusBg,
  statusDot,
  severityColor,
  riskColor,
  formatTimeAgo,
  formatTime,
} from '@/lib/utils';

export default function DashboardPage() {
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const criticalCount = servers.filter((s) => s.status === 'critical').length;
  const warningCount = servers.filter((s) => s.status === 'warning').length;
  const healthyCount = servers.filter((s) => s.status === 'healthy').length;
  const avgRisk = Math.round(servers.reduce((sum, s) => sum + s.riskScore, 0) / servers.length);
  const focusServers = [...servers].sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);

  const chartData = riskTrend.map((p) => ({
    time: formatTime(p.timestamp),
    risk: p.fleetRisk,
    critical: p.criticalCount,
    warning: p.warningCount,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time fleet overview — {servers.length} servers across 4 regions
          </p>
        </div>
        <Link
          to="/simulator"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 text-sm font-medium hover:bg-cyber-cyan/20 transition-all"
        >
          <Zap className="w-4 h-4" />
          Launch Simulator
        </Link>
      </div>

      {/* Top metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Fleet Risk Score"
          value={avgRisk}
          trend="up"
          trendValue="+8% vs last 24h"
          icon={<ShieldAlert className="w-5 h-5" />}
          accent={avgRisk > 60 ? 'amber' : 'cyan'}
        />
        <MetricCard
          label="Active Alerts"
          value={activeAlerts.length}
          trend="up"
          trendValue={`${criticalCount} critical`}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent={activeAlerts.length > 3 ? 'red' : 'amber'}
        />
        <MetricCard
          label="Healthy Servers"
          value={healthyCount}
          unit={`/ ${servers.length}`}
          trend="down"
          trendValue={`${warningCount} warnings`
          }
          icon={<ServerIcon className="w-5 h-5" />}
          accent="green"
        />
        <MetricCard
          label="Avg Response Time"
          value="142"
          unit="ms"
          trend="up"
          trendValue="+15% from baseline"
          icon={<Activity className="w-5 h-5" />}
          accent="cyan"
        />
      </div>

      {/* Risk trend chart + Fleet risk gauge */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel
          title="Fleet Risk Trend — 24h"
          icon={<TrendingUp className="w-4 h-4" />}
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-cyber-cyan" /> Risk
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Critical
              </span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" />
              <XAxis
                dataKey="time"
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1424',
                  border: '1px solid #1a2740',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#riskGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Fleet Risk Distribution" icon={<Brain className="w-4 h-4" />}>
          <div className="flex flex-col items-center gap-4">
            <RiskGauge value={avgRisk} size="lg" label="Avg Risk" />
            <div className="w-full space-y-2">
              {[
                { label: 'Critical', count: criticalCount, color: 'text-red-400', bg: 'bg-red-500' },
                { label: 'Warning', count: warningCount, color: 'text-amber-400', bg: 'bg-amber-500' },
                { label: 'Healthy', count: healthyCount, color: 'text-emerald-400', bg: 'bg-emerald-500' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${s.bg}`} />
                  <span className="text-sm text-slate-400 flex-1">{s.label}</span>
                  <span className={`text-sm font-mono font-bold ${s.color}`}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Service health + Activity stream */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Service Health" icon={<Network className="w-4 h-4" />}>
          <div className="space-y-2">
            {serviceHealth.map((svc) => (
              <div
                key={svc.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-cyber-bg/50 border border-cyber-border hover:border-cyber-cyan/20 transition-all"
              >
                <div className={`w-2 h-2 rounded-full ${statusDot(svc.status)}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{svc.name}</div>
                  <div className="text-xs font-mono text-slate-500">
                    {svc.latency}ms · {svc.errorRate}% err · {svc.throughput.toLocaleString()} rps
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${statusBg(svc.status)} ${statusColor(svc.status)}`}>
                  {svc.status}
                </span>
                <span className="text-xs font-mono text-slate-500">{svc.instances}x</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Activity Stream" icon={<Activity className="w-4 h-4" />}>
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
            {activityStream.map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${severityColor(event.severity)}`}>
                  {event.type === 'alert' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : event.type === 'recovery' ? (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  ) : event.type === 'deployment' ? (
                    <Cpu className="w-3.5 h-3.5" />
                  ) : event.type === 'scaling' ? (
                    <ServerIcon className="w-3.5 h-3.5" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 leading-snug">{event.message}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-600">{event.serverName}</span>
                    <span className="text-[10px] font-mono text-slate-600">·</span>
                    <span className="text-[10px] font-mono text-slate-600">{formatTimeAgo(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Focus servers + Critical alert count trend */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel
          title="Focus Servers — Highest Risk"
          icon={<ServerIcon className="w-4 h-4" />}
          className="lg:col-span-2"
          action={
            <Link to="/fleet" className="text-xs text-cyber-cyan hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          }
        >
          <div className="grid sm:grid-cols-2 gap-3">
            {focusServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        </Panel>

        <Panel title="Alert Velocity" icon={<Clock className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1424',
                  border: '1px solid #1a2740',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="warning" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Critical
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Warning
            </span>
          </div>
        </Panel>
      </div>
    </div>
  );
}
