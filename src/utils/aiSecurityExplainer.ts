import { 
  AIExplanationItem, 
  AIExplanationCategory, 
  ConfidenceLevel, 
  AssetIntelligence, 
  AIAssetSummaryExplanation,
  OpenPort,
  TechnologyItem,
  VulnerabilityRecord,
  DnsRecord,
  SecurityHeader
} from '../types';

/**
 * Generates an instant, comprehensive AI Explanation for any specific technical output in BLACKTRACE.
 * Adheres strictly to defensive cybersecurity analysis standards and confidence labeling.
 */
export function generateLocalAIExplanation(
  category: AIExplanationCategory,
  identifier: string,
  data: any,
  assetContext?: Partial<AssetIntelligence>
): AIExplanationItem {
  switch (category) {
    case 'port':
      return explainPort(Number(identifier) || data?.port || 0, data, assetContext);
    case 'service':
      return explainService(identifier || data?.service || 'Service', data, assetContext);
    case 'technology':
      return explainTechnology(identifier || data?.name || 'Technology', data, assetContext);
    case 'vulnerability':
      return explainVulnerability(identifier || data?.cveId || 'CVE', data, assetContext);
    case 'dns':
      return explainDns(identifier || data?.type || 'DNS', data, assetContext);
    case 'ssl':
      return explainSsl(data, assetContext);
    case 'header':
      return explainHeader(identifier || data?.name || 'Security Header', data, assetContext);
    case 'ip':
    case 'asset':
      return explainIpAndNetwork(identifier || data?.ip || 'IP Address', data, assetContext);
    case 'risk_score':
      return explainRiskScore(Number(identifier) || data?.riskScore || 0, data, assetContext);
    default:
      return {
        title: `Security Analysis: ${identifier}`,
        category: 'general',
        whatIsIt: `This is a detected security telemetry artifact (${identifier}) associated with the target perimeter.`,
        whatItMeans: `The scanner gathered technical indicators corresponding to this parameter during active network indexing.`,
        whyItMatters: `Every discovered asset attribute helps establish a more accurate map of external exposure.`,
        howUseful: `Defensive analysts can correlate this indicator with threat intelligence and internal asset inventories.`,
        securityRisk: `Isolated technical markers should be evaluated in context of exposed network access controls.`,
        recommendedAction: `Review whether this asset attribute matches documented architecture and change records.`,
        confidence: 'Observed',
        evidence: `Directly detected in target scan response.`,
        priority: 'Low',
        priorityReasoning: `Informational telemetry item without immediate standalone vulnerability indicators.`,
        nextSteps: [
          { priority: 'Low', action: 'Verify alignment with organizational inventory baseline.', why: 'Ensures asset tracking accuracy.' }
        ],
        suggestedQuestions: [
          `Explain this in simple terms`,
          `What does this result mean for my organization?`,
          `What defensive steps should we prioritize?`
        ]
      };
  }
}

