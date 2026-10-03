import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  Server, 
  Layers, 
  AlertTriangle, 
  ArrowLeft, 
  Terminal, 
  Cpu, 
  Lock, 
  Clock, 
  FileText, 
  Sparkles, 
  Network, 
  Radio, 
  History, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Copy,
  Check,
  Info,
  HelpCircle
} from 'lucide-react';
import { AssetIntelligence, SeverityLevel, VulnerabilityRecord, AIExplanationCategory } from '../types';
import { AIExplanationPanel } from './AIExplanationPanel';
import { AIExplainButton } from './AIExplainButton';
import { AIItemExplainerModal } from './AIItemExplainerModal';

interface AssetDetailPageProps {
  asset: AssetIntelligence;
  onBack: () => void;
  onSelectCVE?: (cveId: string) => void;
  onOpenAI: (initialQuestion?: string) => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const AssetDetailPage: React.FC<AssetDetailPageProps> = ({
  asset,
  onBack,
  onSelectCVE,
  onOpenAI,
  isSaved = false,
  onToggleSave
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'network' | 'ports' | 'services' | 'technologies' | 'vulnerabilities' | 'dns' | 'ssl' | 'http' | 'history' | 'related' | 'ai'
  >('overview');

  const [copiedText, setCopiedText] = useState<string | null>(null);

  // State for specific item AI explanation modal
  const [activeExplainingItem, setActiveExplainingItem] = useState<{
    category: AIExplanationCategory;
    identifier: string;
    itemData?: any;
  } | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleExplainItem = (category: AIExplanationCategory, identifier: string, itemData?: any) => {
    setActiveExplainingItem({ category, identifier, itemData });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ShieldAlert },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'ports', label: `Ports (${asset.openPorts.length})`, icon: Terminal },
    { id: 'services', label: 'Services', icon: Server },
    { id: 'technologies', label: `Tech (${asset.technologies.length})`, icon: Cpu },
    { id: 'vulnerabilities', label: `CVEs (${asset.vulnerabilities.length})`, icon: AlertTriangle },
    { id: 'dns', label: 'DNS Records', icon: Globe },
    { id: 'ssl', label: 'SSL / TLS', icon: Lock },
    { id: 'http', label: 'HTTP Info', icon: FileText },
    { id: 'history', label: 'History Timeline', icon: History },
    { id: 'related', label: 'Related Assets', icon: Layers },
    { id: 'ai', label: 'AI Analysis', icon: Sparkles },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleSave && (
            <button
              onClick={onToggleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Monitored' : 'Save Asset'}</span>
            </button>
          )}

          <button
            onClick={() => onOpenAI(`Perform an in-depth security posture analysis of ${asset.ip} (${asset.hostname})`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Threat Analysis</span>
          </button>
        </div>
      </div>

      {/* Asset Header Banner */}
      <div className="p-6 rounded-2xl bg-neutral-950/90 border border-white/15 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
                <span>{asset.ip}</span>
                <AIExplainButton 
                  category="ip" 
                  identifier={asset.ip} 
                  itemData={asset} 
                  onExplain={handleExplainItem}
                  label="Explain IP"
                />
              </h1>
              {asset.domain && (
                <span className="text-lg font-mono text-neutral-400">
                  / {asset.domain}
                </span>
              )}
              <button
                onClick={() => copyToClipboard(asset.ip, 'ip')}
                className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Copy IP Address"
              >
                {copiedText === 'ip' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="text-white font-semibold">{asset.hostname}</span>
              <span>•</span>
              <span>{asset.city}, {asset.country} ({asset.countryCode})</span>
              <span>•</span>
              <span className="text-neutral-300">{asset.org}</span>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-300 flex items-center gap-1">
                <span>{asset.asn}</span>
                <AIExplainButton 
                  category="ip" 
                  identifier={asset.asn} 
                  itemData={asset} 
                  onExplain={handleExplainItem} 
                  variant="icon"
                />
              </span>
            </div>
          </div>

          {/* Risk Severity Gauge */}
          <div className="flex items-center gap-4 bg-neutral-900/80 p-4 rounded-xl border border-white/10 font-mono">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-[10px] text-neutral-400 uppercase font-semibold">
                <span>ATTACK SURFACE RISK</span>
                <AIExplainButton 
                  category="risk_score" 
                  identifier={String(asset.riskScore)} 
                  itemData={asset} 
                  onExplain={handleExplainItem} 
                  variant="icon"
                />
              </div>
              <div className="text-2xl font-bold text-white leading-none mt-1">
                {asset.riskScore}<span className="text-sm font-normal text-neutral-400">/100</span>
              </div>
            </div>
            <div className="flex flex-col items-center pl-4 border-l border-white/10">
              <span className={`px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wider border ${
                asset.severity === 'CRITICAL' ? 'bg-white text-black border-white' :
                asset.severity === 'HIGH' ? 'bg-neutral-200 text-black border-neutral-300' :
                asset.severity === 'MEDIUM' ? 'bg-neutral-800 text-neutral-200 border-neutral-600' :
                'bg-neutral-900 text-neutral-400 border-neutral-800'
              }`}>
                {asset.severity}
              </span>
              <span className="text-[10px] text-neutral-400 mt-1">
                {asset.vulnerabilities.length} CVEs • {asset.openPorts.length} Ports
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.08] text-xs font-mono">
          {asset.tags.map((tag, idx) => (
            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-white/10 text-neutral-300 text-[11px]">
              {tag}
            </span>
          ))}
          {asset.cloudProvider && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-semibold">
              Host: {asset.cloudProvider}
            </span>
          )}
          {asset.operatingSystem && (
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 text-[11px]">
              OS: {asset.operatingSystem}
            </span>
          )}
        </div>
      </div>

      {/* Prominent AI Security Explanation Panel */}
      <AIExplanationPanel
        asset={asset}
        onOpenChat={onOpenAI}
        defaultExpanded={true}
      />

      {/* 12-Tab Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none font-mono text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`asset-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            
            {/* Box 1: Geographic & ASN Summary */}
            <div className="p-5 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between pb-2 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <span>Infrastructure Profile</span>
                  <AIExplainButton 
                    category="ip" 
                    identifier={asset.ip} 
                    itemData={asset} 
                    onExplain={handleExplainItem} 
                    variant="icon"
                  />
                </span>
                <Globe className="w-4 h-4 text-neutral-400" />
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Autonomous System:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">{asset.asn}</span>
                    <AIExplainButton 
                      category="ip" 
                      identifier={asset.asn} 
                      itemData={asset} 
                      onExplain={handleExplainItem} 
                      variant="icon"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">ASN Name:</span>
                  <span className="text-neutral-200 truncate max-w-[160px]">{asset.asnName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">ISP / Organization:</span>
                  <span className="text-neutral-200">{asset.org}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Location:</span>
                  <span className="text-white">{asset.city}, {asset.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Coordinates:</span>
                  <span className="text-neutral-300">{asset.latitude.toFixed(4)}, {asset.longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Security & Threat Indicators */}
            <div className="p-5 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between pb-2 border-b border-white/10">
                <span>Threat Indicators</span>
                <ShieldAlert className="w-4 h-4 text-neutral-400" />
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Tor Exit Node:</span>
                  <span className={asset.threatIndicators.isTorExitNode ? 'text-white font-bold' : 'text-neutral-400'}>
                    {asset.threatIndicators.isTorExitNode ? 'DETECTED' : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">VPN / Anonymizer:</span>
                  <span className={asset.threatIndicators.isVpn ? 'text-white font-bold' : 'text-neutral-400'}>
                    {asset.threatIndicators.isVpn ? 'DETECTED' : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Known Proxy / Relay:</span>
                  <span className={asset.threatIndicators.isProxy ? 'text-white font-bold' : 'text-neutral-400'}>
                    {asset.threatIndicators.isProxy ? 'ACTIVE' : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Reputation Index:</span>
                  <span className="text-white font-bold">{asset.threatIndicators.reputationScore}/100</span>
                </div>
              </div>
            </div>

            {/* Box 3: Observation Timeline */}
            <div className="p-5 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between pb-2 border-b border-white/10">
                <span>Scanning Telemetry</span>
                <Clock className="w-4 h-4 text-neutral-400" />
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">First Indexed:</span>
                  <span className="text-neutral-300">{new Date(asset.firstSeen).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Last Active Scan:</span>
                  <span className="text-white font-bold">{new Date(asset.lastObserved).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">SSL Cert Grade:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">{asset.sslInfo?.grade || 'N/A'}</span>
                    {asset.sslInfo && (
                      <AIExplainButton 
                        category="ssl" 
                        identifier={`SSL Grade ${asset.sslInfo.grade}`} 
                        itemData={asset.sslInfo} 
                        onExplain={handleExplainItem} 
                        variant="icon"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Active Vulnerabilities:</span>
                  <span className="text-white font-bold">{asset.vulnerabilities.length}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: NETWORK */}
        {activeTab === 'network' && (
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Routing & Autonomous System Details
              </h3>
              <AIExplainButton
                category="ip"
                identifier={asset.ip}
                itemData={asset}
                onExplain={handleExplainItem}
                label="Explain Network & ASN"
                variant="button"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-neutral-400">IPv4 Address:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">{asset.ip}</span>
                    <AIExplainButton category="ip" identifier={asset.ip} itemData={asset} onExplain={handleExplainItem} variant="icon" />
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Hostname / FQDN:</span>
                  <span className="text-white">{asset.hostname}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Associated Domain:</span>
                  <span className="text-neutral-200">{asset.domain || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Cloud Infrastructure:</span>
                  <span className="text-white font-bold">{asset.cloudProvider || 'On-Prem / Dedicated Baremetal'}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-neutral-400">ASN:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">{asset.asn}</span>
                    <AIExplainButton category="ip" identifier={asset.asn} itemData={asset} onExplain={handleExplainItem} variant="icon" />
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">ASN Description:</span>
                  <span className="text-neutral-200">{asset.asnName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Internet Registry:</span>
                  <span className="text-neutral-300">RIPE / ARIN / APNIC Delegated</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Geographic Center:</span>
                  <span className="text-neutral-300">{asset.latitude}, {asset.longitude} ({asset.city}, {asset.country})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PORTS */}
        {activeTab === 'ports' && (
          <div className="space-y-4">
            {/* Explanatory banner */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 flex items-start gap-3 text-xs font-mono">
              <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-white">AI Port Security Context:</strong>
                <p className="text-neutral-300 font-sans">
                  An open port indicates a listening network daemon. <em>Note:</em> An open port is not automatically a vulnerability; security risk depends on software patch levels, authentication controls, and administrative exposure. Click <strong>AI Explain</strong> on any port to view specific risk details.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-950/80 border border-white/10 overflow-hidden font-mono text-xs">
              <div className="p-4 bg-neutral-900/60 border-b border-white/10 flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider">
                  Exposed Port Inventory ({asset.openPorts.length})
                </span>
                <span className="text-neutral-400 text-[11px]">TCP/UDP SYN & Banner Inspection</span>
              </div>
              <div className="divide-y divide-white/5 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-900/40 text-neutral-400 text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Port</th>
                      <th className="p-3">Protocol</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Product / Version</th>
                      <th className="p-3">Banner Snippet</th>
                      <th className="p-3 text-right">CVEs</th>
                      <th className="p-3 text-right">Explain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-300">
                    {asset.openPorts.map((p, idx) => (
                      <tr key={`${p.port}-${p.protocol}-${idx}`} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white">
                          <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/10">
                            {p.port}
                          </span>
                        </td>
                        <td className="p-3 uppercase text-neutral-400">{p.protocol}</td>
                        <td className="p-3 font-semibold text-white">{p.service}</td>
                        <td className="p-3 text-neutral-200">{p.product || 'Unknown'} {p.version || ''}</td>
                        <td className="p-3 text-neutral-400 font-mono text-[11px] truncate max-w-[240px]">
                          {p.banner || 'None grabbed'}
                        </td>
                        <td className="p-3 text-right">
                          {p.cves && p.cves.length > 0 ? (
                            <div className="flex justify-end gap-1">
                              {p.cves.map((c, cIdx) => (
                                <span key={`port-cve-${c}-${cIdx}`} className="px-1.5 py-0.5 rounded bg-white text-black font-bold text-[10px]">
                                  {c}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <AIExplainButton
                            category="port"
                            identifier={String(p.port)}
                            itemData={p}
                            onExplain={handleExplainItem}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-4 font-mono text-xs">
            {asset.openPorts.map((port, idx) => (
              <div key={`${port.port}-${port.protocol}-${idx}`} className="p-5 rounded-xl bg-neutral-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white text-black font-bold">
                      {port.port}/{port.protocol}
                    </span>
                    <span className="text-white font-bold uppercase">{port.service}</span>
                    {port.product && (
                      <span className="text-neutral-400">({port.product} {port.version})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[11px]">State: {port.state}</span>
                    <AIExplainButton
                      category="service"
                      identifier={port.service}
                      itemData={port}
                      onExplain={handleExplainItem}
                    />
                  </div>
                </div>
                {port.banner && (
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase block mb-1">Raw Service Banner:</span>
                    <pre className="p-3 rounded-lg bg-neutral-900 border border-white/5 text-neutral-200 text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {port.banner}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: TECHNOLOGIES */}
        {activeTab === 'technologies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {asset.technologies.map((t, tIdx) => (
              <div key={`tech-${t.name}-${tIdx}`} className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{t.name}</span>
                  <AIExplainButton
                    category="technology"
                    identifier={t.name}
                    itemData={t}
                    onExplain={handleExplainItem}
                  />
                </div>
                <div className="space-y-1 text-neutral-400">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-neutral-300">{t.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Detected Version:</span>
                    <span className="text-white">{t.version || 'Unspecified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence Score:</span>
                    <span className="text-white font-bold">{t.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: VULNERABILITIES */}
        {activeTab === 'vulnerabilities' && (
          <div className="space-y-4 font-mono text-xs">
            {asset.vulnerabilities.length === 0 ? (
              <div className="p-8 rounded-xl bg-neutral-950/80 border border-white/10 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-neutral-400 mx-auto" />
                <h4 className="font-bold text-white">No Public Vulnerabilities Flagged</h4>
                <p className="text-neutral-400 text-[11px]">
                  No documented CVEs are actively tied to the fingerprint banners of this host.
                </p>
              </div>
            ) : (
              asset.vulnerabilities.map((vuln, vIdx) => (
                <div key={`vuln-${vuln.cveId}-${vIdx}`} className="p-5 rounded-xl bg-neutral-950/90 border border-white/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => onSelectCVE?.(vuln.cveId)}
                        className="text-base font-bold font-mono text-white hover:underline"
                      >
                        {vuln.cveId}
                      </button>
                      <span className="px-2 py-0.5 rounded bg-white text-black font-extrabold text-[11px]">
                        CVSS {vuln.cvss} ({vuln.severity})
                      </span>
                      {vuln.inCisaKev && (
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/30 text-white font-bold text-[10px]">
                          CISA KEV
                        </span>
                      )}
                      <AIExplainButton
                        category="vulnerability"
                        identifier={vuln.cveId}
                        itemData={vuln}
                        onExplain={handleExplainItem}
                        label="AI Explain CVE"
                      />
                    </div>
                    <span className="text-neutral-400 text-[11px]">Published: {vuln.publishedDate}</span>
                  </div>

                  <h4 className="text-white font-bold text-sm">{vuln.title}</h4>
                  <p className="text-neutral-300 leading-relaxed font-sans">{vuln.description}</p>

                  <div className="p-3 rounded-lg bg-neutral-900/90 border border-white/10 space-y-1.5 font-sans">
                    <span className="font-bold text-white block uppercase text-[10px] tracking-wider font-mono">
                      Defensive Remediation Guidance:
                    </span>
                    <p className="text-neutral-300">{vuln.remediation?.summary}</p>
                    {vuln.remediation?.mitigationSteps && (
                      <ul className="list-disc list-inside space-y-1 text-neutral-400 pt-1 text-[11px]">
                        {vuln.remediation.mitigationSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 7: DNS */}
        {activeTab === 'dns' && (
          <div className="rounded-2xl bg-neutral-950/80 border border-white/10 overflow-hidden font-mono text-xs">
            <div className="p-4 bg-neutral-900/60 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider">
                DNS Zone Records
              </span>
              <span className="text-neutral-400 text-[11px]">Forward & Reverse Resolution</span>
            </div>
            <div className="divide-y divide-white/5">
              {asset.dnsRecords && asset.dnsRecords.length > 0 ? (
                asset.dnsRecords.map((rec, i) => (
                  <div key={i} className="p-3 flex items-center justify-between hover:bg-white/[0.02] gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-16 px-2 py-0.5 rounded bg-neutral-900 text-white font-bold text-center">
                        {rec.type}
                      </span>
                      <span className="text-neutral-300 font-bold">{rec.name}</span>
                    </div>
                    <span className="text-white truncate max-w-xs">{rec.value}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400 text-[10px]">TTL {rec.ttl}s</span>
                      <AIExplainButton
                        category="dns"
                        identifier={rec.type}
                        itemData={rec}
                        onExplain={handleExplainItem}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-neutral-400">No public DNS records directly mapped.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: SSL/TLS */}
        {activeTab === 'ssl' && (
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white uppercase tracking-wider">
                  SSL / TLS Certificate Cryptography
                </h3>
                {asset.sslInfo && (
                  <AIExplainButton
                    category="ssl"
                    identifier="SSL/TLS Certificate"
                    itemData={asset.sslInfo}
                    onExplain={handleExplainItem}
                  />
                )}
              </div>
              {asset.sslInfo && (
                <span className="px-3 py-1 rounded bg-white text-black font-extrabold text-xs">
                  GRADE {asset.sslInfo.grade}
                </span>
              )}
            </div>

            {asset.sslInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Subject (CN):</span>
                    <span className="text-white font-bold">{asset.sslInfo.subject}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Issuer Authority:</span>
                    <span className="text-neutral-200">{asset.sslInfo.issuer}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Protocol Version:</span>
                    <span className="text-white font-bold">{asset.sslInfo.tlsVersion}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Cipher Suite:</span>
                    <span className="text-neutral-200">{asset.sslInfo.cipherSuite}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Valid From:</span>
                    <span className="text-neutral-300">{asset.sslInfo.validFrom}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Valid To:</span>
                    <span className="text-neutral-300">{asset.sslInfo.validTo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Expiration Status:</span>
                    <span className={asset.sslInfo.isExpired ? 'text-white font-bold' : 'text-neutral-300'}>
                      {asset.sslInfo.isExpired ? '⚠️ EXPIRED' : `Valid (${asset.sslInfo.daysRemaining} days left)`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">SHA-256 Fingerprint:</span>
                    <span className="text-neutral-400 truncate max-w-[180px]">{asset.sslInfo.fingerprintSha256}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-neutral-400">No SSL/TLS certificate found on inspected ports.</div>
            )}
          </div>
        )}

        {/* TAB 9: HTTP */}
        {activeTab === 'http' && (
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white uppercase tracking-wider">
                HTTP Response & Security Headers Inspection
              </h3>
              <span className="text-[11px] text-neutral-400">Browser Defensive Hardening</span>
            </div>
            {asset.securityHeaders && asset.securityHeaders.length > 0 ? (
              <div className="space-y-2">
                {asset.securityHeaders.map((header, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-neutral-900 border border-white/5 flex items-start justify-between gap-4 font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{header.name}</span>
                        <AIExplainButton
                          category="header"
                          identifier={header.name}
                          itemData={header}
                          onExplain={handleExplainItem}
                        />
                      </div>
                      {header.value ? (
                        <code className="text-neutral-400 text-[11px] break-all block mt-0.5">{header.value}</code>
                      ) : (
                        <span className="text-neutral-400 text-[11px] italic block mt-0.5">Header not transmitted</span>
                      )}
                      {header.recommendation && (
                        <p className="text-neutral-400 text-[10px] mt-1 font-sans">{header.recommendation}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      header.score === 'good' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {header.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-400">No HTTP headers analyzed.</div>
            )}
          </div>
        )}

        {/* TAB 10: HISTORY */}
        {activeTab === 'history' && (
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
              Historical Observation Timeline
            </h3>
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10 pl-6">
              {asset.historicalTimeline.map((item, i) => (
                <div key={i} className="relative space-y-1">
                  <div className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-white ring-4 ring-[#080808]" />
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{item.event}</span>
                    <span className="text-neutral-400 text-[10px]">{item.date}</span>
                  </div>
                  <p className="text-neutral-300 text-[11px]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: RELATED ASSETS */}
        {activeTab === 'related' && (
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
              Related Perimeter Assets & Subdomains
            </h3>
            {asset.subdomains && asset.subdomains.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {asset.subdomains.map((sub, idx) => (
                  <div key={`sub-${sub}-${idx}`} className="p-3 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-xs flex items-center justify-between">
                    <span className="truncate">{sub}</span>
                    <Globe className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-400">No additional subdomains indexed for this prefix.</div>
            )}
          </div>
        )}

        {/* TAB 12: AI ANALYSIS */}
        {activeTab === 'ai' && (
          <div className="p-6 rounded-2xl bg-neutral-950/90 border border-white/20 font-mono text-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="font-bold text-white text-sm uppercase">BLACKTRACE AI Threat Analyst</span>
              </div>
              <span className="text-[10px] text-neutral-400">Gemini 3.7 Flash Defensive Engine</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => onOpenAI(`What does the open port configuration and risk score of ${asset.ip} mean?`)}
                className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-left space-y-1.5 text-neutral-300 hover:text-white transition-colors"
              >
                <span className="font-bold text-white block text-sm">Explain Port Posture</span>
                <span className="text-[11px] text-neutral-400 font-sans block">Evaluate exposed ports ({asset.openPorts.map(p => p.port).join(', ')}).</span>
              </button>

              <button
                onClick={() => onOpenAI(`Prioritize the vulnerabilities identified on ${asset.ip} and recommend remediation steps.`)}
                className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-left space-y-1.5 text-neutral-300 hover:text-white transition-colors"
              >
                <span className="font-bold text-white block text-sm">Vulnerability Triage</span>
                <span className="text-[11px] text-neutral-400 font-sans block">Rank CVSS impact and exploit weaponization.</span>
              </button>

              <button
                onClick={() => onOpenAI(`Generate a complete step-by-step SOC remediation playbook for ${asset.ip}.`)}
                className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-left space-y-1.5 text-neutral-300 hover:text-white transition-colors"
              >
                <span className="font-bold text-white block text-sm">Remediation Playbook</span>
                <span className="text-[11px] text-neutral-400 font-sans block">Create DevSecOps patch and firewall rules.</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Global AI Item Explainer Modal */}
      {activeExplainingItem && (
        <AIItemExplainerModal
          isOpen={!!activeExplainingItem}
          onClose={() => setActiveExplainingItem(null)}
          category={activeExplainingItem.category}
          identifier={activeExplainingItem.identifier}
          itemData={activeExplainingItem.itemData}
          assetContext={asset}
          onOpenChatWithPrompt={onOpenAI}
        />
      )}

    </div>
  );
};

