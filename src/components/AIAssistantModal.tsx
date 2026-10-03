import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers,
  Terminal,
  Copy,
  Check,
  Info
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AIAnalysisResponse, AssetIntelligence, AIExplanationItem } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAsset?: AssetIntelligence | null;
  initialQuestion?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentAsset,
  initialQuestion
}) => {
  const [messages, setMessages] = useState<
    Array<{
      sender: 'user' | 'assistant';
      text: string;
      findings?: AIAnalysisResponse['findings'];
      actions?: string[];
      structuredExplanation?: AIExplanationItem;
      timestamp: string;
    }>
  >([
    {
      sender: 'assistant',
      text: currentAsset 
        ? `Hello! I am your BLACKTRACE AI Security Analyst. I have loaded target intelligence for **${currentAsset.ip}** (${currentAsset.hostname || currentAsset.domain}). I can provide defensive risk analysis, interpret port exposures, evaluate SSL cryptographic hygiene, triage CVEs, and generate remediation playbooks.`
        : `Hello! I am your BLACKTRACE AI Security Analyst. You can ask me to evaluate exposed perimeters, triage CVEs, formulate defensive remediation playbooks, or interpret attack surface data.`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [input, setInput] = useState(initialQuestion || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion);
      handleSend(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const textToSend = queryToSend || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          assetData: currentAsset || undefined,
          contextType: currentAsset ? 'asset_inspection' : 'general'
        })
      });

      const data: AIAnalysisResponse = await res.json();

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.answer,
          findings: data.findings,
          actions: data.recommendedActions,
          structuredExplanation: data.structuredExplanation,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `⚠️ Analysis error: ${e.message || 'Unable to connect to AI engine.'}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const promptChips = currentAsset ? [
    `What does the risk score of ${currentAsset.ip} mean?`,
    `Triage all vulnerabilities found on ${currentAsset.ip}`,
    `Generate an emergency firewall ACL to protect this host`,
    `Are there any unauthenticated services running?`
  ] : [
    `How do I search for exposed Redis instances without authentication?`,
    `Explain the impact of CVE-2024-6387 regreSSHion`,
    `What are the best query patterns for discovering exposed SCADA Modbus ports?`,
    `How does BLACKTRACE calculate attack surface risk scores?`
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl h-[85vh] flex flex-col rounded-2xl bg-neutral-950 border border-white/20 shadow-2xl overflow-hidden font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 bg-neutral-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">BLACKTRACE AI Security Analyst</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-white/10">Gemini 3.7 Flash</span>
              </div>
              {currentAsset ? (
                <span className="text-[11px] text-neutral-400">Context: {currentAsset.ip} ({currentAsset.hostname})</span>
              ) : (
                <span className="text-[11px] text-neutral-400">Global Threat Intelligence Mode</span>
              )}
            </div>
          </div>

          <button
            id="ai-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                  m.sender === 'user'
                    ? 'bg-white text-black font-medium'
                    : 'bg-neutral-900/90 border border-white/10 text-neutral-200 shadow-lg'
                }`}
              >
                {/* Structured Explanation Cards if returned */}
                {m.structuredExplanation && (
                  <div className="p-3 rounded-xl bg-black/50 border border-white/15 space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span className="text-white font-bold text-xs">{m.structuredExplanation.title}</span>
                      <span className="px-2 py-0.5 rounded bg-white text-black text-[9px] font-bold uppercase">
                        {m.structuredExplanation.confidence}
                      </span>
                    </div>
                    <div className="space-y-1.5 font-sans text-xs">
                      <div>
                        <strong className="text-neutral-400 font-mono text-[10px] uppercase block">What is this?</strong>
                        <p className="text-neutral-200 text-[11px]">{m.structuredExplanation.whatIsIt}</p>
                      </div>
                      <div>
                        <strong className="text-neutral-400 font-mono text-[10px] uppercase block">Security Risk</strong>
                        <p className="text-neutral-300 text-[11px]">{m.structuredExplanation.securityRisk}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Findings categorized badges if present */}
                {m.findings && m.findings.length > 0 && (
                  <div className="space-y-1.5 pb-2 border-b border-white/10">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                      Intelligence Classifications:
                    </span>
                    <div className="space-y-1">
                      {m.findings.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px]">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                            f.type === 'Confirmed Vulnerability' ? 'bg-white text-black font-extrabold' :
                            f.type === 'Potential Risk' ? 'bg-neutral-700 text-white' :
                            f.type === 'AI Inference' ? 'bg-neutral-800 border border-white/20 text-neutral-200' :
                            'bg-neutral-800 text-neutral-300'
                          }`}>
                            {f.type}
                          </span>
                          <span className="text-neutral-300">{f.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Body with Markdown */}
                <div className={`prose prose-invert max-w-none text-xs leading-relaxed ${m.sender === 'user' ? 'text-black' : 'text-neutral-200'}`}>
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>

                {/* Recommended actions checklist if available */}
                {m.actions && m.actions.length > 0 && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                    <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                      Recommended Defensive Actions:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px]">
                      {m.actions.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={`text-[9px] ${m.sender === 'user' ? 'text-neutral-600' : 'text-neutral-500'} text-right`}>
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center shrink-0 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-neutral-400 p-2 font-mono text-xs">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing attack surface telemetry...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 bg-neutral-900/40 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
          {promptChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white whitespace-nowrap text-[10px] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-neutral-900/90 border-t border-white/10 flex items-center gap-2"
        >
          <input
            id="ai-modal-input"
            type="text"
            placeholder="Ask AI Analyst about asset risks, CVEs, or mitigation tactics..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder:text-neutral-500 font-mono text-xs focus:outline-none focus:border-white/40"
          />
          <button
            type="submit"
            id="ai-modal-send-btn"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-40 transition-colors font-bold"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