function explainPort(port: number, portData: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const p = portData || {};
  const service = p.service || getCommonPortService(port);
  const protocol = p.protocol || 'tcp';
  const cves = p.cves || [];
  const banner = p.banner || p.product || '';

  const portDescriptions: Record<number, { what: string; why: string; risk: string; action: string }> = {
    443: {
      what: 'Port 443 is the standard Internet port allocated for encrypted HTTPS web traffic.',
      why: 'It indicates that a TLS-encrypted web service or API endpoint is publicly accessible on the host.',
      risk: 'Port 443 is expected for web services. Risk depends on the underlying web application software, TLS certificate validity, and cipher suites.',
      action: 'Verify TLS configuration, renew certificates before expiration, and ensure web server software is up to date.'
    },
    80: {
      what: 'Port 80 is the standard port for unencrypted HTTP web communications.',
      why: 'It reveals that an unencrypted web server or HTTP redirection daemon is listening for public connections.',
      risk: 'Unencrypted HTTP transmits credentials and payload data in plaintext, exposing users to interception or man-in-the-middle attacks if not redirecting to HTTPS.',
      action: 'Enforce automatic 301 redirection from HTTP (port 80) to HTTPS (port 443) and enable HSTS.'
    },
    22: {
      what: 'Port 22 is the default port for Secure Shell (SSH) remote administrative console access.',
      why: 'It provides encrypted terminal sessions for systems administrators to manage the host operating system.',
      risk: 'Exposing SSH directly to the public Internet invites automated brute-force authentication attacks, credential stuffing, and scanner probing.',
      action: 'Restrict SSH access to trusted IP address ranges or VPN gateways, disable password authentication in favor of SSH keys, and enforce multi-factor authentication.'
    },
    53: {
      what: 'Port 53 is used by Domain Name System (DNS) servers over UDP and TCP transport.',
      why: 'It handles domain name translation, authoritative zone hosting, or recursive DNS queries.',
      risk: 'Open recursive resolvers can be abused in DNS amplification DDoS attacks or exploited via DNS cache poisoning if misconfigured.',
      action: 'Disable open recursive resolution for external queries if this is an authoritative-only server, and enable DNSSEC.'
    },
    3389: {
      what: 'Port 3389 is the Microsoft Remote Desktop Protocol (RDP) listening service.',
      why: 'It enables remote graphical desktop management on Windows servers and workstations.',
      risk: 'Publicly exposed RDP is one of the most frequent vectors for ransomware deployment and brute-force compromise.',
      action: 'Immediately remove port 3389 from the public perimeter. Place RDP behind a Remote Desktop Gateway, VPN, or zero-trust network access (ZTNA) with MFA.'
    },
    3306: {
      what: 'Port 3306 is the default communication port for MySQL and MariaDB relational databases.',
      why: 'It allows database clients and backend applications to execute SQL queries.',
      risk: 'Databases should almost never be exposed to the public Internet. Public exposure risks unauthorized access, SQL injection, and data exfiltration.',
      action: 'Bind the database service to localhost (127.0.0.1) or a private VPC subnet. Restrict ingress via strict firewall access control lists (ACLs).'
    },
    5432: {
      what: 'Port 5432 is the standard listening port for PostgreSQL relational database instances.',
      why: 'It enables PostgreSQL client connections and application database transactions.',
      risk: 'Internet exposure allows threat actors to attempt credential brute-forcing or exploit unpatched database vulnerabilities.',
      action: 'Isolate PostgreSQL within private network segments. Require SSL/TLS client certificates if external access is strictly required.'
    },
    6379: {
      what: 'Port 6379 is the default port for the Redis in-memory data store and caching engine.',
      why: 'It provides ultra-low latency key-value caching and message brokering for applications.',
      risk: 'Redis was designed for trusted internal networks. Exposed instances without authentication can allow attackers to write arbitrary SSH keys or achieve Remote Code Execution (RCE).',
      action: 'Immediately firewall port 6379 from the public Internet, enable strong password authentication (requirepass), and run in protected-mode.'
    },
    8080: {
      what: 'Port 8080 is a commonly used secondary HTTP port for web applications, dev proxies, and admin consoles.',
      why: 'Developers frequently deploy staging environments, Tomcat servers, Spring Boot apps, or proxy endpoints on port 8080.',
      risk: 'Secondary ports often host pre-production software or unhardened administration portals that bypass main security policies.',
      action: 'Audit what application is running on port 8080, verify authentication requirements, and apply HTTPS encryption.'
    },
    8443: {
      what: 'Port 8443 is an alternate secure HTTPS port commonly used for administration panels and microservices.',
      why: 'It provides an alternative TLS-encrypted channel for appliance dashboards, VPN web consoles, or APIs.',
      risk: 'May expose administrative interfaces to untrusted external networks.',
      action: 'Enforce strict role-based access control, MFA on login pages, and verify TLS certificate validation.'
    },
    9200: {
      what: 'Port 9200 is the REST API port for Elasticsearch clusters and OpenSearch engines.',
      why: 'It processes search queries, log indexing, and data analytics requests.',
      risk: 'Unauthenticated Elasticsearch exposure has historically led to massive automated data breaches and data extortion wipes.',
      action: 'Enable Elasticsearch security features (Elastic Stack Security / X-Pack), require TLS and authentication tokens, and restrict ingress to authorized cluster nodes.'
    },
    10250: {
      what: 'Port 10250 is the HTTPS API port for the Kubernetes Kubelet node agent.',
      why: 'It allows the Kubernetes control plane to execute commands, retrieve container logs, and inspect pod metrics.',
      risk: 'If Kubelet authentication is configured to allow anonymous requests, attackers can achieve complete cluster takeover and container escape.',
      action: 'Disable anonymous auth (--anonymous-auth=false), enforce webhook authorization, and ensure port 10250 is unreachable from the public Internet.'
    },
    502: {
      what: 'Port 502 is the industrial Modbus protocol port used in SCADA and Industrial Control Systems (ICS).',
      why: 'It allows Programmable Logic Controllers (PLCs) and field telemetry equipment to receive operational commands.',
      risk: 'Modbus has no inherent encryption or authentication. Exposure can allow direct manipulation of physical industrial equipment.',
      action: 'Immediately isolate industrial automation hardware into air-gapped or dedicated OT security enclaves with strict unidirection gateways.'
    }
  };

  const known = portDescriptions[port] || {
    what: `Port ${port} (${protocol.toUpperCase()}) is a network communication endpoint configured for ${service}.`,
    why: `It indicates that the host operating system has an active process listening for incoming network connections on port ${port}.`,
    risk: `Open ports increase the host attack surface. The risk is determined by whether the listening service requires authentication and contains known software flaws.`,
    action: `Confirm whether this port is required for business operations. If not, close it in the host firewall or security group.`
  };

  const hasCves = cves.length > 0;
  const confidence: ConfidenceLevel = hasCves ? 'Confirmed' : 'Observed';

  return {
    title: `Port ${port}/${protocol.toUpperCase()} — ${service}`,
    category: 'port',
    whatIsIt: known.what,
    whatItMeans: `Network scanning confirmed an active listening socket on port ${port} responding with ${protocol.toUpperCase()} protocol packets.${banner ? ` Identified banner: "${banner}".` : ''}`,
    whyItMatters: known.why,
    howUseful: `Defensive security teams use port discovery to maintain an accurate external attack surface inventory, identify unauthorized shadow IT deployments, and verify firewall ingress policies.`,
    securityRisk: hasCves 
      ? `High Risk: This open port is associated with verified vulnerability records (${cves.join(', ')}). ${known.risk}`
      : `Exposure Notice: ${known.risk} (Note: an open port is not automatically a vulnerability unless software flaws or weak authentication exist).`,
    recommendedAction: known.action,
    confidence,
    evidence: `Observed via active TCP/UDP probe: State is open on ${assetContext?.ip || 'target host'}.`,
    priority: [22, 3389, 6379, 10250, 502].includes(port) || hasCves ? 'High' : 'Low',
    priorityReasoning: hasCves 
      ? 'Known CVEs are associated with the software running on this port.'
      : [3389, 6379, 10250, 502].includes(port) 
        ? 'Administrative/database/industrial protocol exposed to public Internet.'
        : 'Standard service port operating within baseline parameters.',
    nextSteps: [
      { priority: hasCves ? 'High' : 'Medium', action: `Review firewall rule for port ${port}.`, why: 'Ensure only authorized IP addresses can reach this socket.' },
      { priority: 'Low', action: `Audit version banner and service patch level.`, why: 'Prevents exploitation of known legacy vulnerabilities.' }
    ],
    suggestedQuestions: [
      `Why is port ${port} important?`,
      `Is port ${port} safe to leave exposed?`,
      `What should the administrator do to secure port ${port}?`
    ]
  };
}

