import { AssetIntelligence, QueryType, SearchQueryRequest, SearchQueryResponse, SeverityLevel, VulnerabilityRecord } from '../src/types';
import { ASSETS_DATABASE, VULNERABILITY_DATABASE } from './threatData';

export function detectQueryType(query: string): QueryType {
  const q = query.trim().toLowerCase();

  if (q.startsWith('cve-') || /^cve-\d{4}-\d{4,8}$/i.test(q)) {
    return 'cve';
  }
  if (q.startsWith('as') && /^as\d+$/i.test(q)) {
    return 'asn';
  }
  if (q.startsWith('port:') || /^\d{1,5}$/.test(q)) {
    return 'port';
  }
  if (q.startsWith('http://') || q.startsWith('https://')) {
    return 'url';
  }
  // IPv4 regex
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(q)) {
    return 'ip';
  }
  // IPv6 regex
  if (/^([0-9a-f]{1,4}:){1,7}[0-9a-f]{1,4}$/i.test(q)) {
    return 'ip';
  }
  // Domain regex
  if (/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(q)) {
    return 'domain';
  }
  if (['apache', 'nginx', 'openssh', 'docker', 'kubernetes', 'wordpress', 'mysql', 'redis', 'elasticsearch', 'iis', 'tomcat', 'spring', 'jenkins', 'modbus', 'siemens', 'tor', 'cloudflare'].includes(q)) {
    return 'technology';
  }
  if (q.includes(':') || q.includes(' and ') || q.includes(' or ')) {
    return 'advanced';
  }
  return 'keyword';
}

function computeSeverity(riskScore: number): SeverityLevel {
  if (riskScore >= 85) return 'CRITICAL';
  if (riskScore >= 70) return 'HIGH';
  if (riskScore >= 40) return 'MEDIUM';
  if (riskScore >= 15) return 'LOW';
  return 'INFORMATIONAL';
}

