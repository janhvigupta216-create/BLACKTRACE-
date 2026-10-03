import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  Filter, 
  ArrowUpRight, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SeverityLevel, VulnerabilityRecord } from '../types';

interface VulnerabilitiesViewProps {
  onSelectCVE: (cveId: string) => void;
  onSearchAssetWithCVE: (cveId: string) => void;
  onOpenAI: (question: string) => void;
}

export const VulnerabilitiesView: React.FC<VulnerabilitiesViewProps> = ({
  onSelectCVE,
  onSearchAssetWithCVE,
  onOpenAI
}) => {
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [onlyKev, setOnlyKev] = useState(false);
  const [onlyExploit, setOnlyExploit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityRecord | null>(null);

  useEffect(() => {
    fetchVulnerabilities();
  }, [searchTerm, selectedSeverity, onlyKev, onlyExploit]);

  const fetchVulnerabilities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedSeverity !== 'ALL') params.append('severity', selectedSeverity);
      if (onlyKev) params.append('inKev', 'true');
      if (onlyExploit) params.append('hasExploit', 'true');

      const res = await fetch(`/api/vulnerabilities?${params.toString()}`);
      const data = await res.json();
      setVulnerabilities(data.vulnerabilities || []);
      if (data.vulnerabilities?.length > 0 && !selectedVuln) {
        setSelectedVuln(data.vulnerabilities[0]);
      }
    } catch (e) {
      console.error('Failed to load vulnerabilities:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300">
          <AlertTriangle className="w-3.5 h-3.5 text-white" />
          <span>CVE & THREAT EXPLOIT INTELLIGENCE DATABASE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Vulnerability & Exploit Feed
        </h1>
        <p className="text-sm text-neutral-400 font-mono">
          Catalog of high-impact Common Vulnerabilities and Exposures (CVEs) actively scanned and correlated with Internet assets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-950/90 border border-white/15 backdrop-blur-xl font-mono text-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              id="cve-search-input"
              type="text"
              placeholder="Search CVE ID, affected product (e.g. OpenSSH, Apache), or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/30"
            >
              <option value="ALL">ALL SEVERITIES</option>
              <option value="CRITICAL">CRITICAL (9.0 - 10.0)</option>
              <option value="HIGH">HIGH (7.0 - 8.9)</option>
              <option value="MEDIUM">MEDIUM (4.0 - 6.9)</option>
            </select>

            <button
              onClick={() => setOnlyKev(!onlyKev)}
              className={`px-3 py-2 rounded-xl border transition-colors ${
                onlyKev ? 'bg-white text-black font-bold border-white' : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              CISA KEV Only
            </button>

            <button
              onClick={() => setOnlyExploit(!onlyExploit)}
              className={`px-3 py-2 rounded-xl border transition-colors ${
                onlyExploit ? 'bg-white text-black font-bold border-white' : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              Weaponized Exploit
            </button>
          </div>
        </div>
      </div>

      {/* Grid: CVE List & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Left List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="p-8 rounded-xl bg-neutral-950 border border-white/10 text-center text-neutral-400">
              Loading vulnerability index...
            </div>
          ) : vulnerabilities.length === 0 ? (
            <div className="p-8 rounded-xl bg-neutral-950 border border-white/10 text-center text-neutral-400">
              No matching CVEs found.
            </div>
          ) : (
            vulnerabilities.map((vuln, idx) => {
              const isSelected = selectedVuln?.cveId === vuln.cveId;
              return (
                <div
                  key={`vuln-${vuln.cveId}-${idx}`}
                  id={`vuln-card-${vuln.cveId}`}
                  onClick={() => setSelectedVuln(vuln)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-neutral-900/90 border-white/40 shadow-xl'
                      : 'bg-neutral-950/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-white">{vuln.cveId}</span>
                        <span className="px-2 py-0.5 rounded bg-white text-black font-extrabold text-[10px]">
                          CVSS {vuln.cvss} ({vuln.severity})
                        </span>
                        {vuln.inCisaKev && (
                          <span className="px-1.5 py-0.5 rounded bg-neutral-800 border border-white/20 text-white font-bold text-[9px]">
                            CISA KEV
                          </span>
                        )}
                        {vuln.exploitAvailable && (
                          <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[9px]">
                            {vuln.exploitType || 'Exploit Available'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-xs">{vuln.title}</h3>
                      <p className="text-neutral-400 line-clamp-2">{vuln.description}</p>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-white translate-x-1' : 'text-neutral-600'}`} />
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] text-neutral-400">
                    <span>Target: <strong className="text-neutral-200">{vuln.affectedProduct}</strong></span>
                    <span>EPSS: <strong className="text-white">{(vuln.epssScore * 100).toFixed(1)}%</strong></span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-1">
          {selectedVuln ? (
            <div className="sticky top-20 p-5 rounded-2xl bg-neutral-950/90 border border-white/15 space-y-4 shadow-2xl backdrop-blur-xl">
              
              <div className="space-y-1 pb-3 border-b border-white/10">
                <span className="text-lg font-bold text-white block">{selectedVuln.cveId}</span>
                <span className="text-xs text-neutral-400">{selectedVuln.cwe}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">CVSS Base Score:</span>
                  <span className="text-white font-bold">{selectedVuln.cvss} / 10.0</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">EPSS Probability:</span>
                  <span className="text-white">{(selectedVuln.epssScore * 100).toFixed(2)}% ({selectedVuln.epssPercentile}th percentile)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">CISA KEV Catalog:</span>
                  <span className={selectedVuln.inCisaKev ? 'text-white font-bold' : 'text-neutral-400'}>
                    {selectedVuln.inCisaKev ? 'YES (Active Exploitation)' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Exploit Status:</span>
                  <span className="text-white">{selectedVuln.exploitType || 'None'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Affected Product:</span>
                  <span className="text-neutral-200">{selectedVuln.affectedProduct}</span>
                </div>
              </div>

              {/* Remediation Summary */}
              {selectedVuln.remediation && (
                <div className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                  <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                    Remediation Advisory
                  </span>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {selectedVuln.remediation.summary}
                  </p>
                  {selectedVuln.remediation.recommendedVersion && (
                    <span className="text-white text-[11px] block font-bold">
                      Recommended: {selectedVuln.remediation.recommendedVersion}
                    </span>
                  )}
                </div>
              )}

              {/* Search Assets affected by this CVE */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSearchAssetWithCVE(selectedVuln.cveId)}
                  className="w-full py-2 rounded-lg bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Exposed Assets</span>
                </button>

                <button
                  onClick={() => onOpenAI(`Explain the technical attack vector and mitigation of ${selectedVuln.cveId} in detail.`)}
                  className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Exploit Breakdown</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-6 rounded-xl bg-neutral-950 border border-white/10 text-center text-neutral-400">
              Select a vulnerability to view full technical intelligence.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
