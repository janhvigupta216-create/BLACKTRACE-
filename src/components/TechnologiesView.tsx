import React, { useState, useEffect } from 'react';
import { Cpu, Search, ArrowUpRight, Server, Shield, Layers, Globe, ChevronRight } from 'lucide-react';

interface TechnologiesViewProps {
  onSearchTech: (techName: string) => void;
}

export const TechnologiesView: React.FC<TechnologiesViewProps> = ({ onSearchTech }) => {
  const [techs, setTechs] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/technologies')
      .then(res => res.json())
      .then(data => {
        setTechs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = techs.filter(t => 
    t.name.toLowerCase().includes(filter.toLowerCase()) || 
    t.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300">
          <Cpu className="w-3.5 h-3.5 text-white" />
          <span>INTERNET TECHNOLOGY FINGERPRINT DIRECTORY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Technology Intelligence
        </h1>
        <p className="text-sm text-neutral-400 font-mono">
          Global footprint, market distribution, version fragmentation, and associated vulnerabilities across web servers, databases, operating systems, and frameworks.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        <input
          id="tech-search-input"
          type="text"
          placeholder="Filter technologies (e.g. Nginx, Redis, WordPress)..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 font-mono text-xs focus:outline-none focus:border-white/30"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {loading ? (
          <div className="col-span-full p-8 text-center text-neutral-500">Loading technologies...</div>
        ) : (
          filtered.map((tech, idx) => (
            <div
              key={`tech-${tech.name}-${idx}`}
              id={`tech-card-${tech.name.replace(/\s+/g, '-').toLowerCase()}`}
              className="p-5 rounded-xl bg-neutral-950/80 border border-white/10 hover:border-white/30 transition-all space-y-3 group backdrop-blur-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-bold text-white block group-hover:text-neutral-200">
                    {tech.name}
                  </span>
                  <span className="text-[11px] text-neutral-400">{tech.category}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-300 text-[10px]">
                  {tech.topVersion}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Indexed Hosts:</span>
                  <span className="text-white font-bold">{(tech.observedAssets / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Risk Profile:</span>
                  <span className="text-neutral-200">{tech.riskScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Linked CVEs:</span>
                  <span className="text-white font-bold">{tech.cveCount}</span>
                </div>
              </div>

              <button
                onClick={() => onSearchTech(tech.name)}
                className="w-full mt-2 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-semibold"
              >
                <span>Search {tech.name} Assets</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
