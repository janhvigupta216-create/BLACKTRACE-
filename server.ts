import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { ASSETS_DATABASE, GLOBAL_TELEMETRY, VULNERABILITY_DATABASE } from './server/threatData';
import { detectQueryType, executeSearch, generateSyntheticAsset } from './server/searchEngine';
import { analyzeWithGemini } from './server/geminiService';
import { ApiKeyRecord, UserSavedItem } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory user state & bookmarks
let savedItems: UserSavedItem[] = [
  {
    id: 'save-1',
    type: 'asset',
    queryOrId: 'asset-198-51-100-45',
    title: '198.51.100.45 (Vulnerable Corporate Edge)',
    createdAt: new Date().toISOString(),
    tags: ['Critical', 'OpenSSH', 'Apache 2.4.49'],
    notes: 'Exposed SSH server vulnerable to regreSSHion and path traversal.'
  },
  {
    id: 'save-2',
    type: 'search',
    queryOrId: 'product:nginx AND port:443',
    title: 'Nginx HTTPS Perimeters',
    createdAt: new Date().toISOString(),
    tags: ['Monitoring', 'Cloud']
  }
];

let apiKeys: ApiKeyRecord[] = [
  {
    id: 'key-1',
    name: 'Production Threat Feed API',
    keyPrefix: 'bt_live_9f8a2c1...',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    rateLimitPerMin: 120,
    usageToday: 342
  }
];

// Audit log
const auditLogs: { id: string; timestamp: string; action: string; query?: string; ip: string }[] = [];

// ==================== CORE API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'BLACKTRACE Core v4.2', timestamp: new Date().toISOString() });
});

// Search API
app.post('/api/search', (req, res) => {
  try {
    const { query, type, page, limit, filters, sortBy } = req.body;
    
    // Log audit
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SEARCH_QUERY',
      query: query || '',
      ip: req.ip || '127.0.0.1'
    });
    if (auditLogs.length > 50) auditLogs.pop();

    const response = executeSearch({
      query: query || '',
      type,
      page: page || 1,
      limit: limit || 10,
      filters: filters || {},
      sortBy: sortBy || 'risk_desc'
    });

    res.json(response);
  } catch (err: any) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search processing error', message: err.message });
  }
});

// Query type detection endpoint
app.post('/api/detect-query-type', (req, res) => {
  const { query } = req.body;
  const detected = detectQueryType(query || '');
  res.json({ query, detectedType: detected });
});

// Single Asset intelligence
app.get('/api/assets/:id', (req, res) => {
  const assetId = req.params.id;
  let asset = ASSETS_DATABASE.find(a => a.id === assetId || a.ip === assetId || a.domain === assetId);

  if (!asset) {
    // Generate synthetic asset for requested entity
    asset = generateSyntheticAsset(assetId, detectQueryType(assetId));
  }

  res.json(asset);
});

// Domain intelligence endpoint
app.get('/api/domains/:domain', (req, res) => {
  const domain = req.params.domain.toLowerCase();
  let asset = ASSETS_DATABASE.find(a => a.domain && a.domain.toLowerCase() === domain);

  if (!asset) {
    asset = generateSyntheticAsset(domain, 'domain');
  }

  res.json(asset);
});

// Vulnerabilities catalogue & search
app.get('/api/vulnerabilities', (req, res) => {
  const { q, severity, inKev, hasExploit, limit, page } = req.query;
  let results = [...VULNERABILITY_DATABASE];

  if (q && typeof q === 'string') {
    const qLower = q.toLowerCase();
    results = results.filter(v => 
      v.cveId.toLowerCase().includes(qLower) ||
      v.title.toLowerCase().includes(qLower) ||
      v.description.toLowerCase().includes(qLower) ||
      v.affectedProduct.toLowerCase().includes(qLower)
    );
  }

  if (severity && typeof severity === 'string' && severity !== 'ALL') {
    results = results.filter(v => v.severity.toUpperCase() === severity.toUpperCase());
  }

  if (inKev === 'true') {
    results = results.filter(v => v.inCisaKev);
  }

  if (hasExploit === 'true') {
    results = results.filter(v => v.exploitAvailable);
  }

  const p = Number(page) || 1;
  const l = Number(limit) || 20;
  const paginated = results.slice((p - 1) * l, p * l);

  res.json({
    total: results.length,
    page: p,
    limit: l,
    vulnerabilities: paginated
  });
});

