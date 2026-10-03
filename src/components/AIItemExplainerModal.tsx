import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Info,
  Layers,
  Terminal,
  Server,
  Lock,
  Globe,
  FileText,
  Cpu,
  MessageSquare
} from 'lucide-react';
import { AIExplanationItem, AIExplanationCategory, ConfidenceLevel, AssetIntelligence } from '../types';
import { generateLocalAIExplanation } from '../utils/aiSecurityExplainer';

interface AIItemExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AIExplanationCategory;
  identifier: string;
  itemData?: any;
  assetContext?: Partial<AssetIntelligence>;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const AIItemExplainerModal: React.FC<AIItemExplainerModalProps> = ({
  isOpen,
  onClose,
  category,
  identifier,
  itemData,
  assetContext,
  onOpenChatWithPrompt
}) => {
  const [explanation, setExplanation] = useState<AIExplanationItem>(() => 
    generateLocalAIExplanation(category, identifier, itemData, assetContext)
  );
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Initialize with instant local knowledge
      const local = generateLocalAIExplanation(category, identifier, itemData, assetContext);
      setExplanation(local);
      setCustomQuestion('');
    }
  }, [isOpen, category, identifier, itemData, assetContext]);

  if (!isOpen) return null;

  const fetchLiveGeminiExplanation = async () => {
    setIsLoadingLive(true);
    try {
      const res = await fetch('/api/ai/explain-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          identifier,
          itemData,
          assetContext
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.structuredExplanation) {
          setExplanation(data.structuredExplanation);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live Gemini analysis, keeping local:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'port': return <Terminal className="w-5 h-5 text-white" />;
      case 'service': return <Server className="w-5 h-5 text-white" />;
      case 'technology': return <Cpu className="w-5 h-5 text-white" />;
      case 'vulnerability': return <AlertTriangle className="w-5 h-5 text-white" />;
      case 'dns': return <Globe className="w-5 h-5 text-white" />;
      case 'ssl': return <Lock className="w-5 h-5 text-white" />;
      case 'header': return <FileText className="w-5 h-5 text-white" />;
      case 'ip': return <Layers className="w-5 h-5 text-white" />;
      default: return <ShieldCheck className="w-5 h-5 text-white" />;
    }
  };

  const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'Observed':
        return {
          label: 'Observed Data',
          badgeClass: 'bg-white text-black font-extrabold',
          desc: 'Verified factual telemetry obtained directly from data probe.'
        };
      case 'Inferred':
        return {
          label: 'AI Inferred',
          badgeClass: 'bg-neutral-800 text-neutral-200 border border-neutral-600',
          desc: 'Probabilistic deduction based on tech stack or network configuration.'
        };
      case 'Potential':
        return {
          label: 'Potential Risk',
          badgeClass: 'bg-neutral-800 text-neutral-300 border border-white/20',
          desc: 'Possible security concern requiring active verification.'
        };
      case 'Confirmed':
        return {
          label: 'Confirmed Vulnerability',
          badgeClass: 'bg-white text-black font-extrabold shadow-sm',
          desc: 'Vulnerability supported by documented CVE advisories.'
        };
    }
  };

  const confInfo = getConfidenceBadge(explanation.confidence);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-800 border border-white/10">
              {getCategoryIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  AI Security Explainer • {category.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${confInfo.badgeClass}`}>
                  {confInfo.label}
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {explanation.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLiveGeminiExplanation}
              disabled={isLoadingLive}
              title="Refresh with live Gemini analysis"
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingLive ? 'animate-spin text-white' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Top Banner: What is this & What does it mean */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-neutral-300" />
                What is this?
              </span>
              <p className="text-neutral-200 leading-relaxed font-sans text-[13px]">
                {explanation.whatIsIt}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                What does the result mean?
              </span>
              <p className="text-neutral-300 leading-relaxed font-sans text-[13px]">
                {explanation.whatItMeans}
              </p>
            </div>
          </div>

          {/* Grid: Why it matters & How useful for defense */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/5 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Why does it matter?
              </span>
              <p className="text-neutral-300 text-xs font-sans leading-relaxed">
                {explanation.whyItMatters}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/5 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                How is this useful for security teams?
              </span>
              <p className="text-neutral-300 text-xs font-sans leading-relaxed">
                {explanation.howUseful}
              </p>
            </div>
          </div>

          {/* Security Risk & Impact Box */}
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-neutral-300" />
                Security Risk & Impact
              </span>
              {explanation.priority && (
                <span className="text-[10px] text-neutral-400">
                  Priority Level: <strong className="text-white">{explanation.priority}</strong>
                </span>
              )}
            </div>
            <p className="text-neutral-200 text-xs font-sans leading-relaxed">
              {explanation.securityRisk}
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-white/10 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              Recommended Defensive Next Steps
            </span>
            <p className="text-white text-xs font-sans font-medium">
              {explanation.recommendedAction}
            </p>

            {explanation.nextSteps && explanation.nextSteps.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                {explanation.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] font-sans">
                    <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 text-[9px] font-mono shrink-0 uppercase font-bold mt-0.5">
                      {step.priority}
                    </span>
                    <span className="text-neutral-300">
                      <strong>{step.action}</strong> {step.why && <span className="text-neutral-400">— {step.why}</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evidence and Confidence Note */}
          <div className="p-3 rounded-lg bg-neutral-900/30 border border-white/5 flex items-start gap-2 text-[11px] text-neutral-400 font-sans">
            <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-mono font-semibold">Evidence & Verification: </span>
              {explanation.evidence}
              <p className="text-[10px] text-neutral-400 mt-1 italic">
                AI-generated analysis based on available telemetry. Always verify findings before modifying production environments.
              </p>
            </div>
          </div>

          {/* Suggested Quick AI Questions */}
          {explanation.suggestedQuestions && explanation.suggestedQuestions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-neutral-400" />
                Ask Follow-Up Question with AI
              </span>
              <div className="flex flex-wrap gap-2">
                {explanation.suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onClose();
                      onOpenChatWithPrompt(`Concerning ${explanation.title}: ${q}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-[11px] transition-colors text-left"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-neutral-300 shrink-0" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-neutral-900/80 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              onClose();
              onOpenChatWithPrompt(`Provide a complete defensive remediation playbook for ${explanation.title} on host ${assetContext?.ip || 'target'}.`);
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open in AI Threat Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] text-neutral-400 font-mono">
            Powered by BLACKTRACE AI
          </span>
        </div>

      </div>
    </div>
  );
};