export function generateSyntheticAsset(query: string, detectedType: QueryType): AssetIntelligence {
  const cleanQ = query.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const hash = Math.abs(cleanQ.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0));
  
  const isIp = detectedType === 'ip' || /^(\d{1,3}\.){3}\d{1,3}$/.test(cleanQ);
  const ip = isIp ? cleanQ : `198.51.${(hash % 200) + 10}.${(hash % 250) + 1}`;
  const domain = isIp ? (cleanQ === '8.8.8.8' ? 'dns.google' : `host-${ip.replace(/\./g, '-')}.net`) : cleanQ;
  
  const countries = [
    { name: 'United States', code: 'US', city: 'San Jose', lat: 37.3382, lng: -121.8863, asn: 'AS15169', asnName: 'GOOGLE, US', org: 'Google Cloud Platform', isp: 'Google LLC' },
    { name: 'Germany', code: 'DE', city: 'Frankfurt', lat: 50.1109, lng: 8.6821, asn: 'AS24940', asnName: 'HETZNER-AS, DE', org: 'Hetzner Online GmbH', isp: 'Hetzner Online GmbH' },
    { name: 'Singapore', code: 'SG', city: 'Singapore', lat: 1.3521, lng: 103.8198, asn: 'AS16509', asnName: 'AMAZON-02, US', org: 'Amazon Data Services', isp: 'Amazon.com' },
    { name: 'United Kingdom', code: 'GB', city: 'London', lat: 51.5074, lng: -0.1278, asn: 'AS13335', asnName: 'CLOUDFLARENET, US', org: 'Cloudflare, Inc.', isp: 'Cloudflare, Inc.' },
    { name: 'Japan', code: 'JP', city: 'Tokyo', lat: 35.6762, lng: 139.6503, asn: 'AS2516', asnName: 'KDDI Corporation', org: 'KDDI Cloud Enterprise', isp: 'KDDI' },
    { name: 'India', code: 'IN', city: 'Bengaluru', lat: 12.9716, lng: 77.5946, asn: 'AS55836', asnName: 'RELIANCE-JIO-INFOCOMM, IN', org: 'Reliance Jio Infocomm', isp: 'Reliance Jio' }
  ];
  
  const geo = countries[hash % countries.length];
  const riskScore = (hash % 85) + 10;
  const severity = computeSeverity(riskScore);

  const matchedCves: VulnerabilityRecord[] = riskScore > 65 ? [
    VULNERABILITY_DATABASE[hash % VULNERABILITY_DATABASE.length]
  ] : [];

  return {
    id: `asset-${cleanQ.replace(/[^a-z0-9]/gi, '-')}`,
    ip,
    domain,
    hostname: `node-${(hash % 900) + 100}.${domain}`,
    queryType: detectedType,
    country: geo.name,
    countryCode: geo.code,
    city: geo.city,
    region: geo.city,
    latitude: geo.lat,
    longitude: geo.lng,
    asn: geo.asn,
    asnName: geo.asnName,
    org: geo.org,
    isp: geo.isp,
    riskScore,
    severity,
    lastObserved: new Date().toISOString(),
    firstSeen: '2023-01-10T00:00:00Z',
    tags: [
      geo.org.includes('Cloud') ? 'Cloud Hosted' : 'Enterprise Perimeter',
      riskScore > 75 ? 'Exposed Attack Surface' : 'Standard Web Gateway',
      'Telemetry Verified'
    ],
    cloudProvider: geo.org.includes('Amazon') ? 'AWS' : geo.org.includes('Google') ? 'GCP' : geo.org.includes('Cloudflare') ? 'Cloudflare Edge' : 'Hetzner Cloud',
    operatingSystem: 'Ubuntu Linux 22.04 LTS (Kernel 5.15.0)',
    openPorts: [
      {
        port: 80,
        protocol: 'tcp',
        service: 'http',
        state: 'open',
        product: 'nginx',
        version: '1.24.0',
        banner: 'Server: nginx/1.24.0'
      },
      {
        port: 443,
        protocol: 'tcp',
        service: 'https',
        state: 'open',
        product: 'nginx',
        version: '1.24.0',
        ssl: {
          enabled: true,
          subject: `CN=${domain}`,
          issuer: "Let's Encrypt Authority E6",
          validTo: '2026-11-20',
          tlsVersion: 'TLSv1.3',
          cipher: 'TLS_AES_256_GCM_SHA384'
        }
      },
      ...(riskScore > 60 ? [{
        port: 22,
        protocol: 'tcp' as const,
        service: 'ssh',
        state: 'open' as const,
        product: 'OpenSSH',
        version: '8.9p1',
        banner: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6',
        cves: matchedCves.map(c => c.cveId)
      }] : [])
    ],
    technologies: [
      { name: 'Nginx', category: 'Web Server', version: '1.24.0', confidence: 99, cveCount: 0 },
      { name: 'OpenSSL', category: 'Security', version: '3.0.2', confidence: 95, cveCount: 0 },
      { name: 'Ubuntu Linux', category: 'Operating System', version: '22.04 LTS', confidence: 90, cveCount: 0 }
    ],
    vulnerabilities: matchedCves,
    dnsRecords: [
      { type: 'A', name: domain, value: ip, ttl: 300 },
      { type: 'NS', name: domain, value: `ns1.${domain}`, ttl: 86400 },
      { type: 'TXT', name: domain, value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 }
    ],
    subdomains: [`www.${domain}`, `api.${domain}`, `mail.${domain}`, `status.${domain}`],
    securityHeaders: [
      { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains', status: 'present', score: 'good' },
      { name: 'Content-Security-Policy', status: riskScore > 50 ? 'missing' : 'present', score: riskScore > 50 ? 'warning' : 'good' },
      { name: 'X-Frame-Options', value: 'SAMEORIGIN', status: 'present', score: 'good' },
      { name: 'X-Content-Type-Options', value: 'nosniff', status: 'present', score: 'good' }
    ],
    httpInfo: {
      statusCode: 200,
      title: `${domain} - Edge Service Endpoint`,
      server: 'nginx/1.24.0',
      contentType: 'text/html; charset=utf-8',
      responseLength: 3820
    },
    sslInfo: {
      subject: `CN=${domain}`,
      issuer: "Let's Encrypt Authority E6",
      validFrom: '2026-01-01',
      validTo: '2026-11-20',
      daysRemaining: 90,
      fingerprintSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90',
      sanList: [domain, `*.${domain}`],
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      isExpired: false,
      grade: riskScore > 70 ? 'B' : 'A+'
    },
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: false,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: false,
      reputationScore: 100 - Math.floor(riskScore * 0.8)
    },
    historicalTimeline: [
      { timestamp: '2026-06-01T10:00:00Z', date: '2026-06-01', event: 'Asset First Indexed', type: 'port_change', detail: 'Open ports 80, 443 discovered' }
    ]
  };
}

