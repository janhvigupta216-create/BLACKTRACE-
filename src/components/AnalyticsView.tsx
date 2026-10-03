import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Globe2, 
  ShieldAlert, 
  Server, 
  Terminal, 
  AlertTriangle, 
  TrendingUp, 
  Layers,
  Radio,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { GlobalTelemetryStats } from '../types';

interface AnalyticsViewProps {
  onExecuteSearch: (query: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onExecuteSearch }) => {
  const [telemetry, setTelemetry] = useState<GlobalTelemetryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        setTelemetry(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !telemetry) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-500 font-mono">
        Loading Global Threat Telemetry...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs text-neutral-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>REAL-TIME GLOBAL THREAT EXPOSURE TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Global Analytics & Attack Surface
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Aggregated exposure metrics, critical vulnerabilities, and geographic distributions across the Internet.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-400 flex items-center gap-3">
          <Clock className="w-4 h-4 text-white" />
          <span>Last sync: <strong className="text-white">{new Date().toLocaleTimeString()}</strong></span>
        </div>
      </div>

      {/* Top 4 Key Metric Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase font-semibold">
            <span>Indexed Hosts</span>
            <Globe2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {(telemetry.totalAssets / 1000000).toFixed(1)}M
          </div>
          <p className="text-[11px] text-neutral-400">Total reachable IPv4/IPv6 endpoints</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase font-semibold">
            <span>Active Open Ports</span>
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {(telemetry.openServices / 1000000).toFixed(1)}M
          </div>
          <p className="text-[11px] text-neutral-400">Publicly responding TCP/UDP listeners</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase font-semibold">
            <span>Critical Vulnerabilities</span>
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {(telemetry.knownVulnerabilities / 1000).toFixed(1)}K
          </div>
          <p className="text-[11px] text-neutral-400">Exploitable CVEs cataloged</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase font-semibold">
            <span>High Risk Assets</span>
            <Server className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {(telemetry.highRiskAssets / 1000000).toFixed(1)}M
          </div>
          <p className="text-[11px] text-neutral-400">Critical attack surfaces exposed</p>
        </div>

      </div>

      {/* Charts / Distribution Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        {/* Top Vulnerable Countries */}
        <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              High-Risk Asset Concentrations By Country
            </h3>
            <Globe2 className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="space-y-3">
            {telemetry.topCountries.map((c) => (
              <div 
                key={c.code}
                onClick={() => onExecuteSearch(`country:${c.code}`)}
                className="p-2.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 cursor-pointer transition-colors space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white group-hover:underline flex items-center gap-1.5">
                    {c.name} ({c.code})
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-neutral-300">{(c.count / 1000000).toFixed(1)}M hosts</span>
                </div>

                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full" 
                    style={{ width: `${(c.count / 145000000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Exposed Port Protocols */}
        <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Exposed Service Protocols
            </h3>
            <Terminal className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="space-y-3">
            {telemetry.topPorts.map((p, pIdx) => (
              <div 
                key={`${p.port}-${p.service}-${pIdx}`}
                onClick={() => onExecuteSearch(`port:${p.port}`)}
                className="p-2.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 cursor-pointer transition-colors space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white group-hover:underline flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-white">Port {p.port}</span>
                    <span>{p.service}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-white font-bold">{(p.count / 1000000).toFixed(1)}M</span>
                </div>

                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-neutral-300 h-full rounded-full" 
                    style={{ width: `${(p.count / 298000000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Incident Feed */}
      <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Perimeter Anomaly & Threat Feed
            </h3>
          </div>
          <span className="text-neutral-400 text-[11px]">Real-time Sensor Correlation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {telemetry.recentIncidents.map((inc) => (
            <div key={inc.id} className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  inc.severity === 'CRITICAL' ? 'bg-white text-black font-extrabold' : 'bg-neutral-800 text-neutral-200'
                }`}>
                  {inc.severity}
                </span>
                <span className="text-neutral-400 text-[10px]">{inc.timeAgo}</span>
              </div>
              <p className="text-neutral-200 font-medium">{inc.title}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
