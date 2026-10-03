import React, { useState, useEffect } from 'react';
import { Terminal, Search, ArrowUpRight, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ServicesViewProps {
  onSearchPort: (port: number) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSearchPort }) => {
  const [services, setServices] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = services.filter(s =>
    s.port.toString().includes(filter) ||
    s.service.toLowerCase().includes(filter.toLowerCase()) ||
    s.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300">
          <Terminal className="w-3.5 h-3.5 text-white" />
          <span>GLOBAL PORT & SERVICE PROTOCOL CATALOG</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Service & Port Intelligence
        </h1>
        <p className="text-sm text-neutral-400 font-mono">
          Catalog of standard and high-risk network ports, exposure volume across IPv4/IPv6 address space, and default protocol behavior.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        <input
          id="port-search-input"
          type="text"
          placeholder="Filter port or service (e.g. 22, 443, Redis, SSH)..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 font-mono text-xs focus:outline-none focus:border-white/30"
        />
      </div>

      <div className="rounded-2xl bg-neutral-950/80 border border-white/10 overflow-hidden font-mono text-xs shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-neutral-900/60 text-neutral-400 text-[10px] uppercase border-b border-white/10">
            <tr>
              <th className="p-4">Port</th>
              <th className="p-4">Protocol</th>
              <th className="p-4">Service</th>
              <th className="p-4">Global Volume</th>
              <th className="p-4">Risk Exposure</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-500">Loading service directory...</td>
              </tr>
            ) : (
              filtered.map((s, idx) => (
                <tr key={`${s.port}-${s.protocol}-${idx}`} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-white">
                    <span className="px-2.5 py-1 rounded bg-neutral-900 border border-white/15">
                      {s.port}
                    </span>
                  </td>
                  <td className="p-4 uppercase text-neutral-400">{s.protocol}</td>
                  <td className="p-4 font-bold text-white">{s.service}</td>
                  <td className="p-4 text-neutral-200">{(s.assetCount / 1000000).toFixed(1)}M hosts</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      s.riskLevel === 'CRITICAL' ? 'bg-white text-black' :
                      s.riskLevel === 'HIGH' ? 'bg-neutral-200 text-black' :
                      s.riskLevel === 'MEDIUM' ? 'bg-neutral-800 text-neutral-200' :
                      'bg-neutral-900 text-neutral-400'
                    }`}>
                      {s.riskLevel}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-400 max-w-xs">{s.description}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSearchPort(s.port)}
                      className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white inline-flex items-center gap-1 font-semibold hover:border-white/25 transition-colors"
                    >
                      <span>Query</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