// Single Vulnerability Detail
app.get('/api/vulnerabilities/:cveId', (req, res) => {
  const cveId = req.params.cveId.toUpperCase();
  const cve = VULNERABILITY_DATABASE.find(v => v.cveId.toUpperCase() === cveId);

  if (!cve) {
    // Generate synthetic CVE info
    return res.json({
      cveId,
      title: `${cveId} - Security Advisory & Vulnerability Analysis`,
      description: `Security vulnerability tracked as ${cveId}. Public references and vendor advisories confirm impacted software components with potential privilege escalation or remote execution risk.`,
      cvss: 7.8,
      severity: 'HIGH',
      epssScore: 0.450,
      epssPercentile: 91.2,
      inCisaKev: false,
      exploitAvailable: true,
      exploitType: 'Public PoC',
      affectedProduct: 'Enterprise Software Component',
      affectedVersions: ['Versions < 4.2.0'],
      publishedDate: '2024-03-15',
      updatedDate: '2024-06-10',
      cwe: 'CWE-20: Improper Input Validation',
      references: [
        `https://nvd.nist.gov/vuln/detail/${cveId}`,
        `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveId}`
      ],
      remediation: {
        summary: 'Upgrade affected software to the vendor recommended secure release.',
        patchAvailable: true,
        recommendedVersion: 'Latest stable release',
        mitigationSteps: [
          'Filter untrusted ingress traffic at the network edge.',
          'Review application logging for anomalous command arguments.'
        ]
      }
    });
  }

  res.json(cve);
});

// Technology Explorer API
app.get('/api/technologies', (req, res) => {
  const q = req.query.q?.toString().toLowerCase();
  let techs = [
    { name: 'Nginx', category: 'Web Server', observedAssets: 142800900, topVersion: '1.24.0', riskScore: 24, cveCount: 14, icon: 'Server' },
    { name: 'Apache HTTP Server', category: 'Web Server', observedAssets: 98400200, topVersion: '2.4.58', riskScore: 48, cveCount: 42, icon: 'Server' },
    { name: 'OpenSSH', category: 'Security', observedAssets: 86200100, topVersion: '9.3p1', riskScore: 52, cveCount: 18, icon: 'Lock' },
    { name: 'Docker / Containerd', category: 'Container', observedAssets: 34200100, topVersion: '24.0.7', riskScore: 36, cveCount: 8, icon: 'Box' },
    { name: 'WordPress', category: 'CMS', observedAssets: 31900400, topVersion: '6.4.3', riskScore: 68, cveCount: 120, icon: 'Layout' },
    { name: 'MySQL / MariaDB', category: 'Database', observedAssets: 28400900, topVersion: '8.0.35', riskScore: 44, cveCount: 26, icon: 'Database' },
    { name: 'Redis', category: 'Database', observedAssets: 14200800, topVersion: '7.0.12', riskScore: 65, cveCount: 11, icon: 'Database' },
    { name: 'Kubernetes', category: 'Container', observedAssets: 9800400, topVersion: 'v1.28.4', riskScore: 38, cveCount: 15, icon: 'Layers' },
    { name: 'Elasticsearch', category: 'Database', observedAssets: 6200300, topVersion: '8.11.0', riskScore: 49, cveCount: 19, icon: 'Search' },
    { name: 'Cloudflare Edge', category: 'Cloud', observedAssets: 74500900, topVersion: 'Edge Quic', riskScore: 8, cveCount: 0, icon: 'Cloud' },
    { name: 'Spring Framework / Boot', category: 'Framework', observedAssets: 18900400, topVersion: '3.2.0', riskScore: 58, cveCount: 32, icon: 'Cpu' },
    { name: 'Microsoft IIS', category: 'Web Server', observedAssets: 42100800, topVersion: '10.0', riskScore: 41, cveCount: 22, icon: 'Globe' },
    { name: 'Jenkins', category: 'Framework', observedAssets: 3100200, topVersion: '2.440', riskScore: 72, cveCount: 45, icon: 'Play' },
    { name: 'Fortinet FortiOS', category: 'Security', observedAssets: 2400900, topVersion: '7.2.5', riskScore: 82, cveCount: 29, icon: 'Shield' }
  ];

  if (q) {
    techs = techs.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }

  res.json(techs);
});

// Single Technology details
app.get('/api/technologies/:name', (req, res) => {
  const techName = req.params.name;
  res.json({
    name: techName,
    category: 'Infrastructure & Software Stack',
    totalObserved: 45200100,
    topCountries: [
      { name: 'United States', count: 14200000, percentage: 31.4 },
      { name: 'Germany', count: 6800000, percentage: 15.0 },
      { name: 'China', count: 5400000, percentage: 11.9 },
      { name: 'United Kingdom', count: 3200000, percentage: 7.1 },
      { name: 'India', count: 2900000, percentage: 6.4 }
    ],
    topVersions: [
      { version: 'Latest Stable', percentage: 54.2 },
      { version: 'Legacy (Supported)', percentage: 32.1 },
      { version: 'End-of-Life / Vulnerable', percentage: 13.7 }
    ],
    commonPorts: [80, 443, 8080, 8443, 22],
    associatedCVEs: VULNERABILITY_DATABASE.slice(0, 3)
  });
});

