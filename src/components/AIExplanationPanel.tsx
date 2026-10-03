import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  HelpCircle,
  Activity,
  Layers,
  Terminal,
  Server
} from 'lucide-react';
import { AssetIntelligence, SearchQueryResponse, SeverityLevel, ConfidenceLevel } from '../types';
import { buildAssetSummaryExplanation } from '../utils/aiSecurityExplainer';

interface AIExplanationPanelProps {
  asset?: AssetIntelligence;
  searchResult?: SearchQueryResponse | { total: number; assets?: AssetIntelligence[]; results?: AssetIntelligence[] };
  query?: string;
  onOpenChat: (initialPrompt?: string) => void;
  defaultExpanded?: boolean;
  className?: string;
}

export const AIExplanationPanel: React.FC<AIExplanationPanelProps> = ({
  asset,
  searchResult,
  query,
  onOpenChat,
  defaultExpanded = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (asset) {
    const summary = buildAssetSummaryExplanation(asset);

    return (
      <div className={`rounded-2xl bg-neutral-950/90 border border-white/20 backdrop-blur-xl shadow-xl overflow-hidden font-mono text-xs transition-all ${className}`}>
        
        {/* Header Bar */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-neutral-900/90 via-neutral-950 to-neutral-900/60 hover:bg-neutral-900 transition-colors border-b border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-black font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  AI Security Analysis
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] text-neutral-300">
                  Defensive Posture Interpretation
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                Automated threat explanation and prioritized defensive remediation for {asset.ip}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-[11px] text-neutral-300 font-sans">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Gemini 3.7 Flash
            </span>
            <button
              type="button"
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-5 sm:p-6 space-y-6 animate-fade-in">
            
            {/* Top Analysis Grid: What is this / What does it mean / Why it matters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-neutral-400 uppercase font-bold text-[10px]">
                  <Info className="w-3.5 h-3.5 text-white" />
                  <span>What is this?</span>
                </div>
                <p className="text-neutral-200 text-xs font-sans leading-relaxed">
                  {summary.whatIsThis}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-neutral-400 uppercase font-bold text-[10px]">
                  <Activity className="w-3.5 h-3.5 text-white" />
                  <span>What does the result mean?</span>
                </div>
                <p className="text-neutral-200 text-xs font-sans leading-relaxed">
                  {summary.whatDoesItMean}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-neutral-400 uppercase font-bold text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-white" />
                  <span>Why does it matter?</span>
                </div>
                <p className="text-neutral-200 text-xs font-sans leading-relaxed">
                  {summary.whyDoesItMatter}
                </p>
              </div>

            </div>

            {/* How security teams can use this */}
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-900/40 border border-white/10 space-y-3">
              <h4 className="text-xs uppercase font-bold text-white tracking-wider flex items-center justify-between">
                <span>How Security Teams Can Use This Intelligence</span>
                <span className="text-[10px] text-neutral-400 font-normal">Defensive Security Playbook</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans">
                {summary.howSecurityTeamsUseThis.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Score Breakdown & Factors */}
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-900/80 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <h4 className="text-xs uppercase font-bold text-white tracking-wider">
                    Attack Surface Risk Score Breakdown: {summary.riskScoreExplanation.score}/100 ({summary.riskScoreExplanation.severity})
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    {summary.riskScoreExplanation.whyThisScore}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-extrabold uppercase shrink-0 border ${
                  summary.riskScoreExplanation.severity === 'CRITICAL' ? 'bg-white text-black border-white' :
                  summary.riskScoreExplanation.severity === 'HIGH' ? 'bg-neutral-200 text-black border-neutral-300' :
                  'bg-neutral-800 text-neutral-200 border-neutral-700'
                }`}>
                  {summary.riskScoreExplanation.severity}
                </span>
              </div>

              {/* Factors grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {summary.riskScoreExplanation.contributingFactors.map((f, i) => (
                  <div key={i} className="p-3 rounded-lg bg-neutral-950 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-neutral-400 uppercase">{f.factor}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                        f.impact === 'high' ? 'bg-white text-black' : f.impact === 'medium' ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-900 text-neutral-400'
                      }`}>
                        {f.impact}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Explicit Disclaimer */}
              <div className="p-3 rounded-lg bg-neutral-950/60 border border-white/5 text-[11px] text-neutral-400 font-sans italic">
                ℹ️ {summary.riskScoreExplanation.disclaimer}
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Recommended Next Steps (Prioritized Actions)</span>
                </h4>
                <span className="text-[10px] text-neutral-400 font-sans">Triage Order</span>
              </div>

              <div className="space-y-2.5">
                {summary.recommendedNextSteps.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-neutral-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                        step.level === 'Critical' ? 'bg-white text-black' :
                        step.level === 'High' ? 'bg-neutral-200 text-black' :
                        step.level === 'Medium' ? 'bg-neutral-800 text-neutral-200' :
                        'bg-neutral-900 text-neutral-400'
                      }`}>
                        Priority {step.priority} — {step.level}
                      </span>
                      <div>
                        <strong className="text-white text-xs block">{step.title}</strong>
                        <p className="text-neutral-300 text-[11px]">{step.action}</p>
                      </div>
                    </div>
                    {step.targetComponent && (
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/10 text-[10px] text-neutral-400 font-mono shrink-0">
                        {step.targetComponent}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence & Confidence Findings */}
            <div className="p-4 rounded-xl bg-neutral-900/30 border border-white/5 space-y-2 text-xs font-sans">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                Confidence Classification & Telemetry Evidence
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {summary.confidenceFindings.map((cf, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-neutral-950/70 border border-white/5 space-y-1">
                    <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 text-[9px] font-mono uppercase font-bold">
                      {cf.level}
                    </span>
                    <p className="text-neutral-300 text-[11px]">{cf.text}</p>
                    <span className="text-[10px] text-neutral-400 font-mono block truncate">
                      Source: {cf.evidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Interactive Prompt Launcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Ask AI:</span>
                <button
                  onClick={() => onOpenChat(`Explain the security posture of ${asset.ip} in simple terms`)}
                  className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors"
                >
                  Explain in simple terms
                </button>
                <button
                  onClick={() => onOpenChat(`Which vulnerability or port on ${asset.ip} should I fix first and why?`)}
                  className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors"
                >
                  Which finding to fix first?
                </button>
                <button
                  onClick={() => onOpenChat(`Generate a step-by-step administrator hardening checklist for ${asset.ip}`)}
                  className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors"
                >
                  Administrator checklist
                </button>
              </div>

              <button
                onClick={() => onOpenChat(`Perform a complete defensive intelligence review for ${asset.ip} (${asset.hostname || asset.domain})`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Full AI Threat Chat</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        )}

      </div>
    );
  }

  // If in Search Results Mode
  if (searchResult) {
    const total = searchResult.total;
    const assetList = 'results' in searchResult && Array.isArray(searchResult.results) 
      ? searchResult.results 
      : ('assets' in searchResult && Array.isArray(searchResult.assets) ? searchResult.assets : []);
    const highRisk = assetList.filter(a => a.riskScore >= 70).length;

    return (
      <div className={`rounded-2xl bg-neutral-950/90 border border-white/20 backdrop-blur-xl shadow-xl overflow-hidden font-mono text-xs transition-all ${className}`}>
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-neutral-900/90 via-neutral-950 to-neutral-900/60 hover:bg-neutral-900 transition-colors border-b border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-black font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  AI Security Analysis • Search Output Interpretation
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] text-neutral-300">
                  {total} Assets Discovered
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                Defensive risk overview and attack surface pattern analysis for query: <strong className="text-white font-mono">{query || 'Global Assets'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-5 sm:p-6 space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400">
                  What is this result set?
                </span>
                <p className="text-neutral-200 leading-relaxed">
                  The search retrieved {total} Internet-facing host(s) matching your criteria. {highRisk > 0 ? `${highRisk} asset(s) present elevated risk scores (>=70) due to confirmed CVEs or open management sockets.` : 'No critical mass-exploitation signals detected in this sample.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400">
                  Why does it matter?
                </span>
                <p className="text-neutral-200 leading-relaxed">
                  Correlating exposed technologies and autonomous systems allows organizations to detect external perimeter drift, unpatched software releases, and unauthorized shadow assets.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400">
                  How can security teams use this?
                </span>
                <p className="text-neutral-200 leading-relaxed">
                  Export discovered indicators to threat intelligence feeds, cross-reference IP ranges against internal firewalls, and trigger automated vulnerability patch validation.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Quick AI Analysis:</span>
                <button
                  onClick={() => onOpenChat(`Summarize the main security risks identified across the search results for "${query}"`)}
                  className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors font-mono"
                >
                  Summarize search results
                </button>
                <button
                  onClick={() => onOpenChat(`Identify the most critical open ports and CVEs in this search result for "${query}"`)}
                  className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors font-mono"
                >
                  Identify critical exposures
                </button>
              </div>

              <button
                onClick={() => onOpenChat(`Provide an in-depth threat intelligence summary of search results matching "${query}"`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-sm font-mono"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI About Results</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
