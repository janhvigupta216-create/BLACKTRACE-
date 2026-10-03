export type QueryType = 
  | 'ip' 
  | 'domain' 
  | 'url' 
  | 'cve' 
  | 'asn' 
  | 'port' 
  | 'technology' 
  | 'keyword'
  | 'advanced';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export interface OpenPort {
  port: number;
  protocol: 'tcp' | 'udp';
  service: string;
  state: 'open' | 'filtered' | 'closed';
  product?: string;
  version?: string;
  banner?: string;
  cves?: string[];
  ssl?: {
    enabled: boolean;
    subject?: string;
    issuer?: string;
    validTo?: string;
    tlsVersion?: string;
    cipher?: string;
  };
}

export interface TechnologyItem {
  name: string;
  category: 'Web Server' | 'Framework' | 'Operating System' | 'Database' | 'Cloud' | 'Security' | 'Analytics' | 'CMS' | 'Container';
  version?: string;
  confidence: number;
  cveCount?: number;
  icon?: string;
}

export interface VulnerabilityRecord {
  cveId: string;
  title: string;
  description: string;
  cvss: number;
  severity: SeverityLevel;
  epssScore: number;
  epssPercentile: number;
  inCisaKev: boolean;
  exploitAvailable: boolean;
  exploitType?: 'Public PoC' | 'Metasploit' | 'Weaponized' | 'None';
  affectedProduct: string;
  affectedVersions: string[];
  publishedDate: string;
  updatedDate: string;
  cwe: string;
  references: string[];
  remediation: {
    summary: string;
    patchAvailable: boolean;
    mitigationSteps: string[];
    recommendedVersion?: string;
  };
}

export interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA' | 'PTR';
  name: string;
  value: string;
  ttl: number;
}

export interface SecurityHeader {
  name: string;
  value?: string;
  status: 'present' | 'missing' | 'misconfigured';
  score: 'good' | 'warning' | 'critical';
  recommendation?: string;
}

export interface HistoricalSnapshot {
  timestamp: string;
  date: string;
  event: string;
  type: 'port_change' | 'cert_renewal' | 'dns_update' | 'risk_change' | 'cve_detected';
  detail: string;
  previousValue?: string;
  newValue?: string;
}

export interface AssetIntelligence {
  id: string;
  ip: string;
  domain?: string;
  hostname: string;
  queryType: QueryType;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  asn: string;
  asnName: string;
  org: string;
  isp: string;
  riskScore: number; // 0 - 100
  severity: SeverityLevel;
  lastObserved: string;
  firstSeen: string;
  tags: string[];
  cloudProvider?: string;
  operatingSystem?: string;
  openPorts: OpenPort[];
  technologies: TechnologyItem[];
  vulnerabilities: VulnerabilityRecord[];
  dnsRecords?: DnsRecord[];
  subdomains?: string[];
  securityHeaders?: SecurityHeader[];
  httpInfo?: {
    statusCode: number;
    title?: string;
    server?: string;
    contentType?: string;
    responseLength?: number;
    redirectUrl?: string;
    faviconHash?: string;
  };
  sslInfo?: {
    subject: string;
    issuer: string;
    validFrom: string;
    validTo: string;
    daysRemaining: number;
    fingerprintSha256: string;
    sanList: string[];
    tlsVersion: string;
    cipherSuite: string;
    isExpired: boolean;
    grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  };
  threatIndicators: {
    isTorExitNode: boolean;
    isVpn: boolean;
    isProxy: boolean;
    isKnownHoneypot: boolean;
    isBotnetC2: boolean;
    isSpamSource: boolean;
    reputationScore: number; // 0-100 (100 = trusted, 0 = malicious)
  };
  historicalTimeline: HistoricalSnapshot[];
}

export interface SearchQueryRequest {
  query: string;
  type?: QueryType;
  page?: number;
  limit?: number;
  filters?: {
    country?: string;
    asn?: string;
    port?: number;
    service?: string;
    technology?: string;
    severity?: SeverityLevel;
    cloudProvider?: string;
    minRiskScore?: number;
    hasExploit?: boolean;
  };
  sortBy?: 'risk_desc' | 'risk_asc' | 'date_desc' | 'ip_asc';
}