function explainService(serviceName: string, serviceData: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const s = serviceData || {};
  const name = s.service || serviceName;
  const version = s.version || s.product || 'Unknown version';
  const cves = s.cves || [];

  const isConfirmedVuln = cves.length > 0;

  return {
    title: `Service Analysis: ${name}`,
    category: 'service',
    whatIsIt: `${name} is an active server software application or daemon handling incoming network client requests.`,
    whatItMeans: `The perimeter probe successfully interacted with the listening daemon and received a recognizable application protocol response (detected software: ${version}).`,
    whyItMatters: `Exposed services define the perimeter attack surface. Understanding which applications are reachable allows organizations to assess risk and audit software lifecycle health.`,
    howUseful: `Security operations teams use service intelligence to verify authorized software deployments, prioritize emergency patch cycles, and correlate zero-day disclosures against living inventories.`,
    securityRisk: isConfirmedVuln
      ? `Confirmed Risk: The detected version (${version}) matches published CVE advisories (${cves.join(', ')}). An adversary could exploit these flaws to compromise the service.`
      : `Potential Risk: Service detected. While detection alone is not a confirmed vulnerability, outdated minor releases or weak default configuration can expose the system to attack.`,
    recommendedAction: isConfirmedVuln
      ? `Update ${name} to the latest vendor-supported patch release immediately and review application logs for unauthorized activity.`
      : `Ensure ${name} is configured using least-privilege principles, with strong authentication and regular automated patching enabled.`,
    confidence: isConfirmedVuln ? 'Confirmed' : 'Inferred',
    evidence: `Service banner response captured on ${assetContext?.ip || 'target asset'}: "${s.banner || name + ' ' + version}".`,
    priority: isConfirmedVuln ? 'Critical' : 'Medium',
    priorityReasoning: isConfirmedVuln
      ? 'Confirmed CVE vulnerability exists in this software version.'
      : 'Service is active and externally reachable; requires continuous monitoring.',
    nextSteps: [
      { priority: 'High', action: `Audit ${name} version and release notes.`, why: 'Identifies if the version has reached End-of-Life (EOL).' },
      { priority: 'Medium', action: `Verify authentication requirements and access control list.`, why: 'Prevents unauthorized unauthenticated access.' }
    ],
    suggestedQuestions: [
      `Explain ${name} in simple terms`,
      `What is the difference between service detected and vulnerability confirmed for ${name}?`,
      `What should the administrator verify for ${name}?`
    ]
  };
}

function explainTechnology(techName: string, techData: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const t = techData || {};
  const version = t.version || 'Version unspecified';
  const category = t.category || 'Software Component';

  return {
    title: `Technology Stack: ${techName}`,
    category: 'technology',
    whatIsIt: `${techName} is a widely utilized ${category.toLowerCase()} component responsible for powering web applications or infrastructure workflows.`,
    whatItMeans: `HTTP headers, response cookies, HTML signatures, or protocol handshakes confirm that ${techName} (${version}) is embedded in the application stack.`,
    whyItMatters: `Technology finger-printing helps security teams map dependencies, assess supply-chain risks, and identify legacy software stacks before adversaries do.`,
    howUseful: `Enables automated Software Bill of Materials (SBOM) tracking, attack surface management, and fast vulnerability matching when new advisories are published.`,
    securityRisk: `Attackers frequently target known implementation bugs, unpatched plugins, or default configuration templates associated with ${techName}.`,
    recommendedAction: `Keep ${techName} updated to the stable LTS channel, remove unnecessary server header disclosure tokens, and review hardening guidelines.`,
    confidence: 'Observed',
    evidence: `Signature detected via HTTP headers and response body telemetry.`,
    priority: 'Low',
    priorityReasoning: `Component identification without specific proof of exploitability.`,
    nextSteps: [
      { priority: 'Low', action: `Suppress verbose version banners in server configuration.`, why: 'Reduces information leakage to automated scanners.' }
    ],
    suggestedQuestions: [
      `What is ${techName} and why is it used?`,
      `Are there known vulnerabilities in this version of ${techName}?`,
      `How can we harden ${techName}?`
    ]
  };
}

