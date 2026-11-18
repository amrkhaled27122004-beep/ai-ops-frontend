import { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Square,
  RotateCcw,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Activity,
  AlertTriangle,
  Brain,
  Clock,
  TrendingUp,
  Server as ServerIcon,
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
import { riskColor } from '@/lib/utils';
import type { IncidentScenario } from '@/types';

interface SimState {
  running: boolean;
  scenario: IncidentScenario | null;
  tick: number;
  serverId: string;
  metrics: { cpu: number; memory: number; disk: number; network: number; risk: number };
  history: { tick: number; risk: number; cpu: number; memory: number; disk: number }[];
  log: { time: string; message: string; severity: 'info' | 'warning' | 'critical' }[];
}

const scenarios: {
  id: IncidentScenario;
  label: string;
  description: string;
  icon: typeof Cpu;
  color: string;
  target: keyof Pick<SimState['metrics'], 'cpu' | 'memory' | 'disk' | 'network'>;
  rate: number;
}[] = [
  {
    id: 'memory_leak',
    label: 'Memory Leak',
    description: 'Simulates a gradual memory leak with linear growth toward OOM',
    icon: MemoryStick,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    target: 'memory',
    rate: 3,
  },
  {
    id: 'cpu_spike',
    label: 'CPU Spike',
    description: 'Simulates a sudden CPU saturation from a runaway process',
    icon: Cpu,
    color: 'text-red-400 border-red-500/30 bg-red-500/10',
    target: 'cpu',
    rate: 5,
  },
  {
    id: 'disk_exhaustion',
    label: 'Disk Exhaustion',
    description: 'Simulates rapid disk fill from uncontrolled log generation',
    icon: HardDrive,
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    target: 'disk',
    rate: 4,
  },
  {
    id: 'latency_surge',
    label: 'Latency Surge',
    description: 'Simulates network latency buildup from cascading connection timeouts',
    icon: Wifi,
    color: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10',
    target: 'network',
    rate: 6,
  },
];

function getRecommendation(scenario: IncidentScenario, risk: number): string {
  if (risk < 40) return 'Monitoring. Metrics trending upward but within safe parameters.';
  if (risk < 60) return `Early warning: ${scenario.replace('_', ' ')} pattern detected. Prepare remediation plan.`;
  if (risk < 80) {
    switch (scenario) {
      case 'memory_leak':
        return 'ACTION REQUIRED: Restart affected services to release leaked memory. Investigate root cause in application heap profiling.';
      case 'cpu_spike':
        return 'ACTION REQUIRED: Identify and throttle runaway process. Consider scaling horizontally or deploying CPU limits.';
      case 'disk_exhaustion':
        return 'ACTION REQUIRED: Initiate emergency log rotation and archiving. Clear temporary files and old backups.';
      case 'latency_surge':
        return 'ACTION REQUIRED: Check upstream dependencies. Increase connection pool size. Enable circuit breakers to prevent cascade.';
    }
  }
  switch (scenario) {
    case 'memory_leak':
      return 'CRITICAL: OOM kill imminent. Immediate service restart required. Enable memory auto-scaling as long-term fix.';
    case 'cpu_spike':
      return 'CRITICAL: CPU saturation causing query timeouts. Scale out immediately or shed non-critical load.';
    case 'disk_exhaustion':
      return 'CRITICAL: Disk full in minutes. Emergency cleanup required. Enable log rotation and alert DevOps team.';
    case 'latency_surge':
      return 'CRITICAL: Latency cascade detected. Enable circuit breakers NOW. Isolate affected services to prevent spread.';
  }
}

export default function IncidentSimulatorPage() {
  const [selectedServerId, setSelectedServerId] = useState(servers[0].id);
  const [sim, setSim] = useState<SimState>({
    running: false,
    scenario: null,
    tick: 0,
    serverId: servers[0].id,
    metrics: { cpu: servers[0].cpu, memory: servers[0].memory, disk: servers[0].disk, network: servers[0].network, risk: servers[0].riskScore },
    history: [],
    log: [],
  });

  const selectedServer = servers.find((s) => s.id === selectedServerId)!;

  useEffect(() => {
    if (!sim.running || !sim.scenario) return;

    const interval = setInterval(() => {
      setSim((prev) => {
        if (!prev.scenario) return prev;
        const scenario = scenarios.find((s) => s.id === prev.scenario);
        if (!scenario) return prev;

        const newMetrics = { ...prev.metrics };
        const target = scenario.target;
        newMetrics[target] = Math.min(100, newMetrics[target] + scenario.rate);

        const avg = (newMetrics.cpu + newMetrics.memory + newMetrics.disk) / 3;
        newMetrics.risk = Math.min(100, Math.round((avg + newMetrics[target]) / 2));

        const newTick = prev.tick + 1;
        const newEntry = {
          tick: newTick,
          risk: newMetrics.risk,
          cpu: newMetrics.cpu,
          memory: newMetrics.memory,
          disk: newMetrics.disk,
        };
        const newHistory = [...prev.history, newEntry].slice(-30);

        const logMessages: SimState['log'] = [];
        if (newMetrics.risk >= 80 && prev.metrics.risk < 80) {
          logMessages.push({
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            message: `CRITICAL threshold breached — ${scenario.label} risk at ${newMetrics.risk}`,
            severity: 'critical',
          });
        } else if (newMetrics.risk >= 60 && prev.metrics.risk < 60) {
          logMessages.push({
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            message: `Warning: ${scenario.label} escalating — risk at ${newMetrics.risk}`,
            severity: 'warning',
          });
        } else if (newTick % 5 === 0) {
          logMessages.push({
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            message: `Tick ${newTick}: ${target} at ${newMetrics[target]}%, risk at ${newMetrics.risk}`,
            severity: 'info',
          });
        }

        return {
          ...prev,
          tick: newTick,
          metrics: newMetrics,
          history: newHistory,
          log: [...logMessages, ...prev.log].slice(0, 20),
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [sim.running, sim.scenario]);

  const startSimulation = (scenario: IncidentScenario) => {
    const server = servers.find((s) => s.id === selectedServerId)!;
    setSim({
      running: true,
      scenario,
      tick: 0,
      serverId: selectedServerId,
      metrics: { cpu: server.cpu, memory: server.memory, disk: server.disk, network: server.network, risk: server.riskScore },
      history: [{ tick: 0, risk: server.riskScore, cpu: server.cpu, memory: server.memory, disk: server.disk }],
      log: [{
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: `Simulation started: ${scenario.replace('_', ' ')} on ${server.name}`,
        severity: 'info',
      }],
    });
  };

  const stopSimulation = () => {
    setSim((prev) => ({
      ...prev,
      running: false,
      log: [{
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: `Simulation stopped at tick ${prev.tick}. Final risk: ${prev.metrics.risk}`,
        severity: 'info',
      }, ...prev.log],
    }));
  };

  const resetSimulation = () => {
    const server = servers.find((s) => s.id === selectedServerId)!;
    setSim({
      running: false,
      scenario: null,
      tick: 0,
      serverId: selectedServerId,
      metrics: { cpu: server.cpu, memory: server.memory, disk: server.disk, network: server.network, risk: server.riskScore },
      history: [],
      log: [],
    });
  };

  const chartData = sim.history.map((h) => ({
    tick: `T${h.tick}`,
    risk: h.risk,
    cpu: h.cpu,
    memory: h.memory,
    disk: h.disk,
  }));

  const currentScenario = sim.scenario ? scenarios.find((s) => s.id === sim.scenario) : null;
  const recommendation = sim.scenario ? getRecommendation(sim.scenario, sim.metrics.risk) : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Incident Simulator</h1>
        <p className="text-sm text-slate-500 mt-1">
          Test your response to predicted failure scenarios in a controlled environment.
        </p>
      </div>

      {/* Server selector + scenario cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Target Server" icon={<ServerIcon className="w-4 h-4" />}>
          <select
            value={selectedServerId}
            onChange={(e) => {
              setSelectedServerId(e.target.value);
              if (!sim.running) resetSimulation();
            }}
            disabled={sim.running}
            className="w-full px-4 py-3 bg-cyber-bg border border-cyber-border rounded-lg text-sm text-white focus:outline-none focus:border-cyber-cyan/50 transition-all disabled:opacity-50"
          >
            {servers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.hostname} ({s.region}) — Risk: {s.riskScore}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { label: 'CPU', value: selectedServer.cpu },
              { label: 'MEM', value: selectedServer.memory },
              { label: 'DSK', value: selectedServer.disk },
              { label: 'NET', value: selectedServer.network },
            ].map((m) => (
              <div key={m.label} className="text-center p-2 rounded-lg bg-cyber-bg/50">
                <div className="text-lg font-bold text-slate-300">{m.value}%</div>
                <div className="text-[10px] font-mono text-slate-600">{m.label}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Simulation Scenarios" icon={<Zap className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-3">
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              const isActive = sim.scenario === sc.id && sim.running;
              return (
                <button
                  key={sc.id}
                  onClick={() => (isActive ? stopSimulation() : startSimulation(sc.id))}
                  disabled={sim.running && !isActive}
                  className={`p-4 rounded-lg border text-left transition-all disabled:opacity-40 ${sc.color} ${
                    isActive ? 'ring-2 ring-cyber-cyan/50 cyber-glow' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" />
                    {isActive ? (
                      <Square className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">{sc.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{sc.description}</div>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Live simulation state */}
      {sim.scenario && (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Live metrics */}
          <Panel
            title="Live Simulation Metrics"
            icon={<Activity className="w-4 h-4" />}
            action={
              <button
                onClick={resetSimulation}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            }
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Status</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                  sim.running ? 'text-cyber-green bg-cyber-green/10' : 'text-slate-400 bg-cyber-bg'
                }`}>
                  {sim.running ? '● RUNNING' : '■ STOPPED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Tick</span>
                <span className="text-xs font-mono text-white">{sim.tick}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Scenario</span>
                <span className="text-xs font-mono text-cyber-cyan">{currentScenario?.label}</span>
              </div>

              {[
                { label: 'CPU', value: sim.metrics.cpu, icon: Cpu, threshold: 85 },
                { label: 'Memory', value: sim.metrics.memory, icon: MemoryStick, threshold: 80 },
                { label: 'Disk', value: sim.metrics.disk, icon: HardDrive, threshold: 90 },
                { label: 'Network', value: sim.metrics.network, icon: Wifi, threshold: 80 },
              ].map((m) => {
                const Icon = m.icon;
                const over = m.value > m.threshold;
                const warn = m.value > m.threshold * 0.8;
                const color = over ? 'text-red-400' : warn ? 'text-amber-400' : 'text-slate-400';
                const barColor = over ? 'bg-red-500' : warn ? 'bg-amber-500' : 'bg-cyber-cyan';
                return (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                        <span className="text-xs font-mono text-slate-400">{m.label}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${color}`}>{m.value}%</span>
                    </div>
                    <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Risk gauge + AI recommendation */}
          <Panel title="AI Risk Assessment" icon={<Brain className="w-4 h-4" />}>
            <div className="flex flex-col items-center gap-4">
              <RiskGauge value={sim.metrics.risk} size="lg" label="Current Risk" />
              <div className={`w-full p-3 rounded-lg border ${
                sim.metrics.risk >= 80 ? 'bg-red-500/5 border-red-500/20' :
                sim.metrics.risk >= 60 ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-cyber-cyan/5 border-cyber-cyan/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-3.5 h-3.5 ${riskColor(sim.metrics.risk)}`} />
                  <span className="text-xs font-mono text-slate-400">PREDICTION</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{recommendation}</p>
              </div>
            </div>
          </Panel>

          {/* Event log */}
          <Panel title="Event Log" icon={<Clock className="w-4 h-4" />}>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {sim.log.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No events yet. Start a simulation.</p>
              ) : (
                sim.log.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="font-mono text-slate-600 flex-shrink-0">{entry.time}</span>
                    <div className={`flex-1 ${
                      entry.severity === 'critical' ? 'text-red-400' :
                      entry.severity === 'warning' ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {entry.severity === 'critical' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {entry.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      )}

      {/* Risk trend chart */}
      {sim.history.length > 0 && (
        <Panel title="Simulation Risk & Metric Trends" icon={<TrendingUp className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="simRiskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="simCpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" />
              <XAxis dataKey="tick" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1424',
                  border: '1px solid #1a2740',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} fill="url(#simRiskGrad)" />
              <Area type="monotone" dataKey="cpu" stroke="#22d3ee" strokeWidth={1.5} fill="url(#simCpuGrad)" />
              <Area type="monotone" dataKey="memory" stroke="#f59e0b" strokeWidth={1.5} fill="none" />
              <Area type="monotone" dataKey="disk" stroke="#10b981" strokeWidth={1.5} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Risk
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan" /> CPU
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Memory
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Disk
            </span>
          </div>
        </Panel>
      )}
    </div>
  );
}