export interface SearchQueryResponse {
  query: string;
  type: QueryType;
  total: number;
  page: number;
  limit: number;
  executionTimeMs: number;
  results: AssetIntelligence[];
  aggregations: {
    countries: { code: string; name: string; count: number }[];
    ports: { port: number; count: number }[];
    services: { service: string; count: number }[];
    technologies: { name: string; count: number }[];
    severities: { severity: SeverityLevel; count: number }[];
  };
}

export type ConfidenceLevel = 'Observed' | 'Inferred' | 'Potential' | 'Confirmed';

export type AIExplanationCategory = 
  | 'ip' 
  | 'port' 
  | 'service' 
  | 'technology' 
  | 'vulnerability' 
  | 'dns' 
  | 'ssl' 
  | 'header' 
  | 'risk_score' 
  | 'asset' 
  | 'search'
  | 'general';

export interface AIExplanationItem {
  id?: string;
  title: string;
  category: AIExplanationCategory;
  whatIsIt: string;
  whatItMeans: string;
  whyItMatters: string;
  howUseful: string;
  securityRisk: string;
  recommendedAction: string;
  confidence: ConfidenceLevel;
  evidence: string;
  priority?: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  priorityReasoning?: string;
  nextSteps?: {
    priority: 'High' | 'Medium' | 'Low';
    action: string;
    why?: string;
  }[];
  suggestedQuestions?: string[];
}

export interface AIAssetSummaryExplanation {
  whatIsThis: string;
  whatDoesItMean: string;
  whyDoesItMatter: string;
  howSecurityTeamsUseThis: string[];
  riskScoreExplanation: {
    score: number;
    severity: SeverityLevel;
    whyThisScore: string;
    contributingFactors: {
      factor: string;
      impact: 'high' | 'medium' | 'low';
      description: string;
    }[];
    disclaimer: string;
  };
  recommendedNextSteps: {
    priority: 1 | 2 | 3 | 4;
    level: 'Critical' | 'High' | 'Medium' | 'Low';
    title: string;
    action: string;
    targetComponent?: string;
  }[];
  confidenceFindings: {
    level: ConfidenceLevel;
    text: string;
    evidence: string;
  }[];
}

export interface AIExplainItemRequest {
  category: AIExplanationCategory;
  identifier: string;
  itemData: any;
  assetContext?: Partial<AssetIntelligence>;
}

export interface AIAnalysisRequest {
  assetId?: string;
  assetData?: Partial<AssetIntelligence>;
  question: string;
  contextType: 'asset_summary' | 'vulnerability_triage' | 'remediation_plan' | 'domain_safety' | 'general' | 'item_explanation';
  itemExplanationRequest?: AIExplainItemRequest;
}

export interface AIAnalysisResponse {
  answer: string;
  contextType: string;
  timestamp: string;
  structuredExplanation?: AIExplanationItem;
  assetSummary?: AIAssetSummaryExplanation;
  findings: {
    type: 'Observed Data' | 'AI Inference' | 'Confirmed Vulnerability' | 'Potential Risk';
    text: string;
  }[];
  recommendedActions: string[];
}

export interface GlobalTelemetryStats {
  totalAssets: number;
  activeHosts: number;
  openServices: number;
  knownVulnerabilities: number;
  highRiskAssets: number;
  trackedTechnologies: number;
  countriesMonitored: number;
  asnsMonitored: number;
  riskDistribution: { level: SeverityLevel; count: number; percentage: number }[];
  topTechnologies: { name: string; category: string; count: number }[];
  topPorts: { port: number; service: string; count: number }[];
  topCountries: { code: string; name: string; count: number }[];
  recentIncidents: { id: string; title: string; severity: SeverityLevel; timeAgo: string }[];
}

export interface UserSavedItem {
  id: string;
  type: 'search' | 'asset' | 'cve';
  queryOrId: string;
  title: string;
  createdAt: string;
  tags: string[];
  notes?: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
  rateLimitPerMin: number;
  usageToday: number;
}