function explainVulnerability(cveId: string, vulnData: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const v = vulnData || {};
  const cvss = v.cvss || 7.5;
  const severity = v.severity || (cvss >= 9 ? 'CRITICAL' : cvss >= 7 ? 'HIGH' : cvss >= 4 ? 'MEDIUM' : 'LOW');
  const title = v.title || `${cveId} Vulnerability`;
  const product = v.affectedProduct || 'Target Software';
  const inKev = v.inCisaKev;
  const exploitAvailable = v.exploitAvailable;

  return {
    title: `${cveId} (${severity} — CVSS ${cvss})`,
    category: 'vulnerability',
    whatIsIt: `${cveId} is an officially tracked Common Vulnerabilities and Exposures (CVE) security flaw affecting ${product}. In simple terms: ${v.description || title}`,
    whatItMeans: `The scanned asset exposes a software version or configuration that matches public security advisories for this vulnerability.`,
    whyItMatters: `If exploited by an attacker, this vulnerability could allow unauthorized access, data theft, denial of service, or remote code execution on the target host.`,
    howUseful: `Security teams use CVE records to prioritize emergency patching schedules, deploy virtual firewall patches (WAF/IPS), and assess exposure to active cyber threat campaigns.`,
    securityRisk: `Realistic Impact: ${severity} severity (CVSS ${cvss}/10). ${exploitAvailable ? 'Public exploit code exists for this vulnerability.' : 'No public weaponized exploit has been observed.'} ${inKev ? '🚨 Cataloged in CISA Known Exploited Vulnerabilities (KEV).' : ''}`,
    recommendedAction: v.remediation?.summary || `Upgrade ${product} to the latest vendor-recommended secure version or apply vendor mitigation workarounds immediately.`,
    confidence: 'Confirmed',
    evidence: `Confirmed by matching detected software banner (${product}) against the National Vulnerability Database (NVD).`,
    priority: severity === 'CRITICAL' || inKev ? 'Critical' : severity === 'HIGH' ? 'High' : 'Medium',
    priorityReasoning: inKev 
      ? 'CISA KEV flag indicates active in-the-wild exploitation by threat actors.'
      : `CVSS score of ${cvss} indicates substantial potential impact on confidentiality, integrity, or availability.`,
    nextSteps: [
      { priority: 'High', action: `Apply vendor patch for ${product}.`, why: 'Remediates the root cause vulnerability in the application binary.' },
      { priority: 'Medium', action: `Implement network layer firewall / WAF filters.`, why: 'Provides temporary defense-in-depth while patches are scheduled.' },
      { priority: 'Low', action: `Review host logs for anomalous connection patterns.`, why: 'Verifies whether prior exploitation attempts occurred.' }
    ],
    suggestedQuestions: [
      `What is ${cveId} in simple terms?`,
      `How serious is this vulnerability and why?`,
      `What should the administrator do first to fix ${cveId}?`
    ]
  };
}