// Port & Service Explorer API
app.get('/api/services', (req, res) => {
  const services = [
    { port: 443, protocol: 'tcp', service: 'HTTPS', assetCount: 298400900, riskLevel: 'LOW', description: 'Encrypted HTTP transport over TLS.' },
    { port: 80, protocol: 'tcp', service: 'HTTP', assetCount: 245100400, riskLevel: 'MEDIUM', description: 'Standard unencrypted web server port.' },
    { port: 22, protocol: 'tcp', service: 'SSH', assetCount: 98200100, riskLevel: 'HIGH', description: 'Secure Shell remote terminal access.' },
    { port: 53, protocol: 'udp/tcp', service: 'DNS', assetCount: 64100200, riskLevel: 'LOW', description: 'Domain Name System name resolution.' },
    { port: 8080, protocol: 'tcp', service: 'HTTP-Alt', assetCount: 48200900, riskLevel: 'MEDIUM', description: 'Alternative web proxies and dev servers.' },
    { port: 8443, protocol: 'tcp', service: 'HTTPS-Alt', assetCount: 32100800, riskLevel: 'LOW', description: 'Secondary secure web and admin portals.' },
    { port: 3306, protocol: 'tcp', service: 'MySQL', assetCount: 22900400, riskLevel: 'HIGH', description: 'Relational database management server.' },
    { port: 3389, protocol: 'tcp', service: 'RDP', assetCount: 18400200, riskLevel: 'HIGH', description: 'Microsoft Remote Desktop Protocol.' },
    { port: 5432, protocol: 'tcp', service: 'PostgreSQL', assetCount: 12100900, riskLevel: 'HIGH', description: 'PostgreSQL object-relational database.' },
    { port: 6379, protocol: 'tcp', service: 'Redis', assetCount: 9400200, riskLevel: 'CRITICAL', description: 'In-memory key-value database (often exposed without auth).' },
    { port: 9200, protocol: 'tcp', service: 'Elasticsearch', assetCount: 4800100, riskLevel: 'HIGH', description: 'RESTful search and analytics engine.' },
    { port: 10250, protocol: 'tcp', service: 'Kubelet', assetCount: 1200400, riskLevel: 'CRITICAL', description: 'Kubernetes node agent API.' },
    { port: 502, protocol: 'tcp', service: 'Modbus', assetCount: 380200, riskLevel: 'CRITICAL', description: 'Industrial SCADA/ICS control protocol.' }
  ];
  res.json(services);
});

// Analytics Dashboard telemetry
app.get('/api/analytics', (req, res) => {
  res.json(GLOBAL_TELEMETRY);
});

// Global Map Geo-Intelligence Data
app.get('/api/map-data', (req, res) => {
  const mapNodes = ASSETS_DATABASE.map(asset => ({
    id: asset.id,
    ip: asset.ip,
    hostname: asset.hostname,
    country: asset.country,
    countryCode: asset.countryCode,
    city: asset.city,
    lat: asset.latitude,
    lng: asset.longitude,
    riskScore: asset.riskScore,
    severity: asset.severity,
    org: asset.org,
    ports: asset.openPorts.map(p => p.port),
    vulnerabilitiesCount: asset.vulnerabilities.length
  }));

  // Add global hotspot clusters
  const clusters = [
    { country: 'United States', code: 'US', lat: 38.0, lng: -97.0, assetCount: 142800900, threatIndex: 68, topAsn: 'AS15169 Google' },
    { country: 'Germany', code: 'DE', lat: 51.1657, lng: 10.4515, assetCount: 38200400, threatIndex: 74, topAsn: 'AS24940 Hetzner' },
    { country: 'China', code: 'CN', lat: 35.8617, lng: 104.1954, assetCount: 68400100, threatIndex: 82, topAsn: 'AS4134 Chinanet' },
    { country: 'Japan', code: 'JP', lat: 36.2048, lng: 138.2529, assetCount: 22100400, threatIndex: 54, topAsn: 'AS2516 KDDI' },
    { country: 'India', code: 'IN', lat: 20.5937, lng: 78.9629, assetCount: 29400100, threatIndex: 78, topAsn: 'AS55836 Reliance Jio' },
    { country: 'United Kingdom', code: 'GB', lat: 55.3781, lng: -3.4360, assetCount: 24800900, threatIndex: 60, topAsn: 'AS13335 Cloudflare' },
    { country: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198, assetCount: 11900400, threatIndex: 48, topAsn: 'AS16509 Amazon' },
    { country: 'Brazil', code: 'BR', lat: -14.2350, lng: -51.9253, assetCount: 14200800, threatIndex: 72, topAsn: 'AS28573 Claro' },
    { country: 'Australia', code: 'AU', lat: -25.2744, lng: 133.7751, assetCount: 9800200, threatIndex: 42, topAsn: 'AS13335 Cloudflare' }
  ];

  res.json({
    assets: mapNodes,
    clusters,
    telemetry: {
      activeScanningNodes: 124,
      lastGlobalSweep: '3 mins ago',
      nodesOnline: '99.98%'
    }
  });
});

