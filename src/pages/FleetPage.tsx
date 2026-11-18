import { useState } from 'react';
import { Server as ServerIcon, Search, Filter, MapPin } from 'lucide-react';
import ServerCard from '@/components/ServerCard';
import { servers } from '@/lib/mock-data';
import type { ServerStatus } from '@/types';

type FilterStatus = 'all' | ServerStatus;

export default function FleetPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = servers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.hostname.toLowerCase().includes(search.toLowerCase()) ||
      s.region.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const filters: { label: string; value: FilterStatus; count: number }[] = [
    { label: 'All', value: 'all', count: servers.length },
    { label: 'Critical', value: 'critical', count: servers.filter((s) => s.status === 'critical').length },
    { label: 'Warning', value: 'warning', count: servers.filter((s) => s.status === 'warning').length },
    { label: 'Healthy', value: 'healthy', count: servers.filter((s) => s.status === 'healthy').length },
    { label: 'Offline', value: 'offline', count: servers.filter((s) => s.status === 'offline').length },
  ];

  const regions = Array.from(new Set(servers.map((s) => s.region)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Fleet Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          {servers.length} servers · {regions.length} regions · Live monitoring
        </p>
      </div>

      {/* Region badges */}
      <div className="flex flex-wrap items-center gap-3">
        {regions.map((region) => {
          const count = servers.filter((s) => s.region === region).length;
          const hasCritical = servers.some((s) => s.region === region && s.status === 'critical');
          return (
            <div
              key={region}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${
                hasCritical
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-cyber-surface border-cyber-border text-slate-400'
              }`}
            >
              <MapPin className="w-3 h-3" />
              {region}
              <span className="text-slate-600">·</span>
              <span className="text-white">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, hostname, or region..."
            className="w-full pl-10 pr-4 py-2.5 bg-cyber-surface border border-cyber-border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-500 mr-1" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.value
                  ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                  : 'text-slate-400 hover:text-white border border-cyber-border hover:border-cyber-border-bright'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Server grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      ) : (
        <div className="cyber-card p-12 text-center">
          <ServerIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No servers match your search or filter.</p>
        </div>
      )}
    </div>
  );
}