function explainDns(recordType: string, recordData: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const rec = recordData || {};
  const type = (rec.type || recordType || 'A').toUpperCase();
  const value = rec.value || 'DNS Record';
  const name = rec.name || assetContext?.domain || 'domain';

  const typeDetails: Record<string, { what: string; useful: string; sec: string; action: string }> = {
    A: {
      what: 'An A (Address) record maps a domain name directly to an IPv4 address.',
      useful: 'Identifies the authoritative IP address hosting web or network infrastructure for the domain.',
      sec: 'Ensures traffic routes to legitimate servers. Dangling A records can lead to subdomain takeover if cloud IP is released.',
      action: 'Verify that the destination IPv4 address is owned and actively managed by your organization.'
    },
    AAAA: {
      what: 'An AAAA record maps a domain name to an IPv6 (128-bit) Internet address.',
      useful: 'Enables modern dual-stack IPv6 routing across modern global networks.',
      sec: 'IPv6 endpoints must have the same firewall and security controls applied as IPv4 servers.',
      action: 'Confirm security group rules and intrusion detection systems inspect IPv6 traffic equally.'
    },
    MX: {
      what: 'An MX (Mail Exchange) record identifies the mail servers responsible for receiving email on behalf of a domain.',
      useful: 'Directs incoming SMTP email traffic to corporate mail gateways or cloud providers.',
      sec: 'Mail servers must enforce SPF, DKIM, and DMARC records to prevent email spoofing, phishing, and domain impersonation.',
      action: 'Audit mail server reputation, enforce TLS for SMTP (MTA-STS), and verify strict DMARC enforcement.'
    },
    NS: {
      what: 'An NS (Name Server) record delegates a DNS zone to use specific authoritative DNS servers.',
      useful: 'Determines which authoritative name servers answer DNS queries for the domain.',
      sec: 'Hijacked or misconfigured NS records can lead to complete DNS takeover, redirecting all domain traffic.',
      action: 'Ensure name servers are protected with registrar locks, multi-factor authentication, and DNSSEC.'
    },
    TXT: {
      what: 'A TXT (Text) record holds arbitrary human- and machine-readable text data associated with a host.',
      useful: 'Used extensively for domain ownership verification, SPF email authentication, and security policy publishing.',
      sec: 'Attackers inspect TXT records to discover third-party SaaS vendors, security tools, and verification tokens.',
      action: 'Audit TXT records to ensure SPF records are properly formatted and delete obsolete domain verification tokens.'
    },
    CNAME: {
      what: 'A CNAME (Canonical Name) record aliases one domain name to another canonical domain name.',
      useful: 'Simplifies DNS management by pointing subdomains to external services, CDNs, or load balancers.',
      sec: 'Dangling CNAME records pointing to decommissioned S3 buckets, GitHub Pages, or Azure resources allow subdomain takeover.',
      action: 'Audit all CNAME records to verify destination resources exist and are actively maintained.'
    },
    SOA: {
      what: 'An SOA (Start of Authority) record provides authoritative information about the DNS zone, including the primary name server and zone transfer timers.',
      useful: 'Governs zone propagation parameters, serial numbers, and administrator contact information.',
      sec: 'Exposed administrator email addresses in SOA records can be harvested for targeted social engineering.',
      action: 'Review zone serial numbers and refresh intervals to ensure reliable and rapid DNS propagation.'
    },
    PTR: {
      what: 'A PTR (Pointer) record provides reverse DNS lookup, mapping an IP address back to a hostname.',
      useful: 'Used by mail systems and network diagnostics to verify the authenticity of an IP address.',
      sec: 'Forward-confirmed reverse DNS (FCrDNS) is essential for mail server deliverability and legitimacy verification.',
      action: 'Ensure PTR records match forward A records for critical outbound mail and service nodes.'
    }
  };

  const details = typeDetails[type] || {
    what: `A ${type} record contains DNS routing and configuration data for ${name}.`,
    useful: `Helps clients and resolvers look up necessary addressing and delegation parameters.`,
    sec: `DNS configurations must be maintained to prevent traffic hijacking and domain spoofing.`,
    action: `Audit this DNS entry to ensure it points to active and authorized infrastructure.`
  };

  return {
    title: `DNS Record: ${type} (${name})`,
    category: 'dns',
    whatIsIt: details.what,
    whatItMeans: `DNS zone query returned: ${name} -> ${value} (Record Type: ${type}).`,
    whyItMatters: details.useful,
    howUseful: `Security teams use DNS intelligence to detect unauthorized subdomains, identify dangling cloud assets, and verify email spoofing protections.`,
    securityRisk: `Security Relevance: ${details.sec}`,
    recommendedAction: details.action,
    confidence: 'Observed',
    evidence: `Authoritative DNS query response for ${name}.`,
    priority: 'Low',
    priorityReasoning: `Standard operational DNS configuration record.`,
    nextSteps: [
      { priority: 'Low', action: `Verify DNS record points to active infrastructure.`, why: 'Prevents dangling DNS takeover vulnerabilities.' }
    ],
    suggestedQuestions: [
      `Why is this ${type} DNS record useful?`,
      `What security relevance does this DNS record have?`,
      `What should the administrator verify for this DNS entry?`
    ]
  };
}

function explainSsl(sslData: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const ssl = sslData || assetContext?.sslInfo || {};
  const isExpired = ssl.isExpired;
  const grade = ssl.grade || 'B';
  const issuer = ssl.issuer || 'Certificate Authority';
  const tlsVersion = ssl.tlsVersion || 'TLS 1.2 / 1.3';
  const days = ssl.daysRemaining ?? 30;

  let riskText = `The certificate is active with ${days} days remaining until expiration. Grade: ${grade}.`;
  let actionText = `Monitor certificate lifecycle and verify automated renewal hooks (e.g., Let's Encrypt certbot).`;
  let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';

  if (isExpired) {
    riskText = `⚠️ The SSL/TLS certificate is expired! Web browsers and API clients will reject connections with severe security warnings.`;
    actionText = `Immediately replace and renew the expired certificate on all listening web and proxy servers.`;
    priority = 'Critical';
  } else if (days < 14) {
    riskText = `The certificate is approaching expiration (${days} days left). Imminent expiration will disrupt HTTPS operations.`;
    actionText = `Renew the certificate before expiration and verify the complete certificate chain.`;
    priority = 'High';
  }

  return {
    title: `SSL / TLS Certificate (${grade} Grade)`,
    category: 'ssl',
    whatIsIt: `An SSL/TLS digital certificate verifies the identity of the server and encrypts communications between clients and the server.`,
    whatItMeans: `The scanned endpoint completed a TLS cryptographic handshake using protocol version ${tlsVersion} issued by ${issuer}.`,
    whyItMatters: `Valid SSL/TLS certificates protect sensitive data from eavesdropping and tampering, while assuring clients of authentic server identity.`,
    howUseful: `Security teams audit certificate transparency logs, cipher suites, and expiration timelines to prevent outages and cryptographic vulnerabilities.`,
    securityRisk: riskText,
    recommendedAction: actionText,
    confidence: 'Observed',
    evidence: `Retrieved X.509 certificate data: Subject CN: ${ssl.subject || 'N/A'}, Issuer: ${issuer}, Valid until: ${ssl.validTo || 'N/A'}.`,
    priority,
    priorityReasoning: isExpired ? 'Expired certificate causes immediate service outage and user trust failure.' : 'Cryptographic configuration monitoring.',
    nextSteps: [
      { priority: isExpired ? 'High' : 'Medium', action: `Renew SSL certificate.`, why: 'Maintains encrypted communication and avoids browser warnings.' },
      { priority: 'Low', action: `Verify TLS 1.3 and strong cipher suites.`, why: 'Guarantees forward secrecy and modern cipher strength.' }
    ],
    suggestedQuestions: [
      `What does this SSL certificate status mean?`,
      `How does TLS certificate expiration impact users?`,
      `What should the administrator do to improve the SSL grade?`
    ]
  };
}

