import React from 'react';
import { BookOpen, Search, Terminal, AlertTriangle, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-xs text-neutral-300">
      
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs text-neutral-300">
          <BookOpen className="w-3.5 h-3.5 text-white" />
          <span>CYBER THREAT INTELLIGENCE MANUAL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          BLACKTRACE Documentation
        </h1>
        <p className="text-sm text-neutral-400">
          Master the search query engine syntax, Boolean logic, risk calculations, and enterprise integration workflows.
        </p>
      </div>

      {/* Section 1: Search Query Syntax */}
      <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-white" />
          <span>1. Search Syntax & Filter Operators</span>
        </h2>
        <p className="text-neutral-400 leading-relaxed">
          BLACKTRACE supports direct IP queries, domain lookups, CVE identifiers, and advanced faceted search expressions using key-value filters.
        </p>

        <div className="rounded-xl bg-neutral-900/80 border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-800/60 text-white uppercase text-[10px]">
              <tr>
                <th className="p-3">Filter Keyword</th>
                <th className="p-3">Example Query</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              <tr>
                <td className="p-3 font-bold text-white">port:</td>
                <td className="p-3 text-neutral-200">port:22</td>
                <td className="p-3 text-neutral-400">Filters assets with specific listening TCP/UDP port.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">product: / tech:</td>
                <td className="p-3 text-neutral-200">product:nginx</td>
                <td className="p-3 text-neutral-400">Matches software components and web servers.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">country:</td>
                <td className="p-3 text-neutral-200">country:DE</td>
                <td className="p-3 text-neutral-400">Limits results to ISO 2-letter country codes.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">asn:</td>
                <td className="p-3 text-neutral-200">asn:AS15169</td>
                <td className="p-3 text-neutral-400">Filters by Autonomous System Number.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">severity:</td>
                <td className="p-3 text-neutral-200">severity:CRITICAL</td>
                <td className="p-3 text-neutral-400">Filters hosts with calculated risk severity (CRITICAL, HIGH, MEDIUM, LOW).</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">AND / OR</td>
                <td className="p-3 text-neutral-200">product:nginx AND port:443</td>
                <td className="p-3 text-neutral-400">Combines multiple conditions using Boolean logic.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Attack Surface Risk Scoring */}
      <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>2. Attack Surface Risk Calculation Formula</span>
        </h2>
        <p className="text-neutral-400 leading-relaxed">
          The BLACKTRACE Risk Engine calculates host vulnerability index (0 to 100) using a composite weighted formula:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-300">
          <li><strong>Exposed High-Risk Management Ports (35% weight):</strong> Public accessibility of SSH (22), RDP (3389), Redis (6379), Kubelet (10250), Modbus (502).</li>
          <li><strong>Matched CVE CVSS & EPSS (35% weight):</strong> Normalized base score of active vulnerabilities, elevated if listed in the CISA KEV catalog.</li>
          <li><strong>Cryptographic & Transport Security (15% weight):</strong> Expired SSL/TLS certificates, deprecated protocols (TLS 1.0/1.1), or weak cipher suites.</li>
          <li><strong>Network Anonymity & Relay Status (15% weight):</strong> Node identification as Tor exit relays, open proxies, or botnet command-and-control nodes.</li>
        </ul>
      </div>

      {/* Section 3: Responsible Research Guidelines */}
      <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-3">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span>3. Defensive Security & Responsible Usage</span>
        </h2>
        <p className="text-neutral-400 leading-relaxed">
          BLACKTRACE is engineered strictly for authorized security researchers, SOC analysts, and organizations conducting defensive attack surface management and perimeter monitoring. Unauthorized exploitation of identified vulnerabilities is strictly forbidden.
        </p>
      </div>

    </div>
  );
};
