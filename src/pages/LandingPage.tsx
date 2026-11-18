import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  TrendingDown,
  Server,
  Cpu,
  AlertTriangle,
  Eye,
  Gauge,
  Radio,
  ArrowUpRight,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const dashboardLink = user ? '/dashboard' : '/sign-in';

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid-bg">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              to={dashboardLink}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {user ? 'Dashboard' : 'Sign In'}
            </Link>
            {!user && (
              <Link
                to="/sign-up"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-all"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-cyber-teal/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 mb-6">
              <Radio className="w-3 h-3 text-cyber-cyan animate-pulse" />
              <span className="text-xs font-mono text-cyber-cyan uppercase tracking-wider">Live Fleet Monitoring</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              See the failure
              <br />
              <span className="cyber-text-glow text-cyber-cyan">before it arrives.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
              AI Ops is an enterprise-grade AIOps platform that predicts infrastructure
              failures before they happen. Real-time telemetry, predictive risk scoring, and
              AI-powered recommendations keep your fleet operational.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to={dashboardLink}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-teal text-cyber-bg font-semibold transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
              >
                Enter Operations Center
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-cyber-border text-slate-300 hover:border-cyber-cyan/30 hover:text-white transition-all"
              >
                Explore Features
              </a>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-cyber-border">
              <div>
                <div className="text-2xl font-bold text-white">99.99%</div>
                <div className="text-xs text-slate-500 font-mono">Uptime Achieved</div>
              </div>
              <div className="w-px h-10 bg-cyber-border" />
              <div>
                <div className="text-2xl font-bold text-white">2.4h</div>
                <div className="text-xs text-slate-500 font-mono">Avg. Lead Time</div>
              </div>
              <div className="w-px h-10 bg-cyber-border" />
              <div>
                <div className="text-2xl font-bold text-white">847</div>
                <div className="text-xs text-slate-500 font-mono">Failures Prevented</div>
              </div>
            </div>
          </div>

          {/* 3D Server Rack */}
          <div className="relative h-[500px] flex items-center justify-center">
            <ServerRack3D />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-cyber-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Operational Superpowers</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Four pillars of predictive infrastructure management working in concert.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Eye, title: 'Predictive Visibility', desc: 'ML-driven risk scoring predicts failures hours before they happen, with confidence intervals and time-to-threshold estimates.', color: 'cyan' },
              { icon: Gauge, title: 'Real-Time Telemetry', desc: 'Live CPU, memory, disk, network, and temperature metrics streaming from every node in your fleet across all regions.', color: 'teal' },
              { icon: AlertTriangle, title: 'Smart Alerts', desc: 'Contextual, prioritized alerts with AI recommendations — not just thresholds, but actionable intelligence.', color: 'amber' },
              { icon: Zap, title: 'Incident Simulator', desc: 'Test your response to memory leaks, CPU spikes, disk exhaustion, and latency surges in a safe simulation environment.', color: 'red' },
            ].map((f) => {
              const Icon = f.icon;
              const colors: Record<string, string> = {
                cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20',
                teal: 'text-cyber-teal bg-cyber-teal/10 border-cyber-teal/20',
                amber: 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/20',
                red: 'text-cyber-red bg-cyber-red/10 border-cyber-red/20',
              };
              return (
                <div key={f.title} className="cyber-card cyber-card-hover p-6 group">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${colors[f.color]} transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section className="py-20 px-6 border-t border-cyber-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-amber/10 border border-cyber-amber/20 mb-4">
                <Activity className="w-3 h-3 text-cyber-amber" />
                <span className="text-xs font-mono text-cyber-amber uppercase tracking-wider">Operations Center</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                A command center built for operators
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Every metric, every prediction, every alert — unified in a single pane.
                Drill from fleet overview to individual server telemetry in two clicks.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: ShieldCheck, text: 'Fleet-wide risk scoring with 24h trend visualization' },
                  { icon: TrendingDown, text: 'Predictive failure alerts with time-to-threshold countdowns' },
                  { icon: Server, text: 'Per-server deep dive with AI-powered remediation recommendations' },
                  { icon: Cpu, text: 'Interactive incident simulation across four failure scenarios' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-7 h-7 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-cyber-cyan" />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
              <Link
                to={dashboardLink}
                className="inline-flex items-center gap-2 text-cyber-cyan font-medium hover:gap-3 transition-all"
              >
                Explore the dashboard
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="cyber-card p-6 scan-line">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
                  <span className="text-xs font-mono text-slate-400">DB-Master — CRITICAL</span>
                </div>
                <span className="text-xs font-mono text-slate-500">Risk: 88</span>
              </div>
              <div className="space-y-3">
                <PreviewBar label="CPU" value={91} color="bg-red-500" />
                <PreviewBar label="Memory" value={78} color="bg-amber-500" />
                <PreviewBar label="Disk" value={89} color="bg-red-500" />
                <PreviewBar label="Network" value={56} color="bg-cyber-cyan" />
              </div>
              <div className="mt-4 p-3 rounded-lg bg-cyber-amber/5 border border-cyber-amber/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-cyber-amber" />
                  <span className="text-xs font-mono text-cyber-amber">AI PREDICTION</span>
                </div>
                <p className="text-xs text-slate-400">
                  Disk exhaustion in ~45m. Initiate emergency log rotation and archiving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-cyber-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stop reacting. Start predicting.
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Deploy AI Ops across your infrastructure and transform downtime into uptime.
          </p>
          <Link
            to={user ? '/dashboard' : '/sign-up'}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-teal text-cyber-bg font-semibold transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            {user ? 'Open Dashboard' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="text-xs font-mono text-slate-600">
            AI Ops — Operated by Amr Khaled, Operations Lead
          </div>
          <div className="text-xs font-mono text-slate-600">
            © 2026 AI Ops. All systems operational.
          </div>
        </div>
      </footer>
    </div>
  );
}

function PreviewBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-slate-500 w-16">{label}</span>
      <div className="flex-1 h-2 bg-cyber-border rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-400 w-10 text-right">{value}%</span>
    </div>
  );
}