function explainHeader(headerName: string, headerData: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const h = headerData || {};
  const name = h.name || headerName;
  const status = h.status || 'missing';
  const isPresent = status === 'present';

  const headerDetails: Record<string, { what: string; why: string; rec: string }> = {
    'Content-Security-Policy': {
      what: 'Content-Security-Policy (CSP) restricts the resources (scripts, images, stylesheets) that a browser is allowed to load.',
      why: 'It is one of the most effective defenses against Cross-Site Scripting (XSS) and data injection attacks.',
      rec: 'Deploy a strict CSP header that restricts script-src and object-src to trusted origins or nonces.'
    },
    'Strict-Transport-Security': {
      what: 'Strict-Transport-Security (HSTS) informs browsers that the site must only be accessed via secure HTTPS connections.',
      why: 'It prevents SSL-stripping attacks and stops users from bypassing invalid certificate warnings.',
      rec: 'Set Strict-Transport-Security: max-age=31536000; includeSubDomains; preload.'
    },
    'X-Content-Type-Options': {
      what: 'X-Content-Type-Options stops browsers from MIME-sniffing a response away from the declared content-type.',
      why: 'Prevents drive-by download attacks and malicious script execution disguised as image files.',
      rec: 'Set X-Content-Type-Options: nosniff.'
    },
    'X-Frame-Options': {
      what: 'X-Frame-Options controls whether a browser is allowed to render a page in a <frame>, <iframe>, or <embed>.',
      why: 'Protects users against Clickjacking attacks where malicious sites overlay transparent UI over your page.',
      rec: 'Set X-Frame-Options: DENY or SAMEORIGIN (or use CSP frame-ancestors).'
    },
    'Referrer-Policy': {
      what: 'Referrer-Policy controls how much referrer information is included with requests made from your site.',
      why: 'Prevents leakage of sensitive user parameters or internal URL paths to third-party domains.',
      rec: 'Set Referrer-Policy: strict-origin-when-cross-origin.'
    },
    'Permissions-Policy': {
      what: 'Permissions-Policy allows site owners to selectively enable or disable browser features (camera, microphone, geolocation).',
      why: 'Enforces least-privilege on browser API capabilities and protects end-user privacy.',
      rec: 'Configure Permissions-Policy to disable unused hardware sensors and APIs.'
    }
  };

  const details = headerDetails[name] || {
    what: `${name} is an HTTP response security header that configures browser security mechanisms.`,
    why: `Security headers harden web applications against client-side tampering and data leakage.`,
    rec: `Review OWASP Secure Headers guidelines for ${name}.`
  };

  return {
    title: `Security Header: ${name}`,
    category: 'header',
    whatIsIt: details.what,
    whatItMeans: isPresent 
      ? `The web server transmits this header in HTTP response headers (Value: "${h.value || 'configured'}").`
      : `The web server does NOT include this header in HTTP responses.`,
    whyItMatters: details.why,
    howUseful: `Security engineers audit HTTP headers to ensure defense-in-depth against client-side exploitation (XSS, clickjacking, protocol downgrade).`,
    securityRisk: isPresent
      ? `Well-configured: Header is active and protecting browser sessions.`
      : `Missing Header: Not a critical vulnerability on its own, but leaves the application without valuable browser-level defensive guardrails.`,
    recommendedAction: isPresent
      ? `Verify that the header value follows current industry best practices.`
      : details.rec,
    confidence: 'Observed',
    evidence: `HTTP GET response inspection on ${assetContext?.ip || 'target'}.`,
    priority: isPresent ? 'Low' : 'Medium',
    priorityReasoning: `Missing security headers are configuration defense-in-depth findings rather than direct remote code execution vulnerabilities.`,
    nextSteps: [
      { priority: 'Medium', action: isPresent ? `Maintain header configuration.` : `Add ${name} to reverse proxy configuration.`, why: 'Hardens web browser client execution.' }
    ],
    suggestedQuestions: [
      `What does the ${name} header do?`,
      `Is a missing ${name} header a critical vulnerability?`,
      `How should the administrator configure ${name}?`
    ]
  };
}

