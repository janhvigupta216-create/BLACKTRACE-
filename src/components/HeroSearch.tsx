import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Terminal, 
  AlertTriangle, 
  ShieldAlert,
  Server,
  Layers,
  Cpu,
  CornerDownLeft,
  X
} from 'lucide-react';
import { QueryType, SeverityLevel } from '../types';

interface HeroSearchProps {
  onSearch: (query: string, filters?: any) => void;
  isLoading: boolean;
  onFocusChange?: (focused: boolean) => void;
  initialQuery?: string;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isLoading,
  onFocusChange,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [detectedType, setDetectedType] = useState<QueryType>('keyword');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<{
    country: string;
    asn: string;
    port: string;
    service: string;
    technology: string;
    severity: string;
    cloudProvider: string;
    minRiskScore: number;
  }>({
    country: '',
    asn: '',
    port: '',
    service: '',
    technology: '',
    severity: 'ALL',
    cloudProvider: '',
    minRiskScore: 0
  });

  // Client-side quick detection
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setDetectedType('keyword');
      return;
    }
    if (q.startsWith('cve-') || /^cve-\d{4}-\d{4,8}$/i.test(q)) {
      setDetectedType('cve');
    } else if (q.startsWith('as') && /^as\d+$/i.test(q)) {
      setDetectedType('asn');
    } else if (q.startsWith('port:') || /^\d{1,5}$/.test(q)) {
      setDetectedType('port');
    } else if (q.startsWith('http://') || q.startsWith('https://')) {
      setDetectedType('url');
    } else if (/^(\d{1,3}\.){3}\d{1,3}$/.test(q) || /^([0-9a-f]{1,4}:){1,7}[0-9a-f]{1,4}$/i.test(q)) {
      setDetectedType('ip');
    } else if (/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(q)) {
      setDetectedType('domain');
    } else if (['apache', 'nginx', 'openssh', 'docker', 'kubernetes', 'wordpress', 'mysql', 'redis', 'elasticsearch', 'iis', 'tomcat', 'spring', 'jenkins', 'modbus', 'siemens', 'tor', 'cloudflare'].includes(q)) {
      setDetectedType('technology');
    } else if (q.includes(':') || q.includes(' and ') || q.includes(' or ')) {
      setDetectedType('advanced');
    } else {
      setDetectedType('keyword');
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const activeFilters: any = {};
    if (filters.country) activeFilters.country = filters.country;
    if (filters.asn) activeFilters.asn = filters.asn;
    if (filters.port) activeFilters.port = parseInt(filters.port, 10);
    if (filters.service) activeFilters.service = filters.service;
    if (filters.technology) activeFilters.technology = filters.technology;
    if (filters.severity !== 'ALL') activeFilters.severity = filters.severity;
    if (filters.cloudProvider) activeFilters.cloudProvider = filters.cloudProvider;
    if (filters.minRiskScore > 0) activeFilters.minRiskScore = filters.minRiskScore;

    onSearch(query, Object.keys(activeFilters).length > 0 ? activeFilters : undefined);
  };

  const exampleSearches = [
    { label: '8.8.8.8', desc: 'Google DNS Anycast', type: 'IP' },
    { label: 'example.com', desc: 'Domain Analysis', type: 'Domain' },
    { label: 'CVE-2024-6387', desc: 'regreSSHion RCE', type: 'CVE' },
    { label: 'Apache', desc: 'Web Server', type: 'Tech' },
    { label: 'OpenSSH', desc: 'SSH Infrastructure', type: 'Tech' },
    { label: 'product:nginx AND port:443', desc: 'Advanced Filter', type: 'Query' },
    { label: 'AS15169', desc: 'Google Autonomous System', type: 'ASN' },
    { label: 'port:22', desc: 'Exposed SSH Port', type: 'Port' }
  ];

  const getBadgeForType = (type: QueryType) => {
    switch (type) {
      case 'ip': return { label: 'IP ADDRESS', icon: Globe, color: 'text-neutral-200 border-white/30 bg-white/10' };
      case 'domain': return { label: 'DOMAIN', icon: Server, color: 'text-neutral-200 border-white/30 bg-white/10' };
      case 'cve': return { label: 'VULNERABILITY', icon: AlertTriangle, color: 'text-white border-white/40 bg-white/20' };
      case 'asn': return { label: 'ASN ROUTE', icon: Layers, color: 'text-neutral-200 border-white/30 bg-white/10' };
      case 'port': return { label: 'PORT/SERVICE', icon: Terminal, color: 'text-neutral-200 border-white/30 bg-white/10' };
      case 'technology': return { label: 'TECHNOLOGY', icon: Cpu, color: 'text-neutral-200 border-white/30 bg-white/10' };
      case 'advanced': return { label: 'BOOLEAN SYNTAX', icon: Sparkles, color: 'text-white border-white/40 bg-white/20' };
      default: return { label: 'INTELLIGENCE QUERY', icon: Search, color: 'text-neutral-400 border-white/10 bg-neutral-900' };
    }
  };

  const badge = getBadgeForType(detectedType);
  const BadgeIcon = badge.icon;

  return (
    <section className="relative z-10 pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      
      {/* Eyebrow / Security Feed Ticker */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950/80 border border-white/10 text-xs font-mono text-neutral-300 mb-6 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-neutral-400">GLOBAL SENSOR FEED:</span>
        <span className="text-white font-medium">489M+ Exposed IPv4/IPv6 Nodes Indexed</span>
      </div>

      {/* Main Hero Typography */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
        Search the Internet's <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500">
          Attack Surface
        </span>
      </h1>

      <p className="text-sm sm:text-base lg:text-lg text-neutral-400 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
        Discover exposed assets, services, technologies and vulnerabilities with one powerful security intelligence platform.
      </p>

      {/* Large Futuristic Search Box */}
      <div className="max-w-3xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative rounded-2xl bg-neutral-950/90 p-2 sm:p-2.5 border border-white/15 shadow-2xl shadow-black/80 backdrop-blur-2xl focus-within:border-white/40 transition-all group"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Icon & Type Indicator */}
            <div className="pl-2 sm:pl-3 flex items-center gap-2 shrink-0">
              <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-white transition-colors" />
              {query.trim() && (
                <div className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border transition-all ${badge.color}`}>
                  <BadgeIcon className="w-3 h-3" />
                  <span>{badge.label}</span>
                </div>
              )}
            </div>

            {/* Input Field */}
            <input
              id="hero-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => onFocusChange?.(true)}
              onBlur={() => onFocusChange?.(false)}
              placeholder="Search IP, domain, URL, CVE, hostname, ASN, port or tech (e.g. product:nginx AND port:443)..."
              className="w-full bg-transparent text-white placeholder:text-neutral-500 text-sm sm:text-base font-mono focus:outline-none py-2"
              autoComplete="off"
              spellCheck="false"
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                id="search-clear-btn"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Filters Toggle Button */}
            <button
              type="button"
              id="search-filters-toggle-btn"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0 ${
                filtersOpen || Object.values(filters).some(v => v !== '' && v !== 'ALL' && v !== 0)
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10'
              }`}
              title="Toggle Advanced Search Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Search Submit Button */}
            <button
              type="submit"
              id="hero-search-submit-btn"
              disabled={isLoading || !query.trim()}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-white text-black font-heading font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-white/5"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>SEARCH</span>
                  <CornerDownLeft className="w-3.5 h-3.5 hidden sm:inline opacity-70" />
                </>
              )}
            </button>
          </div>

          {/* Quick Syntax Hint (in bar) */}
          <div className="flex items-center justify-between px-3 pt-2 pb-0.5 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Supported:</span>
              <span className="text-neutral-300">IP • Domain • CVE • Port • ASN • Tech • Boolean AND/OR</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-neutral-400">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-300 text-[10px]">Enter ↵</kbd>
            </div>
          </div>
        </form>

        {/* Expandable Advanced Filter Panel */}
        {filtersOpen && (
          <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-neutral-950/95 border border-white/15 text-left text-xs font-mono space-y-4 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4 text-white" />
                <span>Faceted Threat Intel Filters</span>
              </div>
              <button
                type="button"
                onClick={() => setFilters({
                  country: '',
                  asn: '',
                  port: '',
                  service: '',
                  technology: '',
                  severity: 'ALL',
                  cloudProvider: '',
                  minRiskScore: 0
                })}
                className="text-[11px] text-neutral-400 hover:text-white underline underline-offset-2"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Country Filter */}
              <div>
                <label className="block text-neutral-400 mb-1">Country / Region</label>
                <input
                  type="text"
                  placeholder="US, DE, IN, JP..."
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* ASN Filter */}
              <div>
                <label className="block text-neutral-400 mb-1">Autonomous System (ASN)</label>
                <input
                  type="text"
                  placeholder="AS15169, AS13335..."
                  value={filters.asn}
                  onChange={(e) => setFilters({ ...filters, asn: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Port Filter */}
              <div>
                <label className="block text-neutral-400 mb-1">Open Port</label>
                <input
                  type="text"
                  placeholder="22, 80, 443, 3389..."
                  value={filters.port}
                  onChange={(e) => setFilters({ ...filters, port: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-neutral-400 mb-1">Severity Level</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/30"
                >
                  <option value="ALL">ALL SEVERITIES</option>
                  <option value="CRITICAL">CRITICAL (85-100)</option>
                  <option value="HIGH">HIGH (70-84)</option>
                  <option value="MEDIUM">MEDIUM (40-69)</option>
                  <option value="LOW">LOW (15-39)</option>
                </select>
              </div>

              {/* Technology Filter */}
              <div>
                <label className="block text-neutral-400 mb-1">Detected Technology</label>
                <input
                  type="text"
                  placeholder="Nginx, Apache, Spring..."
                  value={filters.technology}
                  onChange={(e) => setFilters({ ...filters, technology: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Service Filter */}
              <div>
                <label className="block text-neutral-400 mb-1">Service Protocol</label>
                <input
                  type="text"
                  placeholder="ssh, http, redis, mysql..."
                  value={filters.service}
                  onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Cloud Provider */}
              <div>
                <label className="block text-neutral-400 mb-1">Cloud / Host Provider</label>
                <input
                  type="text"
                  placeholder="AWS, GCP, Azure, Hetzner..."
                  value={filters.cloudProvider}
                  onChange={(e) => setFilters({ ...filters, cloudProvider: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Min Risk Score */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Min Risk Score</span>
                  <span className="text-white font-bold">{filters.minRiskScore}+</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={filters.minRiskScore}
                  onChange={(e) => setFilters({ ...filters, minRiskScore: parseInt(e.target.value, 10) })}
                  className="w-full accent-white bg-neutral-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
              >
                Apply Filters & Execute Search
              </button>
            </div>
          </div>
        )}

        {/* Quick Example Searches (As requested in prompt) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
          <span className="text-neutral-400 text-[11px] uppercase tracking-wider mr-1">Sample Queries:</span>
          {exampleSearches.map((item, idx) => (
            <button
              key={idx}
              type="button"
              id={`quick-search-btn-${idx}`}
              onClick={() => {
                setQuery(item.label);
                onSearch(item.label);
              }}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950/80 hover:bg-neutral-900 border border-white/10 hover:border-white/25 text-neutral-300 hover:text-white transition-all backdrop-blur-md"
            >
              <span className="text-white font-semibold">{item.label}</span>
              <span className="text-[10px] text-neutral-400 group-hover:text-neutral-300">({item.desc})</span>
            </button>
          ))}
        </div>

      </div>

    </section>
  );
};
