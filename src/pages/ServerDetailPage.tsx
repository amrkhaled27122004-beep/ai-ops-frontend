import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Thermometer,
  Clock,
  Brain,
  AlertTriangle,
  Activity,
  Server as ServerIcon,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Panel from '@/components/Panel';
import RiskGauge from '@/components/RiskGauge';
import { servers } from '@/lib/mock-data';
import {
  statusColor,
  statusBg,
  statusDot,
  riskColor,
  formatTime,
} from '@/lib/utils';

export default function ServerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const server = servers.find((s) => s.id === id);

  if (!server) {
    return (
      <div className="cyber-card p-12 text-center">
        <ServerIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500 mb-4">Server not found.</p>
        <Link to="/fleet" className="text-cyber-cyan hover:underline text-sm">
          Back to fleet
        </Link>
      </div>
    );
  }

  const metrics = [
    { icon: Cpu, label: 'CPU Usage', value: server.cpu, unit: '%', threshold: 85 },
    { icon: MemoryStick, label: 'Memory', value: server.memory, unit: '%', threshold: 80 },
    { icon: HardDrive, label: 'Disk', value: server.disk, unit: '%', threshold: 90 },
    { icon: Wifi, label: 'Network', value: server.network, unit: '%', threshold: 80 },
  ];

  const chartData = server.riskHistory.map((p) => ({
    time: formatTime(p.timestamp),
    risk: p.risk,
  }));

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => navigate('/fleet')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Fleet
      </button>

      {/* Server header */}
      <div className="cyber-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${statusBg(server.status)}`}>
              <ServerIcon className={`w-6 h-6 ${statusColor(server.status)}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{server.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-slate-500">{server.hostname}</span>
                <span className="text-xs font-mono text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-500">{server.region}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${statusDot(server.status)}`} />
                <span className={`text-xs font-mono uppercase tracking-wider ${statusColor(server.status)}`}>
                  {server.status}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-500">Uptime: {server.uptime}%</div>
            </div>
            <RiskGauge value={server.riskScore} size="md" label="Risk" />
          </div>
        </div>
      </div>

      {/* Live metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isOver = m.value > m.threshold;
          const isWarning = m.value > m.threshold * 0.8;
          const color = isOver ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-cyber-cyan';
          const barColor = isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-cyber-cyan';
          return (
            <div key={m.label} className="cyber-card cyber-card-hover p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-[10px] font-mono text-slate-600 uppercase">{m.label}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className={`text-2xl font-bold ${color}`}>{m.value}</span>
                <span className="text-xs text-slate-500 font-mono">{m.unit}</span>
              </div>
              <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${m.value}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk history chart + Temperature */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Risk History — 24h" icon={<Activity className="w-4 h-4" />} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskDetailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={server.riskScore > 60 ? '#f59e0b' : '#22d3ee'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={server.riskScore > 60 ? '#f59e0b' : '#22d3ee'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1424',
                  border: '1px solid #1a2740',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="risk"
                stroke={server.riskScore > 60 ? '#f59e0b' : '#22d3ee'}
                strokeWidth={2}
                fill="url(#riskDetailGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="System Vitals" icon={<Thermometer className="w-4 h-4" />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg/50">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Temperature</span>
              </div>
              <span className={`text-sm font-mono font-bold ${server.temperature > 70 ? 'text-red-400' : server.temperature > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {server.temperature}°C
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Uptime</span>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400">{server.uptime}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg/50">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Risk Score</span>
              </div>
              <span className={`text-sm font-mono font-bold ${riskColor(server.riskScore)}`}>{server.riskScore}/100</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg/50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Predictions</span>
              </div>
              <span className="text-sm font-mono font-bold text-cyber-cyan">{server.predictions.length} active</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* AI Predictions & Recommendations */}
      {server.predictions.length > 0 ? (
        <Panel title="AI Predictions & Recommendations" icon={<Brain className="w-4 h-4" />}>
          <div className="space-y-3">
            {server.predictions.map((pred, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  pred.confidence > 90
                    ? 'bg-red-500/5 border-red-500/20'
                    : pred.confidence > 80
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-cyber-cyan/5 border-cyber-cyan/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${pred.confidence > 90 ? 'text-red-400' : pred.confidence > 80 ? 'text-amber-400' : 'text-cyber-cyan'}`} />
                    <span className="text-sm font-semibold text-white">{pred.metric}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">
                      {pred.currentValue}% → {pred.predictedValue}%
                    </span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                      pred.confidence > 90 ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                      pred.confidence > 80 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                      'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30'
                    }`}>
                      {pred.confidence}% confidence
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-mono text-slate-400">
                    Threshold breach in <span className="text-cyber-amber">{pred.timeToThreshold}</span>
                  </span>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-cyber-bg/50">
                  <Brain className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300 leading-relaxed">{pred.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <Panel title="AI Predictions & Recommendations" icon={<Brain className="w-4 h-4" />}>
          <div className="flex flex-col items-center py-8">
            <Zap className="w-10 h-10 text-slate-600 mb-3" />
            <p className="text-sm text-slate-500">No active predictions for this server.</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