function explainIpAndNetwork(ip: string, data: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const asset = data || assetContext || {};
  const asn = asset.asn || 'AS Number';
  const org = asset.org || 'Organization';
  const country = asset.country || 'Location';
  const cloud = asset.cloudProvider || 'Cloud/Hosting';

  return {
    title: `Infrastructure & Network: ${ip}`,
    category: 'ip',
    whatIsIt: `An IP (Internet Protocol) address is the unique numerical identifier assigned to a device connected to the Internet. The Autonomous System Number (${asn}) identifies the routing network organization responsible for this address range.`,
    whatItMeans: `This asset is an Internet-facing host hosted by ${org} in ${country}${cloud ? ` on ${cloud} cloud infrastructure` : ''}.`,
    whyItMatters: `Knowing the ASN, ISP, and geographic origin establishes the jurisdictional boundary, hosting provider, and upstream network topology of an asset.`,
    howUseful: `Security teams use network intelligence to distinguish between corporate-owned IP blocks, third-party cloud infrastructure, CDN proxies, and unauthorized shadow IT deployments.`,
    securityRisk: `Internet-facing IP addresses are continuously scanned by research crawlers and malicious botnets. Every exposed port directly contributes to the organization's external attack surface.`,
    recommendedAction: `Confirm that this IP is documented in your corporate asset inventory and that appropriate edge firewall filters are in place.`,
    confidence: 'Observed',
    evidence: `BGP routing table and WHOIS registration data confirms ${asn} (${org}).`,
    priority: 'Low',
    priorityReasoning: `Network addressing telemetry establishing infrastructure provenance.`,
    nextSteps: [
      { priority: 'Low', action: `Document IP ownership in asset inventory.`, why: 'Ensures external perimeter tracking.' }
    ],
    suggestedQuestions: [
      `Explain this IP and its network organization.`,
      `What does the ASN ${asn} mean for this asset?`,
      `What should the administrator verify for this network host?`
    ]
  };
}

