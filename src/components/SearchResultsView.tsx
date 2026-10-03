import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  Server, 
  Layers, 
  AlertTriangle, 
  ArrowUpRight, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Filter, 
  Clock, 
  Terminal, 
  Cpu, 
  Lock, 
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';
import { AssetIntelligence, SearchQueryResponse, SeverityLevel, AIExplanationCategory } from '../types';
import { AIExplanationPanel } from './AIExplanationPanel';
import { AIExplainButton } from './AIExplainButton';
import { AIItemExplainerModal } from './AIItemExplainerModal';

interface SearchResultsViewProps {
  data: SearchQueryResponse;
  onSelectAsset: (asset: AssetIntelligence) => void;
  onSelectCVE?: (cveId: string) => void;
  onFilterClick?: (filterKey: string, value: any) => void;
  onSaveSearch?: (query: string) => void;
  onSaveAsset?: (asset: AssetIntelligence) => void;
  savedAssetIds: string[];
  onOpenAIForAsset?: (asset: AssetIntelligence) => void;
  onOpenAIQuery?: (prompt?: string) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  data,
  onSelectAsset,
  onSelectCVE,
  onFilterClick,
  onSaveSearch,
  onSaveAsset,
  savedAssetIds,
  onOpenAIForAsset,
  onOpenAIQuery
}) => {
  const [selectedSort, setSelectedSort] = useState<'risk_desc' | 'risk_asc' | 'date_desc'>('risk_desc');
  const [activeExplainingItem, setActiveExplainingItem] = useState<{
    category: AIExplanationCategory;
    identifier: string;
    itemData?: any;
    assetContext?: Partial<AssetIntelligence>;
  } | null>(null);

  const handleExplainItem = (
    category: AIExplanationCategory, 
    identifier: string, 
    itemData?: any, 
    assetContext?: Partial<AssetIntelligence>
  ) => {
    setActiveExplainingItem({ category, identifier, itemData, assetContext });
  };

  const getSeverityStyle = (severity: SeverityLevel, score: number) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          badge: 'bg-white text-black font-extrabold border-white',
          border: 'border-white/40',
          text: 'text-white',
          pulse: 'bg-white'
        };
      case 'HIGH':
        return {
          badge: 'bg-neutral-200 text-black font-bold border-neutral-300',
          border: 'border-white/20',
          text: 'text-neutral-200',
          pulse: 'bg-neutral-300'
        };
      case 'MEDIUM':
        return {
          badge: 'bg-neutral-800 text-neutral-200 border-neutral-600',
          border: 'border-white/10',
          text: 'text-neutral-300',
          pulse: 'bg-neutral-400'
        };
      case 'LOW':
      default:
        return {
          badge: 'bg-neutral-900 text-neutral-400 border-neutral-800',
          border: 'border-white/5',
          text: 'text-neutral-400',
          pulse: 'bg-neutral-600'
        };
    }
  };

  const exportResultsJSON = () => {
    const jsonStr = JSON.stringify(data.results, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blacktrace-intel-${data.query.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header telemetry & summary bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider">Search Results For</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono text-sm font-bold">
              {data.query || 'Global Asset Surface'}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-400 uppercase">
              {data.type}
            </span>
          </div>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Found <strong className="text-white">{data.total.toLocaleString()}</strong> indexed host(s) in <strong className="text-white">{data.executionTimeMs}ms</strong>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="export-results-json-btn"
            onClick={exportResultsJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
            title="Export JSON Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          {onSaveSearch && (
            <button
              id="save-search-query-btn"
              onClick={() => onSaveSearch(data.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Query</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Explanation Layer Panel for Search Results */}
      <AIExplanationPanel
        searchResult={{ total: data.total, assets: data.results }}
        query={data.query}
        onOpenChat={(prompt) => {
          if (onOpenAIQuery) {
            onOpenAIQuery(prompt);
          } else if (data.results[0] && onOpenAIForAsset) {
            onOpenAIForAsset(data.results[0]);
          }
        }}
        defaultExpanded={true}
      />

      {/* Main Grid: Sidebar Aggregations + Results Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
        
        {/* Left Column: Aggregations & Facets */}
        <aside className="space-y-5 lg:col-span-1">
          
          {/* Severity Breakdown */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Risk Severity</span>
              <ShieldAlert className="w-4 h-4 text-neutral-400" />
            </h3>
            <div className="space-y-1.5">
              {data.aggregations.severities.map((s, sIdx) => (
                <div 
                  key={`agg-sev-${s.severity}-${sIdx}`}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer text-neutral-300 transition-colors"
                  onClick={() => onFilterClick?.('severity', s.severity)}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.severity === 'CRITICAL' ? 'bg-white' : s.severity === 'HIGH' ? 'bg-neutral-300' : 'bg-neutral-500'}`} />
                    {s.severity}
                  </span>
                  <span className="text-neutral-400 font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Listening Ports */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Open Ports</span>
              <Terminal className="w-4 h-4 text-neutral-400" />
            </h3>
            <div className="space-y-1.5">
              {data.aggregations.ports.slice(0, 6).map((p, idx) => (
                <div 
                  key={`agg-port-${p.port}-${idx}`}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer text-neutral-300 transition-colors"
                  onClick={() => onFilterClick?.('port', p.port)}
                >
                  <span className="font-mono text-white">Port {p.port}</span>
                  <span className="text-neutral-400 font-bold">{p.count} hosts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Technologies */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Top Technologies</span>
              <Cpu className="w-4 h-4 text-neutral-400" />
            </h3>
            <div className="space-y-1.5">
              {data.aggregations.technologies.slice(0, 6).map((t, tIdx) => (
                <div 
                  key={`agg-tech-${t.name}-${tIdx}`}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer text-neutral-300 transition-colors"
                  onClick={() => onFilterClick?.('technology', t.name)}
                >
                  <span className="truncate max-w-[140px] text-neutral-200">{t.name}</span>
                  <span className="text-neutral-400 font-bold">{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 font-mono text-xs space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Geographic Distribution</span>
              <Globe className="w-4 h-4 text-neutral-400" />
            </h3>
            <div className="space-y-1.5">
              {data.aggregations.countries.slice(0, 5).map((c, cIdx) => (
                <div 
                  key={`agg-country-${c.code}-${cIdx}`}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer text-neutral-300 transition-colors"
                  onClick={() => onFilterClick?.('country', c.code)}
                >
                  <span className="text-neutral-200">{c.name} ({c.code})</span>
                  <span className="text-neutral-400 font-bold">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Column: Search Result Asset Cards */}
        <main className="lg:col-span-3 space-y-4">
          
          {data.results.length === 0 ? (
            <div className="p-12 rounded-2xl bg-neutral-950/60 border border-white/10 text-center space-y-3">
              <ShieldAlert className="w-12 h-12 text-neutral-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Exposed Assets Matching Query</h3>
              <p className="text-xs text-neutral-400 font-mono max-w-md mx-auto">
                Try loosening your Boolean filters, searching for an alternative CIDR prefix, or querying by product name (e.g. Apache, Nginx, OpenSSH).
              </p>
            </div>
          ) : (
            data.results.map((asset, aIdx) => {
              const sev = getSeverityStyle(asset.severity, asset.riskScore);
              const isSaved = savedAssetIds.includes(asset.id);

              return (
                <article
                  key={`asset-card-${asset.id}-${asset.ip}-${aIdx}`}
                  id={`asset-card-${asset.id}`}
                  className={`p-5 sm:p-6 rounded-2xl bg-neutral-950/90 border ${sev.border} hover:border-white/40 transition-all duration-200 shadow-lg shadow-black/50 group relative backdrop-blur-md`}
                >
                  {/* Card Header: IP / Domain / Severity Score */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-white/[0.08]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          onClick={() => onSelectAsset(asset)}
                          className="text-lg sm:text-xl font-bold font-mono text-white hover:underline flex items-center gap-2 group-hover:text-white"
                        >
                          <span>{asset.ip}</span>
                          {asset.domain && (
                            <span className="text-sm font-normal text-neutral-400">({asset.domain})</span>
                          )}
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <AIExplainButton
                          category="ip"
                          identifier={asset.ip}
                          itemData={asset}
                          onExplain={(cat, id, item) => handleExplainItem(cat, id, item, asset)}
                          label="Explain"
                        />

                        {/* Query Type Badge */}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-400 uppercase font-semibold">
                          {asset.asn}
                        </span>

                        {/* Tor / Proxy / VPN tag if applicable */}
                        {asset.threatIndicators?.isTorExitNode && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-black font-bold uppercase">
                            TOR EXIT NODE
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-mono text-neutral-400 flex items-center gap-2 flex-wrap">
                        <span>{asset.hostname}</span>
                        <span>•</span>
                        <span>{asset.city}, {asset.country} ({asset.countryCode})</span>
                        <span>•</span>
                        <span>{asset.org}</span>
                      </p>
                    </div>

                    {/* Risk Score Visual Indicator */}
                    <div className="flex items-center gap-3 shrink-0">
                      
                      {/* AI Analyst Trigger */}
                      {onOpenAIForAsset && (
                        <button
                          onClick={() => onOpenAIForAsset(asset)}
                          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-colors"
                          title="Analyze with AI Security Assistant"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}

                      {/* Bookmark Button */}
                      {onSaveAsset && (
                        <button
                          onClick={() => onSaveAsset(asset)}
                          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-colors"
                          title={isSaved ? 'Remove from Saved' : 'Save Asset to Monitored Inventory'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-white" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      {/* Risk Score Badge */}
                      <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                        <div className="text-right font-mono">
                          <div className="text-[10px] text-neutral-400 uppercase font-semibold">RISK SCORE</div>
                          <div className="text-lg font-bold text-white leading-none">{asset.riskScore}<span className="text-xs text-neutral-400 font-normal">/100</span></div>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs font-mono uppercase font-bold border ${sev.badge}`}>
                          {asset.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Open Ports, Detected Tech, Vulnerabilities */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs font-mono">
                    
                    {/* Open Ports List */}
                    <div>
                      <span className="text-neutral-400 block mb-1.5 uppercase text-[10px] tracking-wider font-semibold">
                        Open Ports & Services ({asset.openPorts.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {asset.openPorts.map((p, pIdx) => (
                          <div
                            key={`${p.port}-${p.protocol}-${pIdx}`}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border font-mono ${
                              [22, 3389, 6379, 10250, 502].includes(p.port)
                                ? 'bg-white/15 border-white/30 text-white font-bold'
                                : 'bg-neutral-900 border-white/10 text-neutral-300'
                            }`}
                            title={`${p.service} (${p.product || 'Unknown'})`}
                          >
                            <span>{p.port}/{p.protocol}</span>
                            <AIExplainButton
                              category="port"
                              identifier={String(p.port)}
                              itemData={p}
                              onExplain={(cat, id, item) => handleExplainItem(cat, id, item, asset)}
                              variant="icon"
                              className="!p-0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detected Tech Stack */}
                    <div>
                      <span className="text-neutral-400 block mb-1.5 uppercase text-[10px] tracking-wider font-semibold">
                        Detected Technologies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {asset.technologies.slice(0, 4).map((t, tIdx) => (
                          <div
                            key={`asset-tech-${t.name}-${tIdx}`}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-300 text-[11px]"
                          >
                            <span>{t.name}</span>
                            <AIExplainButton
                              category="technology"
                              identifier={t.name}
                              itemData={t}
                              onExplain={(cat, id, item) => handleExplainItem(cat, id, item, asset)}
                              variant="icon"
                              className="!p-0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Identified Vulnerabilities */}
                    <div>
                      <span className="text-neutral-400 block mb-1.5 uppercase text-[10px] tracking-wider font-semibold">
                        Vulnerabilities ({asset.vulnerabilities.length})
                      </span>
                      {asset.vulnerabilities.length === 0 ? (
                        <span className="text-neutral-400 flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                          No known public CVEs flagged
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {asset.vulnerabilities.slice(0, 2).map((v, vIdx) => (
                            <div
                              key={`asset-vuln-${v.cveId}-${vIdx}`}
                              className="w-full flex items-center justify-between p-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] group/cve"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectCVE?.(v.cveId);
                                }}
                                className="text-white font-bold hover:underline"
                              >
                                {v.cveId}
                              </button>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-black font-extrabold">
                                  CVSS {v.cvss}
                                </span>
                                <AIExplainButton
                                  category="vulnerability"
                                  identifier={v.cveId}
                                  itemData={v}
                                  onExplain={(cat, id, item) => handleExplainItem(cat, id, item, asset)}
                                  variant="icon"
                                  className="!p-0"
                                />
                              </div>
                            </div>
                          ))}
                          {asset.vulnerabilities.length > 2 && (
                            <span className="text-[10px] text-neutral-400 block">
                              +{asset.vulnerabilities.length - 2} additional CVEs
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Metadata & Inspect Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400">
                    <div className="flex items-center gap-3">
                      <span>Observed: {new Date(asset.lastObserved).toLocaleString()}</span>
                      {asset.cloudProvider && (
                        <>
                          <span>•</span>
                          <span>Host: {asset.cloudProvider}</span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectAsset(asset)}
                      className="flex items-center gap-1 text-white hover:text-neutral-200 font-semibold group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Deep Asset Intelligence</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })
          )}

        </main>
      </div>

      {/* Item Explainer Modal */}
      {activeExplainingItem && (
        <AIItemExplainerModal
          isOpen={!!activeExplainingItem}
          onClose={() => setActiveExplainingItem(null)}
          category={activeExplainingItem.category}
          identifier={activeExplainingItem.identifier}
          itemData={activeExplainingItem.itemData}
          assetContext={activeExplainingItem.assetContext}
          onOpenChatWithPrompt={(prompt) => {
            if (onOpenAIQuery) {
              onOpenAIQuery(prompt);
            } else if (onOpenAIForAsset && activeExplainingItem.assetContext) {
              onOpenAIForAsset(activeExplainingItem.assetContext as AssetIntelligence);
            }
          }}
        />
      )}

    </div>
  );
};

