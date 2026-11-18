import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Server,
  Bell,
  Zap,
  LogOut,
  Activity,
  Cpu,
} from 'lucide-react';
import type { ReactNode } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/fleet', label: 'Fleet', icon: Server },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/simulator', label: 'Simulator', icon: Zap },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid-bg flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-cyber-border bg-cyber-surface/80 backdrop-blur-sm flex flex-col fixed h-full z-30">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-cyber-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-teal flex items-center justify-center cyber-glow">
            <Cpu className="w-5 h-5 text-cyber-bg" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-wide">AI Ops</div>
            <div className="text-[10px] text-slate-500 font-mono">v2.4.1</div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                      : 'text-slate-400 hover:text-white hover:bg-cyber-surface-2 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-cyber-border">
          <div className="px-3 py-2 mb-2">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Operator</div>
            <div className="text-sm text-slate-300 font-medium truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-cyber-border bg-cyber-surface/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
            <span className="text-sm font-mono text-slate-400">
              <span className="text-cyber-green">●</span> Live Monitoring Active
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Fleet: 8 servers</span>
              <span className="text-cyber-border-bright">|</span>
              <span>Regions: 4</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