function explainRiskScore(score: number, data: any, assetContext?: Partial<AssetIntelligence>): AIExplanationItem {
  const asset = data || assetContext || {};
  const vulns = asset.vulnerabilities?.length || 0;
  const ports = asset.openPorts?.length || 0;
  const severity = asset.severity || (score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW');

  return {
    title: `Attack Surface Risk Score: ${score}/100 (${severity})`,
    category: 'risk_score',
    whatIsIt: `The BLACKTRACE Risk Score is an algorithmic rating (from 0 to 100) reflecting an asset's external exposure, vulnerability severity, and configuration weaknesses.`,
    whatItMeans: `A score of ${score}/100 indicates ${severity.toLowerCase()} risk posture driven by ${vulns} identified CVE(s) and ${ports} exposed service port(s).`,
    whyItMatters: `Prioritizes which assets in a large external perimeter require urgent triage, patch deployment, or perimeter firewall adjustments.`,
    howUseful: `Assists CISOs, SOC leads, and DevSecOps teams in tracking exposure trends over time and focusing engineering resources where risk is highest.`,
    securityRisk: `Why is the score ${score}? The score is calculated based on: (1) Detected CVE severity and CISA KEV status, (2) Open administrative ports (e.g. SSH, RDP, Redis), (3) SSL/TLS cryptographic grade, and (4) Missing HTTP security headers.`,
    recommendedAction: `Review the prioritized action list: address critical CVEs first, restrict open management ports, and improve TLS configurations.`,
    confidence: 'Inferred',
    evidence: `Algorithmic composite of observed port exposure (${ports} ports) and verified vulnerabilities (${vulns} CVEs).`,
    priority: score >= 70 ? 'High' : 'Low',
    priorityReasoning: `The score is an indicator based on available intelligence and should not be presented as an absolute measure of security.`,
    nextSteps: [
      { priority: 'High', action: `Triage highest severity CVEs.`, why: 'Reduces exploit probability immediately.' },
      { priority: 'Medium', action: `Review exposed management ports.`, why: 'Decreases external attack surface.' }
    ],
    suggestedQuestions: [
      `Why is the risk score ${score}/100?`,
      `Which finding should I fix first to reduce this score?`,
      `How is this risk score calculated?`
    ]
  };
}

/**
 * Builds the complete AI Asset Summary structured analysis object.
 */
export function buildAssetSummaryExplanation(asset: AssetIntelligence): AIAssetSummaryExplanation {
  const vulns = asset.vulnerabilities || [];
  const ports = asset.openPorts || [];
  const techs = asset.technologies || [];
  const vulnCount = vulns.length;
  const portCount = ports.length;
  const hasCritical = vulns.some(v => v.severity === 'CRITICAL' || v.inCisaKev);
  const exposedAdminPorts = ports.filter(p => [22, 3389, 6379, 10250, 3306, 5432, 502].includes(p.port));

  const contributingFactors = [
    {
      factor: 'Exposed Internet Ports',
      impact: portCount > 4 ? 'high' as const : 'medium' as const,
      description: `${portCount} publicly reachable port(s) detected (${ports.map(p => p.port).join(', ')}).`
    },
    {
      factor: 'Vulnerability Severity',
      impact: hasCritical ? 'high' as const : vulnCount > 0 ? 'medium' as const : 'low' as const,
      description: vulnCount > 0 ? `${vulnCount} CVE finding(s) identified in running software banners.` : 'No known public CVEs detected.'
    },
    {
      factor: 'Cryptographic Health (SSL/TLS)',
      impact: asset.sslInfo?.isExpired ? 'high' as const : 'low' as const,
      description: asset.sslInfo ? `Certificate issued by ${asset.sslInfo.issuer} (Grade: ${asset.sslInfo.grade}).` : 'No SSL certificate analyzed.'
    },
    {
      factor: 'Security Headers',
      impact: 'low' as const,
      description: `${asset.securityHeaders?.filter(h => h.status === 'present').length || 0} active security header(s).`
    }
  ];

  const recommendedNextSteps = [];

  if (hasCritical || vulnCount > 0) {
    recommendedNextSteps.push({
      priority: 1 as const,
      level: 'Critical' as const,
      title: 'Triage High-Severity CVEs',
      action: `Review and patch software affected by ${vulns.slice(0, 2).map(v => v.cveId).join(', ')}.`,
      targetComponent: vulns[0]?.affectedProduct || 'Software'
    });
  }

  if (exposedAdminPorts.length > 0) {
    recommendedNextSteps.push({
      priority: 2 as const,
      level: 'High' as const,
      title: 'Restrict Administrative Sockets',
      action: `Remove exposed management ports (${exposedAdminPorts.map(p => p.port).join(', ')}) from public access and place behind VPN/ACL.`,
      targetComponent: 'Firewall / Perimeter'
    });
  }

  if (asset.sslInfo?.isExpired || (asset.sslInfo?.daysRemaining && asset.sslInfo.daysRemaining < 30)) {
    recommendedNextSteps.push({
      priority: 3 as const,
      level: 'Medium' as const,
      title: 'Renew SSL/TLS Certificate',
      action: `Renew SSL certificate for ${asset.sslInfo?.subject || asset.domain} before expiration.`,
      targetComponent: 'TLS Certificate'
    });
  }

  recommendedNextSteps.push({
    priority: (recommendedNextSteps.length + 1) as any,
    level: 'Low' as const,
    title: 'Harden HTTP Security Headers',
    action: 'Enforce HSTS (Strict-Transport-Security) and Content-Security-Policy (CSP) on public endpoints.',
    targetComponent: 'Web Server'
  });

  return {
    whatIsThis: `This asset is an Internet-facing host (${asset.ip}${asset.domain ? ` / ${asset.domain}` : ''}) operated by ${asset.org} (${asset.asn}) in ${asset.city}, ${asset.country}.`,
    whatDoesItMean: `The scan identified ${portCount} publicly reachable service port(s), ${techs.length} identified technology stack component(s), and ${vulnCount} recorded vulnerability record(s).`,
    whyDoesItMatter: `Publicly exposed services increase the organization's external attack surface. Each open port and active software daemon represents a potential entry point that requires deliberate access controls and patch maintenance.`,
    howSecurityTeamsUseThis: [
      'Attack-surface management: Catalog all publicly accessible assets and ports.',
      'Asset inventory: Verify that this host is registered in corporate CMDB / asset tracking systems.',
      'Vulnerability prioritization: Rank patch urgency by CVSS severity and exploit weaponization status.',
      'Configuration review: Ensure administrative services (SSH, RDP, databases) are restricted behind VPNs.',
      'Compliance & auditing: Validate cryptographic TLS standards and security header deployment.'
    ],
    riskScoreExplanation: {
      score: asset.riskScore,
      severity: asset.severity,
      whyThisScore: `The score of ${asset.riskScore}/100 reflects the combination of ${portCount} open service ports, ${vulnCount} detected CVE vulnerabilities, and external perimeter exposure.`,
      contributingFactors,
      disclaimer: `The score is an indicator based on available intelligence and should not be presented as an absolute measure of security.`
    },
    recommendedNextSteps,
    confidenceFindings: [
      {
        level: 'Observed',
        text: `Port(s) ${ports.map(p => p.port).join(', ')} are open and reachable over the Internet.`,
        evidence: 'Direct TCP/UDP probe handshake.'
      },
      {
        level: 'Inferred',
        text: `Software stack includes ${techs.map(t => t.name).join(', ') || 'standard web services'}.`,
        evidence: 'HTTP response signatures and service banners.'
      },
      {
        level: vulnCount > 0 ? 'Confirmed' : 'Potential',
        text: vulnCount > 0 ? `${vulnCount} confirmed CVE advisory matches for detected software versions.` : 'No immediate CVE matches found in public databases.',
        evidence: vulnCount > 0 ? vulns.map(v => v.cveId).join(', ') : 'NVD database correlation.'
      }
    ]
  };
}

function getCommonPortService(port: number): string {
  const map: Record<number, string> = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    465: 'SMTPS',
    502: 'Modbus',
    993: 'IMAPS',
    995: 'POP3S',
    3306: 'MySQL',
    3389: 'RDP',
    5432: 'PostgreSQL',
    6379: 'Redis',
    8080: 'HTTP-Alt',
    8443: 'HTTPS-Alt',
    9200: 'Elasticsearch',
    10250: 'Kubelet',
    27017: 'MongoDB'
  };
  return map[port] || 'Unknown Service';
}