// AI Security Assistant Endpoint (Powered by Gemini)
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { question, assetData, contextType, itemExplanationRequest } = req.body;
    const analysis = await analyzeWithGemini({
      question: question || 'Analyze the threat posture of this asset.',
      assetData,
      contextType: contextType || 'general',
      itemExplanationRequest
    });
    res.json(analysis);
  } catch (err: any) {
    console.error('AI Analysis failed:', err);
    res.status(500).json({ error: 'AI Analysis Error', message: err.message });
  }
});

// Dedicated Item Explanation Endpoint
app.post('/api/ai/explain-item', async (req, res) => {
  try {
    const { category, identifier, itemData, assetContext } = req.body;
    const analysis = await analyzeWithGemini({
      question: `Explain this ${category}: ${identifier}`,
      assetData: assetContext,
      contextType: 'item_explanation',
      itemExplanationRequest: {
        category,
        identifier,
        itemData,
        assetContext
      }
    });
    res.json(analysis);
  } catch (err: any) {
    console.error('Item explanation failed:', err);
    res.status(500).json({ error: 'Explanation Error', message: err.message });
  }
});

// User Saved Items
app.get('/api/user/saved', (req, res) => {
  res.json(savedItems);
});

app.post('/api/user/saved', (req, res) => {
  const { type, queryOrId, title, tags, notes } = req.body;
  const newItem: UserSavedItem = {
    id: `save-${Date.now()}`,
    type: type || 'search',
    queryOrId,
    title: title || queryOrId,
    createdAt: new Date().toISOString(),
    tags: tags || [],
    notes: notes || ''
  };
  savedItems.unshift(newItem);
  res.json(newItem);
});

app.delete('/api/user/saved/:id', (req, res) => {
  savedItems = savedItems.filter(i => i.id !== req.params.id);
  res.json({ success: true });
});

// API Keys Management
app.get('/api/user/keys', (req, res) => {
  res.json(apiKeys);
});

app.post('/api/user/keys', (req, res) => {
  const { name } = req.body;
  const newKey: ApiKeyRecord = {
    id: `key-${Date.now()}`,
    name: name || 'API Client Key',
    keyPrefix: `bt_live_${Math.random().toString(36).substring(2, 10)}...`,
    createdAt: new Date().toISOString(),
    rateLimitPerMin: 60,
    usageToday: 0
  };
  apiKeys.unshift(newKey);
  res.json(newKey);
});

// Public v1 API Endpoints (For Researchers & API Playground)
app.get('/api/v1/ip/:ip', (req, res) => {
  const ip = req.params.ip;
  const asset = ASSETS_DATABASE.find(a => a.ip === ip) || generateSyntheticAsset(ip, 'ip');
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: asset
  });
});

app.get('/api/v1/domain/:domain', (req, res) => {
  const domain = req.params.domain;
  const asset = ASSETS_DATABASE.find(a => a.domain === domain) || generateSyntheticAsset(domain, 'domain');
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: asset
  });
});

app.get('/api/v1/cve/:cve', (req, res) => {
  const cveId = req.params.cve.toUpperCase();
  const cve = VULNERABILITY_DATABASE.find(v => v.cveId.toUpperCase() === cveId);
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: cve || { cveId, title: 'Advisory', cvss: 7.5, severity: 'HIGH' }
  });
});

app.get('/api/v1/search', (req, res) => {
  const q = req.query.q?.toString() || '';
  const results = executeSearch({ query: q, limit: 10 });
  res.json({
    status: 'success',
    query: q,
    results: results.results,
    total: results.total
  });
});

// ==================== VITE & PRODUCTION SETUP ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BLACKTRACE Server] Online and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