function ServerRack3D() {
  const units = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    status: i === 1 ? 'critical' : i === 0 || i === 4 ? 'warning' : 'healthy',
    load: [72, 91, 45, 38, 63, 0, 58, 41][i],
  }));

  const statusColors: Record<string, { bg: string; border: string; glow: string }> = {
    healthy: { bg: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/30', glow: '' },
    warning: { bg: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/30', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
    critical: { bg: 'from-red-500/20 to-red-600/5', border: 'border-red-500/30', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' },
    offline: { bg: 'from-slate-700/20 to-slate-800/5', border: 'border-slate-700/30', glow: '' },
  };

  return (
    <div className="relative w-full max-w-sm" style={{ perspective: '800px' }}>
      <div
        className="relative"
        style={{ transform: 'rotateY(-15deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}
      >
        {/* Rack frame */}
        <div className="bg-cyber-surface border border-cyber-border rounded-lg p-3 cyber-glow">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">RACK-A1</span>
            <span className="text-[9px] font-mono text-cyber-cyan">● LIVE</span>
          </div>
          <div className="space-y-1.5">
            {units.map((unit) => {
              const sc = statusColors[unit.status];
              return (
                <div
                  key={unit.id}
                  className={`relative bg-gradient-to-r ${sc.bg} border ${sc.border} rounded h-10 flex items-center px-3 gap-3 ${sc.glow} transition-all hover:scale-x-105`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    unit.status === 'critical' ? 'bg-red-400 animate-pulse' :
                    unit.status === 'warning' ? 'bg-amber-400' :
                    unit.status === 'offline' ? 'bg-slate-600' : 'bg-emerald-400'
                  }`} />
                  <div className="flex-1 flex items-center gap-1.5">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <div
                        key={j}
                        className={`w-1 h-3 rounded-sm ${
                          j < Math.floor(unit.load / 12)
                            ? unit.status === 'critical' ? 'bg-red-400' : unit.status === 'warning' ? 'bg-amber-400' : 'bg-cyber-cyan'
                            : 'bg-cyber-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-slate-500">U{unit.id + 1}</span>
                  <span className={`text-[8px] font-mono ${
                    unit.status === 'critical' ? 'text-red-400' :
                    unit.status === 'warning' ? 'text-amber-400' : 'text-slate-400'
                  }`}>{unit.load}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floor reflection */}
        <div
          className="absolute top-full left-0 right-0 h-20 bg-gradient-to-b from-cyber-surface/30 to-transparent rounded-lg"
          style={{ transform: 'rotateX(90deg)', transformOrigin: 'top' }}
        />
      </div>

      {/* Floating data points */}
      <div className="absolute -top-4 -right-8 cyber-card px-3 py-2 animate-float" style={{ animationDelay: '0s' }}>
        <div className="text-[8px] font-mono text-slate-500">RISK SCORE</div>
        <div className="text-lg font-bold text-cyber-amber">54.2</div>
      </div>
      <div className="absolute -bottom-4 -left-8 cyber-card px-3 py-2 animate-float" style={{ animationDelay: '2s' }}>
        <div className="text-[8px] font-mono text-slate-500">PREDICTIONS</div>
        <div className="text-lg font-bold text-cyber-cyan">12 active</div>
      </div>
    </div>
  );
}