export function executeSearch(params: SearchQueryRequest): SearchQueryResponse {
  const startTime = Date.now();
  const query = (params.query || '').trim();
  const detectedType = params.type || detectQueryType(query);
  const qLower = query.toLowerCase();

  let filtered = [...ASSETS_DATABASE];

  // Parse advanced Boolean or key:value syntax
  // Examples: "product:nginx AND port:443", "country:IN", "port:22", "severity:high"
  let parsedFilters = { ...params.filters };

  if (query.includes(':')) {
    const parts = query.split(/\s+(?:AND|and)\s+|\s+/);
    for (const part of parts) {
      const [key, val] = part.split(':');
      if (key && val) {
        const k = key.toLowerCase().trim();
        const v = val.toLowerCase().trim();
        if (k === 'port') parsedFilters.port = parseInt(v, 10);
        if (k === 'service') parsedFilters.service = v;
        if (k === 'country') parsedFilters.country = v;
        if (k === 'product' || k === 'tech' || k === 'technology') parsedFilters.technology = v;
        if (k === 'severity') parsedFilters.severity = v.toUpperCase() as SeverityLevel;
        if (k === 'asn') parsedFilters.asn = v;
      }
    }
  }

  // Filter matching
  if (query && !query.includes(':')) {
    filtered = filtered.filter(asset => {
      if (detectedType === 'ip') {
        return asset.ip.toLowerCase().includes(qLower) || asset.hostname.toLowerCase().includes(qLower);
      }
      if (detectedType === 'domain') {
        return (asset.domain && asset.domain.toLowerCase().includes(qLower)) || asset.hostname.toLowerCase().includes(qLower);
      }
      if (detectedType === 'cve') {
        return asset.vulnerabilities.some(v => v.cveId.toLowerCase().includes(qLower)) ||
               asset.openPorts.some(p => p.cves && p.cves.some(c => c.toLowerCase().includes(qLower)));
      }
      if (detectedType === 'asn') {
        return asset.asn.toLowerCase().includes(qLower) || asset.asnName.toLowerCase().includes(qLower);
      }
      if (detectedType === 'port') {
        const portNum = parseInt(query.replace('port:', ''), 10);
        return asset.openPorts.some(p => p.port === portNum);
      }
      if (detectedType === 'technology') {
        return asset.technologies.some(t => t.name.toLowerCase().includes(qLower)) ||
               asset.openPorts.some(p => p.product && p.product.toLowerCase().includes(qLower));
      }
      // General keyword search
      return asset.ip.includes(qLower) ||
             (asset.domain && asset.domain.toLowerCase().includes(qLower)) ||
             asset.hostname.toLowerCase().includes(qLower) ||
             asset.org.toLowerCase().includes(qLower) ||
             asset.isp.toLowerCase().includes(qLower) ||
             asset.country.toLowerCase().includes(qLower) ||
             asset.technologies.some(t => t.name.toLowerCase().includes(qLower)) ||
             asset.openPorts.some(p => p.service.toLowerCase().includes(qLower) || (p.product && p.product.toLowerCase().includes(qLower)));
    });
  }

  // Apply structured filters
  if (parsedFilters.country) {
    const c = parsedFilters.country.toLowerCase();
    filtered = filtered.filter(a => a.country.toLowerCase().includes(c) || a.countryCode.toLowerCase() === c);
  }
  if (parsedFilters.asn) {
    const a = parsedFilters.asn.toLowerCase();
    filtered = filtered.filter(item => item.asn.toLowerCase().includes(a) || item.asnName.toLowerCase().includes(a));
  }
  if (parsedFilters.port) {
    filtered = filtered.filter(a => a.openPorts.some(p => p.port === parsedFilters.port));
  }
  if (parsedFilters.service) {
    const s = parsedFilters.service.toLowerCase();
    filtered = filtered.filter(a => a.openPorts.some(p => p.service.toLowerCase().includes(s)));
  }
  if (parsedFilters.technology) {
    const t = parsedFilters.technology.toLowerCase();
    filtered = filtered.filter(a => a.technologies.some(tech => tech.name.toLowerCase().includes(t)) || a.openPorts.some(p => p.product && p.product.toLowerCase().includes(t)));
  }
  if (parsedFilters.severity) {
    filtered = filtered.filter(a => a.severity === parsedFilters.severity);
  }
  if (parsedFilters.minRiskScore !== undefined) {
    filtered = filtered.filter(a => a.riskScore >= (parsedFilters.minRiskScore || 0));
  }

  // If no match found and user searched a specific domain/IP/CVE/Technology, generate a rich synthetic asset
  if (filtered.length === 0 && query && !query.includes(':')) {
    const synthetic = generateSyntheticAsset(query, detectedType);
    filtered.push(synthetic);
  }

  // Sorting
  const sortBy = params.sortBy || 'risk_desc';
  if (sortBy === 'risk_desc') {
    filtered.sort((a, b) => b.riskScore - a.riskScore);
  } else if (sortBy === 'risk_asc') {
    filtered.sort((a, b) => a.riskScore - b.riskScore);
  } else if (sortBy === 'date_desc') {
    filtered.sort((a, b) => new Date(b.lastObserved).getTime() - new Date(a.lastObserved).getTime());
  } else if (sortBy === 'ip_asc') {
    filtered.sort((a, b) => a.ip.localeCompare(b.ip));
  }

  // Aggregations
  const countryCounts: Record<string, { code: string; name: string; count: number }> = {};
  const portCounts: Record<number, number> = {};
  const serviceCounts: Record<string, number> = {};
  const techCounts: Record<string, number> = {};
  const severityCounts: Record<SeverityLevel, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    INFORMATIONAL: 0
  };

  filtered.forEach(asset => {
    countryCounts[asset.countryCode] = countryCounts[asset.countryCode] || { code: asset.countryCode, name: asset.country, count: 0 };
    countryCounts[asset.countryCode].count += 1;

    severityCounts[asset.severity] = (severityCounts[asset.severity] || 0) + 1;

    asset.openPorts.forEach(p => {
      portCounts[p.port] = (portCounts[p.port] || 0) + 1;
      serviceCounts[p.service] = (serviceCounts[p.service] || 0) + 1;
    });

    asset.technologies.forEach(t => {
      techCounts[t.name] = (techCounts[t.name] || 0) + 1;
    });
  });

  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    query,
    type: detectedType,
    total: filtered.length,
    page,
    limit,
    executionTimeMs: Date.now() - startTime,
    results: paginated,
    aggregations: {
      countries: Object.values(countryCounts).sort((a, b) => b.count - a.count),
      ports: Object.entries(portCounts).map(([port, count]) => ({ port: Number(port), count })).sort((a, b) => b.count - a.count),
      services: Object.entries(serviceCounts).map(([service, count]) => ({ service, count })).sort((a, b) => b.count - a.count),
      technologies: Object.entries(techCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      severities: Object.entries(severityCounts).map(([severity, count]) => ({ severity: severity as SeverityLevel, count }))
    }
  };
}
