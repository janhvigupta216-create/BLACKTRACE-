import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, Key, Sparkles, BookOpen, Layers } from 'lucide-react';

export const ApiPlaygroundView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'ip' | 'domain' | 'cve' | 'search'>('ip');
  const [targetParam, setTargetParam] = useState('198.51.100.45');
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'node'>('curl');
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    { id: 'ip', name: 'GET /api/v1/ip/{ip}', defaultParam: '198.51.100.45', desc: 'Inspect IP address threat intelligence, open ports and geo-location.' },
    { id: 'domain', name: 'GET /api/v1/domain/{domain}', defaultParam: 'example.com', desc: 'Query domain DNS records, subdomains, SSL certificates, and WHOIS ASN.' },
    { id: 'cve', name: 'GET /api/v1/cve/{cveId}', defaultParam: 'CVE-2024-6387', desc: 'Retrieve CVSS scores, EPSS metrics, and CISA KEV exploit intelligence.' },
    { id: 'search', name: 'GET /api/v1/search?q={query}', defaultParam: 'product:nginx AND port:443', desc: 'Execute complex Boolean and faceted attack surface queries.' },
  ];

  const getCodeSnippet = () => {
    const baseUrl = window.location.origin;
    let url = `${baseUrl}/api/v1/${selectedEndpoint}/${targetParam}`;
    if (selectedEndpoint === 'search') {
      url = `${baseUrl}/api/v1/search?q=${encodeURIComponent(targetParam)}`;
    }

    if (selectedLang === 'curl') {
      return `curl -X GET "${url}" \\
  -H "Authorization: Bearer bt_live_demo_key_9f8a2c1" \\
  -H "Accept: application/json"`;
    }
    if (selectedLang === 'python') {
      return `import requests

url = "${url}"
headers = {
    "Authorization": "Bearer bt_live_demo_key_9f8a2c1",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`;
    }
    return `import axios from 'axios';

const response = await axios.get('${url}', {
  headers: {
    'Authorization': 'Bearer bt_live_demo_key_9f8a2c1',
    'Accept': 'application/json'
  }
});

console.log(response.data);`;
  };

  const executeApiCall = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/${selectedEndpoint}/${targetParam}`;
      if (selectedEndpoint === 'search') {
        url = `/api/v1/search?q=${encodeURIComponent(targetParam)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResponseJson(JSON.stringify({ error: 'Request Failed', message: e.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300">
          <Terminal className="w-3.5 h-3.5 text-white" />
          <span>DEVELOPER & SOC REST API PLATFORM</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          BLACKTRACE REST API & Playground
        </h1>
        <p className="text-sm text-neutral-400 font-mono">
          Integrate Internet threat intelligence, automated asset enrichment, and CVE vulnerability telemetry directly into your SIEM, SOAR, or custom pipelines.
        </p>
      </div>

      {/* Main Grid: Endpoint Selector & Request Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Left: Endpoint Directory */}
        <div className="space-y-3">
          <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
            API Endpoints (v1)
          </span>

          {endpoints.map((ep) => {
            const isSelected = selectedEndpoint === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => {
                  setSelectedEndpoint(ep.id as any);
                  setTargetParam(ep.defaultParam);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? 'bg-neutral-900 border-white/40 shadow-lg' : 'bg-neutral-950/80 border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-white font-bold block">{ep.name}</span>
                <p className="text-neutral-400 text-[11px] mt-1">{ep.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Center & Right: Code Builder & Live Response */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Parameter Configurator */}
          <div className="p-5 rounded-2xl bg-neutral-950/90 border border-white/15 space-y-3">
            <label className="block text-neutral-300 font-bold uppercase text-[10px]">
              Query Parameter / Target
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetParam}
                onChange={(e) => setTargetParam(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono focus:outline-none focus:border-white/30"
              />
              <button
                onClick={executeApiCall}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>{loading ? 'Sending...' : 'Test API'}</span>
              </button>
            </div>
          </div>

          {/* Code Snippet Tabs */}
          <div className="rounded-2xl bg-neutral-950 border border-white/10 overflow-hidden">
            <div className="p-3 bg-neutral-900/60 border-b border-white/10 flex items-center justify-between">
              <div className="flex gap-2">
                {(['curl', 'python', 'node'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1 rounded text-xs font-mono uppercase ${
                      selectedLang === lang ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang === 'node' ? 'Node.js' : lang}
                  </button>
                ))}
              </div>
              <button
                onClick={copyCode}
                className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Copy snippet"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <pre className="p-4 text-neutral-200 text-xs overflow-x-auto font-mono bg-black/40">
              {getCodeSnippet()}
            </pre>
          </div>

          {/* Response Inspector */}
          {responseJson && (
            <div className="rounded-2xl bg-neutral-950 border border-white/10 overflow-hidden space-y-1 animate-in fade-in">
              <div className="p-3 bg-neutral-900/60 border-b border-white/10 flex items-center justify-between">
                <span className="font-bold text-white text-xs uppercase">Live Response 200 OK</span>
                <span className="text-[10px] text-neutral-400">Content-Type: application/json</span>
              </div>
              <pre className="p-4 text-neutral-300 text-[11px] overflow-x-auto max-h-96 font-mono bg-black/60">
                {responseJson}
              </pre>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
