import { Link } from 'react-router-dom';
import { Server as ServerIcon, Cpu, MemoryStick, HardDrive, Wifi, Thermometer } from 'lucide-react';
import type { Server } from '@/types';
import { statusColor, statusBg, statusDot, riskColor } from '@/lib/utils';
import RiskGauge from './RiskGauge';

interface ServerCardProps {
  server: Server;
}

export default function ServerCard({ server }: ServerCardProps) {
  const metrics = [
    { icon: Cpu, label: 'CPU', value: server.cpu },
    { icon: MemoryStick, label: 'MEM', value: server.memory },
    { icon: HardDrive, label: 'DSK', value: server.disk },
    { icon: Wifi, label: 'NET', value: server.network },
  ];

  return (
    <Link
      to={`/servers/${server.id}`}
      className={`cyber-card cyber-card-hover p-4 block ${server.status === 'critical' ? 'cyber-glow-red' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusDot(server.status)}`} />
          <div>
            <div className="text-sm font-semibold text-white">{server.name}</div>
            <div className="text-[10px] font-mono text-slate-500">{server.hostname}</div>
          </div>
        </div>
        <RiskGauge value={server.riskScore} size="sm" />
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusBg(server.status)} ${statusColor(server.status)} uppercase tracking-wider`}>
          {server.status}
        </span>
        <span className="text-[10px] font-mono text-slate-500">{server.region}</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {metrics.map((m) => {
          const Icon = m.icon;
          const color = m.value > 80 ? 'text-red-400' : m.value > 60 ? 'text-amber-400' : 'text-slate-400';
          return (
            <div key={m.label} className="flex flex-col items-center gap-0.5">
              <Icon className={`w-3 h-3 ${color}`} />
              <span className={`text-xs font-mono ${color}`}>{m.value}%</span>
              <span className="text-[8px] font-mono text-slate-600">{m.label}</span>
            </div>
          );
        })}
      </div>

      {server.temperature > 0 && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-cyber-border">
          <Thermometer className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] font-mono text-slate-500">{server.temperature}°C</span>
          <span className="text-[10px] font-mono text-slate-600 ml-auto">↑ {server.uptime}%</span>
        </div>
      )}

      {server.predictions.length > 0 && server.predictions[0].confidence > 80 && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[9px] font-mono text-cyber-amber bg-cyber-amber/10 px-1.5 py-0.5 rounded border border-cyber-amber/20">
            ⚠ {server.predictions[0].timeToThreshold}
          </span>
        </div>
      )}
    </Link>
  );
}
