import { AssetIntelligence, VulnerabilityRecord, GlobalTelemetryStats } from '../src/types';

export const VULNERABILITY_DATABASE: VulnerabilityRecord[] = [
  {
    cveId: 'CVE-2024-6387',
    title: 'OpenSSH Server (sshd) Remote Code Execution (regreSSHion)',
    description: 'A signal handler race condition vulnerability in OpenSSH server (sshd) on glibc-based Linux systems allows unauthenticated remote attackers to execute arbitrary code with root privileges.',
    cvss: 8.1,
    severity: 'HIGH',
    epssScore: 0.724,
    epssPercentile: 98.4,
    inCisaKev: true,
    exploitAvailable: true,
    exploitType: 'Public PoC',
    affectedProduct: 'OpenSSH',
    affectedVersions: ['8.5p1 through 9.7p1', 'earlier versions < 4.4p1'],
    publishedDate: '2024-07-01',
    updatedDate: '2024-08-15',
    cwe: 'CWE-362: Concurrent Execution using Shared Resource with Improper Synchronization',
    references: [
      'https://nvd.nist.gov/vuln/detail/CVE-2024-6387',
      'https://www.qualys.com/2024/07/01/cve-2024-6387/regresshion.txt',
      'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'
    ],
    remediation: {
      summary: 'Upgrade OpenSSH to version 9.8p1 or newer. If immediate patching is not possible, apply sshd_config mitigation.',
      patchAvailable: true,
      recommendedVersion: 'OpenSSH 9.8p1 or later',
      mitigationSteps: [
        'Set `LoginGraceTime 0` in /etc/ssh/sshd_config (note: may expose to DoS by exhausting max connections).',
        'Restrict SSH access using network-level firewall rules or VPN boundary.',
        'Update package via distribution manager: `apt update && apt install --only-upgrade openssh-server`.'
      ]
    }
  },
  {
    cveId: 'CVE-2024-21762',
    title: 'Fortinet FortiOS Out-of-Bounds Write in SSL-VPN Web Portal',
    description: 'A critical out-of-bounds write vulnerability in Fortinet FortiOS and FortiProxy SSL-VPN portal allows unauthenticated remote attackers to execute arbitrary code or commands via specially crafted HTTP requests.',
    cvss: 9.8,
    severity: 'CRITICAL',
    epssScore: 0.945,
    epssPercentile: 99.8,
    inCisaKev: true,
    exploitAvailable: true,
    exploitType: 'Weaponized',
    affectedProduct: 'Fortinet FortiOS / FortiProxy',
    affectedVersions: ['FortiOS 7.4.0 - 7.4.2', 'FortiOS 7.2.0 - 7.2.6', 'FortiOS 7.0.0 - 7.0.13'],
    publishedDate: '2024-02-09',
    updatedDate: '2024-06-20',
    cwe: 'CWE-787: Out-of-bounds Write',
    references: [
      'https://www.fortiguard.com/psirt/FG-IR-24-015',
      'https://nvd.nist.gov/vuln/detail/CVE-2024-21762'
    ],
    remediation: {
      summary: 'Immediately update FortiOS firmware to version 7.4.3, 7.2.7, 7.0.14 or higher.',
      patchAvailable: true,
      recommendedVersion: 'FortiOS 7.4.3+',
      mitigationSteps: [
        'Disable SSL-VPN service immediately on exposed WAN interfaces.',
        'Enforce IP whitelisting for administrative access.',
        'Audit device logs for suspicious POST requests to /remote/login.'
      ]
    }
  },
  {
    cveId: 'CVE-2024-3400',
    title: 'Palo Alto Networks PAN-OS Command Injection in GlobalProtect',
    description: 'Command injection vulnerability in the GlobalProtect feature of Palo Alto Networks PAN-OS software allows an unauthenticated attacker to execute arbitrary code with root privileges on the firewall.',
    cvss: 10.0,
    severity: 'CRITICAL',
    epssScore: 0.968,
    epssPercentile: 99.9,
    inCisaKev: true,
    exploitAvailable: true,
    exploitType: 'Weaponized',
    affectedProduct: 'Palo Alto Networks PAN-OS',
    affectedVersions: ['PAN-OS 10.2', 'PAN-OS 11.0', 'PAN-OS 11.1'],
    publishedDate: '2024-04-12',
    updatedDate: '2024-07-10',
    cwe: 'CWE-77: Improper Neutralization of Special Elements used in a Command',
    references: [
      'https://security.paloaltonetworks.com/CVE-2024-3400',
      'https://nvd.nist.gov/vuln/detail/CVE-2024-3400'
    ],
    remediation: {
      summary: 'Apply vendor hotfixes for PAN-OS 10.2, 11.0, and 11.1 immediately.',
      patchAvailable: true,
      recommendedVersion: 'PAN-OS 11.1.2-h3, 11.0.4-h1, 10.2.9-h1',
      mitigationSteps: [
        'Disable device telemetry until hotfix is installed.',
        'Apply Threat Prevention Signatures 94970 and 94982 if Threat Prevention subscription is active.'
      ]
    }
  },
  {
    cveId: 'CVE-2024-23897',
    title: 'Jenkins Controller Arbitrary File Read via CLI args4j parser',
    description: 'Jenkins uses the args4j library to parse command arguments on the Jenkins controller. The command parser expands @ character followed by a file path into file contents, allowing unauthenticated attackers to read arbitrary files on the controller.',
    cvss: 9.8,
    severity: 'CRITICAL',
    epssScore: 0.891,
    epssPercentile: 99.2,
    inCisaKev: true,
    exploitAvailable: true,
    exploitType: 'Public PoC',
    affectedProduct: 'Jenkins Core',
    affectedVersions: ['Jenkins <= 2.441', 'Jenkins LTS <= 2.426.2'],
    publishedDate: '2024-01-24',
    updatedDate: '2024-05-18',
    cwe: 'CWE-200: Exposure of Sensitive Information to an Unauthorized Actor',
    references: [
      'https://www.jenkins.io/security/advisory/2024-01-24/',
      'https://nvd.nist.gov/vuln/detail/CVE-2024-23897'
    ],
    remediation: {
      summary: 'Upgrade Jenkins to version 2.442 or LTS 2.426.3.',
      patchAvailable: true,
      recommendedVersion: 'Jenkins 2.442 / LTS 2.426.3',
      mitigationSteps: [
        'Disable the CLI feature by creating a Groovy init script: `jenkins.CLI.get().setEnabled(false)`.',
        'Isolate Jenkins controller from untrusted network perimeters.'
      ]
    }
  },
  {
    cveId: 'CVE-2023-4966',
    title: 'Citrix NetScaler ADC / Gateway Sensitive Information Disclosure (CitrixBleed)',
    description: 'Citrix ADC and Citrix Gateway when configured as Gateway or AAA virtual server contain a buffer over-read vulnerability allowing unauthenticated remote extraction of valid user session tokens.',
    cvss: 9.4,
    severity: 'CRITICAL',
    epssScore: 0.952,
    epssPercentile: 99.8,
    inCisaKev: true,
    exploitAvailable: true,
    exploitType: 'Weaponized',
    affectedProduct: 'Citrix NetScaler ADC / Gateway',
    affectedVersions: ['NetScaler ADC / Gateway 14.1 < 14.1-8.50', 'NetScaler ADC / Gateway 13.1 < 13.1-49.15'],
    publishedDate: '2023-10-10',
    updatedDate: '2024-04-02',
    cwe: 'CWE-119: Improper Restriction of Operations within the Bounds of a Memory Buffer',
    references: [
      'https://support.citrix.com/article/CTX579459',
      'https://nvd.nist.gov/vuln/detail/CVE-2023-4966'
    ],
    remediation: {
      summary: 'Upgrade firmware and invalidate all active session tokens immediately.',
      patchAvailable: true,
      recommendedVersion: 'NetScaler 14.1-8.50+, 13.1-49.15+',
      mitigationSteps: [
        'Terminate all active ICA and HTTP sessions post update: `kill aaa session -all`.',
        'Rotate all SAML certificates and active secrets.'
      ]
    }
  },
  {
    cveId: 'CVE-2021-44228',
    title: 'Apache Log4j2 JNDI Remote Code Execution (Log4Shell)',
    description: 'Apache Log4j2 versions 2.0-beta9 to 2.14.1 JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints.',
    cvss: 10.0,
    severity: 'CRITICAL',
    epssScore: 0.975,
    epssPercentile: 100.0,
    inCisaKev: true,
    exploitAvailable: true,
    exploitType: 'Weaponized',
    affectedProduct: 'Apache Log4j',
    affectedVersions: ['2.0-beta9 through 2.14.1'],
    publishedDate: '2021-12-10',
    updatedDate: '2024-03-01',
    cwe: 'CWE-502: Deserialization of Untrusted Data',
    references: [
      'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
      'https://logging.apache.org/log4j/2.x/security.html'
    ],
    remediation: {
      summary: 'Upgrade Log4j to 2.17.1 (Java 8) or 2.12.4 (Java 7).',
      patchAvailable: true,
      recommendedVersion: 'Log4j >= 2.17.1',
      mitigationSteps: [
        'Remove the JndiLookup class from classpath: `zip -q -d log4j-core-*.jar org/apache/logging/log4j/core/lookup/JndiLookup.class`.',
        'Set system property `log4j2.formatMsgNoLookups=true` (for versions >= 2.10).'
      ]
    }
  },
  {
    cveId: 'CVE-2021-41773',
    title: 'Apache HTTP Server Path Traversal and Remote File Execution',
    description: 'A flaw in path normalization in Apache HTTP Server 2.4.49 allows mapping of URLs outside of the document root, potentially enabling unauthorized file read or CGI script execution.',
    cvss: 7.5,
    severity: 'HIGH',
    epssScore: 0.912,
    epssPercentile: 99.4,
    inCisaKev: true,
    exploitAvailable: true,
    exploitType: 'Weaponized',
    affectedProduct: 'Apache HTTP Server',
    affectedVersions: ['2.4.49', '2.4.50 (incomplete fix CVE-2021-42013)'],
    publishedDate: '2021-10-05',
    updatedDate: '2023-11-20',
    cwe: 'CWE-22: Improper Limitation of a Pathname to a Restricted Directory',
    references: [
      'https://httpd.apache.org/security/vulnerabilities_24.html',
      'https://nvd.nist.gov/vuln/detail/CVE-2021-41773'
    ],
    remediation: {
      summary: 'Update Apache HTTP Server to version 2.4.51 or higher.',
      patchAvailable: true,
      recommendedVersion: 'Apache 2.4.51+',
      mitigationSteps: [
        'Ensure configuration sets `<Directory /> Require all denied </Directory>`.',
        'Avoid enabling mod_cgi if not strictly needed.'
      ]
    }
  },
  {
    cveId: 'CVE-2022-22965',
    title: 'Spring Framework Remote Code Execution via Data Binding (Spring4Shell)',
    description: 'A Spring MVC or Spring WebFlux application running on JDK 9+ may be vulnerable to remote code execution via data binding when packaged as a traditional WAR and deployed on a standalone Servlet container.',
    cvss: 9.8,
    severity: 'CRITICAL',
    epssScore: 0.884,
    epssPercentile: 99.1,
    inCisaKev: true,
    exploitAvailable: true,
    exploitType: 'Public PoC',
    affectedProduct: 'Spring Framework',
    affectedVersions: ['5.3.0 to 5.3.17', '5.2.0 to 5.2.19'],
    publishedDate: '2022-04-01',
    updatedDate: '2023-09-14',
    cwe: 'CWE-94: Improper Control of Generation of Code',
    references: [
      'https://spring.io/blog/2022/03/31/spring-framework-rce-early-announcement',
      'https://nvd.nist.gov/vuln/detail/CVE-2022-22965'
    ],
    remediation: {
      summary: 'Upgrade Spring Framework to 5.3.18+ or 5.2.20+.',
      patchAvailable: true,
      recommendedVersion: 'Spring 5.3.18+ / 6.0+',
      mitigationSteps: [
        'Upgrade to Apache Tomcat 10.0.20, 9.0.62, or 8.5.78.',
        'Use disallowFields on InitBinder to block `class.*`, `Class.*`.'
      ]
    }
  }
];

export const ASSETS_DATABASE: AssetIntelligence[] = [
  {
    id: 'asset-8-8-8-8',
    ip: '8.8.8.8',
    domain: 'dns.google',
    hostname: 'dns.google',
    queryType: 'ip',
    country: 'United States',
    countryCode: 'US',
    city: 'Mountain View',
    region: 'California',
    latitude: 37.422,
    longitude: -122.084,
    asn: 'AS15169',
    asnName: 'GOOGLE, US',
    org: 'Google LLC',
    isp: 'Google LLC',
    riskScore: 6,
    severity: 'LOW',
    lastObserved: '2026-08-22T03:10:00Z',
    firstSeen: '2010-01-01T00:00:00Z',
    tags: ['Anycast DNS', 'Public Resolver', 'Verified Infrastructure', 'Tier 1 ASN'],
    cloudProvider: 'Google Cloud Platform',
    operatingSystem: 'Linux 5.x / Custom Google OS',
    openPorts: [
      {
        port: 53,
        protocol: 'udp',
        service: 'domain',
        state: 'open',
        product: 'Google Public DNS',
        banner: 'dns.google recursion enabled'
      },
      {
        port: 53,
        protocol: 'tcp',
        service: 'domain',
        state: 'open',
        product: 'Google Public DNS'
      },
      {
        port: 443,
        protocol: 'tcp',
        service: 'https',
        state: 'open',
        product: 'Google Frontend / DoH',
        version: 'HTTP/3 Quic',
        ssl: {
          enabled: true,
          subject: 'CN=dns.google',
          issuer: 'CN=GTS CA 1C3, O=Google Trust Services LLC, C=US',
          validTo: '2026-11-15',
          tlsVersion: 'TLSv1.3',
          cipher: 'TLS_AES_256_GCM_SHA384'
        }
      },
      {
        port: 853,
        protocol: 'tcp',
        service: 'domain-s',
        state: 'open',
        product: 'DNS over TLS (DoT)',
        ssl: {
          enabled: true,
          subject: 'CN=dns.google',
          issuer: 'Google Trust Services'
        }
      }
    ],
    technologies: [
      { name: 'Google Frontend (GFE)', category: 'Web Server', confidence: 99, cveCount: 0 },
      { name: 'DNS over HTTPS (DoH)', category: 'Security', confidence: 98, cveCount: 0 },
      { name: 'DNS over TLS (DoT)', category: 'Security', confidence: 98, cveCount: 0 },
      { name: 'HTTP/3 QUIC', category: 'Web Server', confidence: 95, cveCount: 0 }
    ],
    vulnerabilities: [],
    dnsRecords: [
      { type: 'A', name: 'dns.google', value: '8.8.8.8', ttl: 300 },
      { type: 'AAAA', name: 'dns.google', value: '2001:4860:4860::8888', ttl: 300 },
      { type: 'NS', name: 'dns.google', value: 'ns1.google.com', ttl: 86400 },
      { type: 'TXT', name: 'dns.google', value: 'v=spf1 -all', ttl: 3600 }
    ],
    subdomains: ['dns.google', 'dns64.dns.google', 'resolve.dns.google'],
    securityHeaders: [
      { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload', status: 'present', score: 'good' },
      { name: 'Content-Security-Policy', value: "default-src 'self'", status: 'present', score: 'good' },
      { name: 'X-Frame-Options', value: 'DENY', status: 'present', score: 'good' },
      { name: 'X-Content-Type-Options', value: 'nosniff', status: 'present', score: 'good' }
    ],
    httpInfo: {
      statusCode: 200,
      title: 'Google Public DNS',
      server: 'gfe',
      contentType: 'text/html; charset=UTF-8',
      responseLength: 4210
    },
    sslInfo: {
      subject: 'CN=dns.google',
      issuer: 'GTS CA 1C3',
      validFrom: '2026-01-01',
      validTo: '2026-11-15',
      daysRemaining: 85,
      fingerprintSha256: '9a3b8c7e6f5d4c3b2a1e0f9d8c7b6a5e4d3c2b1a0f9e8d7c6b5a4e3d2c1b0a9f',
      sanList: ['dns.google', '*.dns.google', '8.8.8.8', '8.8.4.4'],
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      isExpired: false,
      grade: 'A+'
    },
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: false,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: false,
      reputationScore: 99
    },
    historicalTimeline: [
      { timestamp: '2026-08-20T12:00:00Z', date: '2026-08-20', event: 'SSL Certificate Renewed', type: 'cert_renewal', detail: 'Valid until 2026-11-15 (GTS CA 1C3)' },
      { timestamp: '2026-05-14T08:30:00Z', date: '2026-05-14', event: 'HTTP/3 Support Verified', type: 'port_change', detail: 'QUIC protocol RFC 9000 verified on port 443' }
    ]
  },
  {
    id: 'asset-198-51-100-45',
    ip: '198.51.100.45',
    domain: 'edge-gateway.corp-enterprise-de.net',
    hostname: 'edge-gateway.corp-enterprise-de.net',
    queryType: 'ip',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Frankfurt am Main',
    region: 'Hesse',
    latitude: 50.1109,
    longitude: 8.6821,
    asn: 'AS3320',
    asnName: 'Deutsche Telekom AG',
    org: 'Enterprise Logistics Gateway GmbH',
    isp: 'Deutsche Telekom AG',
    riskScore: 94,
    severity: 'CRITICAL',
    lastObserved: '2026-08-22T02:45:00Z',
    firstSeen: '2023-04-11T10:20:00Z',
    tags: ['Exposed Management', 'Unauthenticated Database', 'Unpatched SSH', 'High Threat Probability'],
    operatingSystem: 'Ubuntu Linux 18.04.6 LTS (End-of-Life)',
    openPorts: [
      {
        port: 22,
        protocol: 'tcp',
        service: 'ssh',
        state: 'open',
        product: 'OpenSSH',
        version: '8.9p1 Ubuntu-3ubuntu0.6',
        banner: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6',
        cves: ['CVE-2024-6387']
      },
      {
        port: 80,
        protocol: 'tcp',
        service: 'http',
        state: 'open',
        product: 'Apache HTTP Server',
        version: '2.4.49',
        banner: 'Apache/2.4.49 (Unix) OpenSSL/1.1.1k',
        cves: ['CVE-2021-41773']
      },
      {
        port: 443,
        protocol: 'tcp',
        service: 'https',
        state: 'open',
        product: 'Apache HTTP Server',
        version: '2.4.49',
        ssl: {
          enabled: true,
          subject: 'CN=edge-gateway.corp-enterprise-de.net',
          issuer: "Let's Encrypt Authority X3 (Expired)",
          validTo: '2024-03-01',
          tlsVersion: 'TLSv1.1 (Deprecated)',
          cipher: 'TLS_RSA_WITH_AES_128_CBC_SHA'
        }
      },
      {
        port: 3306,
        protocol: 'tcp',
        service: 'mysql',
        state: 'open',
        product: 'MySQL Community Server',
        version: '5.7.34',
        banner: '5.7.34-log MySQL Community Server (GPL)'
      },
      {
        port: 6379,
        protocol: 'tcp',
        service: 'redis',
        state: 'open',
        product: 'Redis key-value store',
        version: '6.0.9',
        banner: '# Server redis_version:6.0.9 (NOAUTH configured)'
      }
    ],
    technologies: [
      { name: 'Apache HTTP Server', category: 'Web Server', version: '2.4.49', confidence: 99, cveCount: 1 },
      { name: 'OpenSSH', category: 'Security', version: '8.9p1', confidence: 99, cveCount: 1 },
      { name: 'Redis', category: 'Database', version: '6.0.9', confidence: 95, cveCount: 0 },
      { name: 'MySQL', category: 'Database', version: '5.7.34', confidence: 95, cveCount: 0 },
      { name: 'Ubuntu Linux', category: 'Operating System', version: '18.04 LTS', confidence: 90, cveCount: 0 }
    ],
    vulnerabilities: [
      VULNERABILITY_DATABASE[0], // CVE-2024-6387 (regreSSHion)
      VULNERABILITY_DATABASE[6], // CVE-2021-41773 (Apache Path Traversal)
    ],
    dnsRecords: [
      { type: 'A', name: 'edge-gateway.corp-enterprise-de.net', value: '198.51.100.45', ttl: 600 },
      { type: 'MX', name: 'edge-gateway.corp-enterprise-de.net', value: 'mail.corp-enterprise-de.net', ttl: 3600 }
    ],
    securityHeaders: [
      { name: 'Strict-Transport-Security', status: 'missing', score: 'critical', recommendation: 'HSTS header missing; vulnerable to SSL stripping.' },
      { name: 'Content-Security-Policy', status: 'missing', score: 'critical', recommendation: 'No CSP defined.' },
      { name: 'X-Frame-Options', status: 'missing', score: 'warning', recommendation: 'Clickjacking protection absent.' }
    ],
    sslInfo: {
      subject: 'CN=edge-gateway.corp-enterprise-de.net',
      issuer: "Let's Encrypt Authority X3",
      validFrom: '2023-12-01',
      validTo: '2024-03-01',
      daysRemaining: -890,
      fingerprintSha256: 'ff4a819c3b2e1d0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f',
      sanList: ['edge-gateway.corp-enterprise-de.net'],
      tlsVersion: 'TLSv1.1 (Insecure)',
      cipherSuite: 'TLS_RSA_WITH_AES_128_CBC_SHA',
      isExpired: true,
      grade: 'F'
    },
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: true,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: true,
      reputationScore: 18
    },
    historicalTimeline: [
      { timestamp: '2026-07-02T14:15:00Z', date: '2026-07-02', event: 'Critical Vulnerability Identified', type: 'cve_detected', detail: 'CVE-2024-6387 (regreSSHion) flagged on port 22' },
      { timestamp: '2024-03-02T00:00:00Z', date: '2024-03-02', event: 'SSL Certificate Expired', type: 'cert_renewal', detail: 'Certificate expired without automatic ACME renewal' },
      { timestamp: '2023-11-10T19:40:00Z', date: '2023-11-10', event: 'Exposed Database Detected', type: 'port_change', detail: 'Unauthenticated Redis service on port 6379' }
    ]
  },
  {
    id: 'asset-140-82-121-4',
    ip: '140.82.121.4',
    domain: 'github.com',
    hostname: 'lb-140-82-121-4-iad.github.com',
    queryType: 'domain',
    country: 'United States',
    countryCode: 'US',
    city: 'Seattle',
    region: 'Washington',
    latitude: 47.6062,
    longitude: -122.3321,
    asn: 'AS36459',
    asnName: 'GITHUB, US',
    org: 'GitHub, Inc.',
    isp: 'GitHub, Inc.',
    riskScore: 12,
    severity: 'LOW',
    lastObserved: '2026-08-22T03:00:00Z',
    firstSeen: '2012-05-01T00:00:00Z',
    tags: ['Developer Platform', 'Edge Proxy', 'Anycast Routing', 'Hardened Infrastructure'],
    cloudProvider: 'Microsoft Azure / GitHub AS36459',
    openPorts: [
      {
        port: 22,
        protocol: 'tcp',
        service: 'ssh',
        state: 'open',
        product: 'GitHub Custom SSH',
        banner: 'SSH-2.0-babeld-35759591'
      },
      {
        port: 80,
        protocol: 'tcp',
        service: 'http',
        state: 'open',
        product: 'GitHub Router',
        banner: 'HTTP/1.1 301 Moved Permanently'
      },
      {
        port: 443,
        protocol: 'tcp',
        service: 'https',
        state: 'open',
        product: 'GitHub Frontend Proxy',
        ssl: {
          enabled: true,
          subject: 'CN=github.com',
          issuer: 'CN=DigiCert Global G2 TLS RSA SHA256 2020 CA1',
          validTo: '2026-12-30',
          tlsVersion: 'TLSv1.3',
          cipher: 'TLS_AES_128_GCM_SHA256'
        }
      }
    ],
    technologies: [
      { name: 'Ruby on Rails', category: 'Framework', confidence: 95, cveCount: 0 },
      { name: 'React', category: 'Framework', confidence: 99, cveCount: 0 },
      { name: 'GitHub Babeld SSH Proxy', category: 'Security', confidence: 99, cveCount: 0 },
      { name: 'HAProxy', category: 'Web Server', confidence: 90, cveCount: 0 }
    ],
    vulnerabilities: [],
    dnsRecords: [
      { type: 'A', name: 'github.com', value: '140.82.121.4', ttl: 60 },
      { type: 'AAAA', name: 'github.com', value: '2606:50c0:8000::154', ttl: 60 },
      { type: 'MX', name: 'github.com', value: 'aspmx.l.google.com', ttl: 300 },
      { type: 'TXT', name: 'github.com', value: 'v=spf1 include:_spf.google.com ip4:192.30.252.0/22 ~all', ttl: 3600 }
    ],
    subdomains: ['api.github.com', 'raw.githubusercontent.com', 'gist.github.com', 'docs.github.com', 'status.github.com'],
    securityHeaders: [
      { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubdomains; preload', status: 'present', score: 'good' },
      { name: 'Content-Security-Policy', value: "default-src 'none'; base-uri 'self'", status: 'present', score: 'good' },
      { name: 'X-Frame-Options', value: 'deny', status: 'present', score: 'good' },
      { name: 'X-Content-Type-Options', value: 'nosniff', status: 'present', score: 'good' },
      { name: 'X-XSS-Protection', value: '0', status: 'present', score: 'good' }
    ],
    sslInfo: {
      subject: 'CN=github.com',
      issuer: 'DigiCert Global G2 TLS RSA SHA256 2020 CA1',
      validFrom: '2025-01-01',
      validTo: '2026-12-30',
      daysRemaining: 130,
      fingerprintSha256: '4b7a1e8c9d0f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      sanList: ['github.com', 'www.github.com'],
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_128_GCM_SHA256',
      isExpired: false,
      grade: 'A+'
    },
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: false,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: false,
      reputationScore: 98
    },
    historicalTimeline: [
      { timestamp: '2026-02-01T09:00:00Z', date: '2026-02-01', event: 'SSL Certificate Renewed', type: 'cert_renewal', detail: 'DigiCert High-Assurance SHA-256 certificate issued' },
      { timestamp: '2025-11-12T16:00:00Z', date: '2025-11-12', event: 'DNS Record TTL Adjusted', type: 'dns_update', detail: 'TTL set to 60s for Anycast Fast Failover' }
    ]
  },
  {
    id: 'asset-203-0-113-88',
    ip: '203.0.113.88',
    domain: 'ci-cluster.asia-devops.jp',
    hostname: 'k8s-master-01.asia-devops.jp',
    queryType: 'ip',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    region: 'Kanto',
    latitude: 35.6762,
    longitude: 139.6503,
    asn: 'AS2516',
    asnName: 'KDDI Corporation',
    org: 'Asia DevOps Cloud Labs',
    isp: 'KDDI Corporation',
    riskScore: 89,
    severity: 'HIGH',
    lastObserved: '2026-08-22T01:15:00Z',
    firstSeen: '2024-01-15T08:00:00Z',
    tags: ['Exposed K8s API', 'Vulnerable CI/CD', 'Unauthenticated Metrics', 'Docker Daemon'],
    operatingSystem: 'Red Hat Enterprise Linux 8.8',
    openPorts: [
      {
        port: 8080,
        protocol: 'tcp',
        service: 'http-proxy',
        state: 'open',
        product: 'Jenkins Controller',
        version: '2.441',
        banner: 'Jenkins/2.441 Jetty/10.0.18',
        cves: ['CVE-2024-23897']
      },
      {
        port: 6443,
        protocol: 'tcp',
        service: 'ssl/k8s-api',
        state: 'open',
        product: 'Kubernetes API Server',
        version: 'v1.27.3',
        ssl: {
          enabled: true,
          subject: 'CN=kube-apiserver',
          issuer: 'CN=kubernetes-ca',
          validTo: '2027-01-01',
          tlsVersion: 'TLSv1.3'
        }
      },
      {
        port: 10250,
        protocol: 'tcp',
        service: 'ssl/kubelet',
        state: 'open',
        product: 'Kubelet daemon (Anonymous Auth enabled)',
        version: 'v1.27.3'
      },
      {
        port: 9200,
        protocol: 'tcp',
        service: 'elasticsearch',
        state: 'open',
        product: 'Elasticsearch cluster',
        version: '7.17.5',
        banner: '{"name":"node-1","cluster_name":"devops-k8s-logs","version":{"number":"7.17.5"}}'
      }
    ],
    technologies: [
      { name: 'Jenkins', category: 'Framework', version: '2.441', confidence: 99, cveCount: 1 },
      { name: 'Kubernetes', category: 'Container', version: '1.27.3', confidence: 98, cveCount: 0 },
      { name: 'Docker', category: 'Container', confidence: 95, cveCount: 0 },
      { name: 'Elasticsearch', category: 'Database', version: '7.17.5', confidence: 98, cveCount: 0 },
      { name: 'Java OpenJDK', category: 'Framework', version: '17.0.9', confidence: 92, cveCount: 0 }
    ],
    vulnerabilities: [
      VULNERABILITY_DATABASE[3] // CVE-2024-23897 (Jenkins arbitrary file read)
    ],
    dnsRecords: [
      { type: 'A', name: 'ci-cluster.asia-devops.jp', value: '203.0.113.88', ttl: 300 }
    ],
    securityHeaders: [
      { name: 'X-Jenkins', value: '2.441', status: 'present', score: 'warning', recommendation: 'Banner leakage reveals exact Jenkins version.' },
      { name: 'Strict-Transport-Security', status: 'missing', score: 'critical', recommendation: 'HSTS missing on port 8080.' }
    ],
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: false,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: false,
      reputationScore: 35
    },
    historicalTimeline: [
      { timestamp: '2026-07-15T11:00:00Z', date: '2026-07-15', event: 'Vulnerability CVE-2024-23897 Flagged', type: 'cve_detected', detail: 'Jenkins CLI file read vulnerability active' },
      { timestamp: '2026-04-10T14:22:00Z', date: '2026-04-10', event: 'Exposed Kubelet Detected', type: 'port_change', detail: 'Anonymous read enabled on port 10250' }
    ]
  },
  {
    id: 'asset-185-220-101-5',
    ip: '185.220.101.5',
    hostname: 'tor-exit-node-ams02.nos-oep.nl',
    queryType: 'ip',
    country: 'Netherlands',
    countryCode: 'NL',
    city: 'Amsterdam',
    region: 'North Holland',
    latitude: 52.3676,
    longitude: 4.9041,
    asn: 'AS200052',
    asnName: 'Zwiebelfreunde e.V.',
    org: 'Tor Privacy Relay Organization',
    isp: 'Novogara Europe B.V.',
    riskScore: 78,
    severity: 'HIGH',
    lastObserved: '2026-08-22T03:05:00Z',
    firstSeen: '2021-08-01T00:00:00Z',
    tags: ['Verified Tor Exit Node', 'Anonymization Proxy', 'High Traffic Relay'],
    openPorts: [
      {
        port: 9001,
        protocol: 'tcp',
        service: 'tor-orport',
        state: 'open',
        product: 'Tor Onion Router',
        version: '0.4.8.10',
        banner: 'Tor ORPort v0.4.8.10'
      },
      {
        port: 80,
        protocol: 'tcp',
        service: 'http',
        state: 'open',
        product: 'nginx',
        banner: 'This is a Tor Exit Node operator notice.'
      }
    ],
    technologies: [
      { name: 'Tor Router', category: 'Security', version: '0.4.8.10', confidence: 99, cveCount: 0 },
      { name: 'Nginx', category: 'Web Server', confidence: 90, cveCount: 0 },
      { name: 'Debian Linux', category: 'Operating System', confidence: 85, cveCount: 0 }
    ],
    vulnerabilities: [],
    threatIndicators: {
      isTorExitNode: true,
      isVpn: false,
      isProxy: true,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: true,
      reputationScore: 25
    },
    historicalTimeline: [
      { timestamp: '2026-08-01T00:00:00Z', date: '2026-08-01', event: 'Exit Policy Re-validated', type: 'risk_change', detail: 'Confirmed Tor Project Exit Relay registry listing' }
    ]
  },
  {
    id: 'asset-13-233-150-92',
    ip: '13.233.150.92',
    domain: 'fintech-payments.in-cloudservices.com',
    hostname: 'ec2-13-233-150-92.ap-south-1.compute.amazonaws.com',
    queryType: 'ip',
    country: 'India',
    countryCode: 'IN',
    city: 'Mumbai',
    region: 'Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
    asn: 'AS16509',
    asnName: 'AMAZON-02, US',
    org: 'Amazon Data Services India',
    isp: 'Amazon.com, Inc.',
    riskScore: 82,
    severity: 'HIGH',
    lastObserved: '2026-08-22T02:50:00Z',
    firstSeen: '2024-03-10T12:00:00Z',
    tags: ['Cloud Hosted AWS', 'Vulnerable Spring Framework', 'Financial Portal API'],
    cloudProvider: 'Amazon Web Services (AWS ap-south-1)',
    operatingSystem: 'Amazon Linux 2',
    openPorts: [
      {
        port: 80,
        protocol: 'tcp',
        service: 'http',
        state: 'open',
        product: 'Nginx',
        version: '1.18.0'
      },
      {
        port: 443,
        protocol: 'tcp',
        service: 'https',
        state: 'open',
        product: 'Nginx reverse proxy',
        version: '1.18.0',
        ssl: {
          enabled: true,
          subject: 'CN=fintech-payments.in-cloudservices.com',
          issuer: 'Amazon RSA 2048 M02',
          validTo: '2026-09-30',
          tlsVersion: 'TLSv1.2'
        }
      },
      {
        port: 8080,
        protocol: 'tcp',
        service: 'http-alt',
        state: 'open',
        product: 'Apache Tomcat / Spring Framework',
        version: 'Spring 5.3.15 (Spring4Shell vulnerable)',
        cves: ['CVE-2022-22965']
      }
    ],
    technologies: [
      { name: 'Spring Boot', category: 'Framework', version: '2.5.4 (Spring 5.3.15)', confidence: 98, cveCount: 1 },
      { name: 'Nginx', category: 'Web Server', version: '1.18.0', confidence: 95, cveCount: 0 },
      { name: 'Apache Tomcat', category: 'Web Server', version: '9.0.52', confidence: 90, cveCount: 0 },
      { name: 'AWS CloudFront', category: 'Cloud', confidence: 85, cveCount: 0 }
    ],
    vulnerabilities: [
      VULNERABILITY_DATABASE[7] // CVE-2022-22965 (Spring4Shell)
    ],
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: false,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: false,
      reputationScore: 40
    },
    historicalTimeline: [
      { timestamp: '2026-06-12T08:00:00Z', date: '2026-06-12', event: 'Spring Framework CVE Detected', type: 'cve_detected', detail: 'Spring4Shell vulnerable component identified on port 8080' }
    ]
  },
  {
    id: 'asset-52-172-200-41',
    ip: '52.172.200.41',
    domain: 'portal.southern-health-net.org',
    hostname: 'portal.southern-health-net.org',
    queryType: 'domain',
    country: 'India',
    countryCode: 'IN',
    city: 'Chennai',
    region: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    asn: 'AS8075',
    asnName: 'MICROSOFT-CORP-MSN-AS-BLOCK',
    org: 'Microsoft Corporation',
    isp: 'Microsoft Azure',
    riskScore: 74,
    severity: 'HIGH',
    lastObserved: '2026-08-22T02:00:00Z',
    firstSeen: '2023-09-01T00:00:00Z',
    tags: ['Healthcare Portal', 'Exposed RDP', 'Microsoft IIS 10.0'],
    cloudProvider: 'Microsoft Azure (Central India)',
    operatingSystem: 'Windows Server 2019 Datacenter',
    openPorts: [
      {
        port: 80,
        protocol: 'tcp',
        service: 'http',
        state: 'open',
        product: 'Microsoft IIS httpd',
        version: '10.0'
      },
      {
        port: 443,
        protocol: 'tcp',
        service: 'https',
        state: 'open',
        product: 'Microsoft IIS httpd',
        version: '10.0',
        ssl: {
          enabled: true,
          subject: 'CN=portal.southern-health-net.org',
          issuer: 'Microsoft RSA TLS CA 01',
          validTo: '2026-10-15',
          tlsVersion: 'TLSv1.2'
        }
      },
      {
        port: 3389,
        protocol: 'tcp',
        service: 'ms-wbt-server',
        state: 'open',
        product: 'Microsoft Terminal Services / RDP',
        banner: 'CredSSP NLA enabled'
      }
    ],
    technologies: [
      { name: 'Microsoft IIS', category: 'Web Server', version: '10.0', confidence: 99, cveCount: 0 },
      { name: 'ASP.NET', category: 'Framework', version: '4.8', confidence: 95, cveCount: 0 },
      { name: 'Windows Server', category: 'Operating System', version: '2019', confidence: 95, cveCount: 0 }
    ],
    vulnerabilities: [],
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: false,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: false,
      reputationScore: 55
    },
    historicalTimeline: [
      { timestamp: '2026-05-18T10:00:00Z', date: '2026-05-18', event: 'Port 3389 RDP Detected', type: 'port_change', detail: 'Remote Desktop Protocol listening directly on public IP' }
    ]
  },
  {
    id: 'asset-192-0-2-140',
    ip: '192.0.2.140',
    hostname: 'scada-plc-station04.alpine-power-ch.net',
    queryType: 'ip',
    country: 'Switzerland',
    countryCode: 'CH',
    city: 'Zurich',
    region: 'Zurich',
    latitude: 47.3769,
    longitude: 8.5417,
    asn: 'AS6830',
    asnName: 'Liberty Global B.V.',
    org: 'Alpine Power Grid Utility',
    isp: 'Sunrise UPC GmbH',
    riskScore: 96,
    severity: 'CRITICAL',
    lastObserved: '2026-08-22T01:00:00Z',
    firstSeen: '2022-11-04T00:00:00Z',
    tags: ['Critical Infrastructure', 'Exposed SCADA / ICS', 'Modbus TCP', 'Siemens S7'],
    operatingSystem: 'Siemens Embedded RTOS',
    openPorts: [
      {
        port: 102,
        protocol: 'tcp',
        service: 'iso-tsap',
        state: 'open',
        product: 'Siemens SIMATIC S7-1500 PLC',
        banner: 'System ID: S7-1516-3 PN/DP Module: 6ES7 516-3AN02-0AB0 FW: V2.8.3'
      },
      {
        port: 502,
        protocol: 'tcp',
        service: 'modbus',
        state: 'open',
        product: 'Modbus TCP Industrial Controller',
        banner: 'Modbus Unit ID: 1, Function codes 01, 03, 05, 16 enabled'
      },
      {
        port: 80,
        protocol: 'tcp',
        service: 'http',
        state: 'open',
        product: 'Siemens Embedded Web Server',
        banner: 'SIMATIC S7 Web Server (Default admin prompt)'
      }
    ],
    technologies: [
      { name: 'Siemens SIMATIC S7', category: 'Security', version: 'S7-1500', confidence: 99, cveCount: 0 },
      { name: 'Modbus Protocol', category: 'Security', confidence: 99, cveCount: 0 },
      { name: 'Embedded Webserver', category: 'Web Server', confidence: 90, cveCount: 0 }
    ],
    vulnerabilities: [],
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: false,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: false,
      reputationScore: 12
    },
    historicalTimeline: [
      { timestamp: '2026-08-10T04:12:00Z', date: '2026-08-10', event: 'Critical Industrial Protocol Exposed', type: 'risk_change', detail: 'Direct exposure of ISO-TSAP 102 & Modbus 502 without VPN encapsulation' }
    ]
  },
  {
    id: 'asset-1-1-1-1',
    ip: '1.1.1.1',
    domain: 'one.one.one.one',
    hostname: 'one.one.one.one',
    queryType: 'ip',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    region: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
    asn: 'AS13335',
    asnName: 'CLOUDFLARENET, US',
    org: 'Cloudflare, Inc.',
    isp: 'Cloudflare, Inc.',
    riskScore: 7,
    severity: 'LOW',
    lastObserved: '2026-08-22T03:15:00Z',
    firstSeen: '2018-04-01T00:00:00Z',
    tags: ['Anycast Resolver', 'Cloudflare Edge', 'DNS over HTTPS', 'DNSSEC Validated'],
    cloudProvider: 'Cloudflare Edge Network',
    openPorts: [
      {
        port: 53,
        protocol: 'udp',
        service: 'domain',
        state: 'open',
        product: 'Cloudflare 1.1.1.1 Resolver'
      },
      {
        port: 443,
        protocol: 'tcp',
        service: 'https',
        state: 'open',
        product: 'Cloudflare Warp / DoH Gateway',
        ssl: {
          enabled: true,
          subject: 'CN=cloudflare-dns.com',
          issuer: 'CN=Cloudflare Inc ECC CA-3',
          validTo: '2026-12-31',
          tlsVersion: 'TLSv1.3',
          cipher: 'TLS_AES_256_GCM_SHA384'
        }
      },
      {
        port: 853,
        protocol: 'tcp',
        service: 'domain-s',
        state: 'open',
        product: 'DNS over TLS'
      }
    ],
    technologies: [
      { name: 'Cloudflare Edge', category: 'Cloud', confidence: 100, cveCount: 0 },
      { name: 'HTTP/3 QUIC', category: 'Web Server', confidence: 98, cveCount: 0 },
      { name: 'Rust Core DNS', category: 'Framework', confidence: 90, cveCount: 0 }
    ],
    vulnerabilities: [],
    dnsRecords: [
      { type: 'A', name: 'one.one.one.one', value: '1.1.1.1', ttl: 300 },
      { type: 'AAAA', name: 'one.one.one.one', value: '2606:4700:4700::1111', ttl: 300 }
    ],
    securityHeaders: [
      { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload', status: 'present', score: 'good' },
      { name: 'X-Content-Type-Options', value: 'nosniff', status: 'present', score: 'good' }
    ],
    threatIndicators: {
      isTorExitNode: false,
      isVpn: false,
      isProxy: false,
      isKnownHoneypot: false,
      isBotnetC2: false,
      isSpamSource: false,
      reputationScore: 99
    },
    historicalTimeline: [
      { timestamp: '2026-03-20T10:00:00Z', date: '2026-03-20', event: 'TLS 1.3 Post-Quantum Hybrid Cryptography Verified', type: 'risk_change', detail: 'Kyber / X25519 hybrid key exchange verified' }
    ]
  }
];

export const GLOBAL_TELEMETRY: GlobalTelemetryStats = {
  totalAssets: 489204128,
  activeHosts: 312840920,
  openServices: 1420958120,
  knownVulnerabilities: 248910,
  highRiskAssets: 14820190,
  trackedTechnologies: 4820,
  countriesMonitored: 242,
  asnsMonitored: 74210,
  riskDistribution: [
    { level: 'CRITICAL', count: 3290140, percentage: 8.2 },
    { level: 'HIGH', count: 11530050, percentage: 18.6 },
    { level: 'MEDIUM', count: 38400120, percentage: 34.4 },
    { level: 'LOW', count: 48920100, percentage: 38.8 }
  ],
  topTechnologies: [
    { name: 'Nginx', category: 'Web Server', count: 142800900 },
    { name: 'Apache HTTP Server', category: 'Web Server', count: 98400200 },
    { name: 'OpenSSH', category: 'Security', count: 86200100 },
    { name: 'Cloudflare', category: 'Cloud', count: 74500900 },
    { name: 'Docker / Containerd', category: 'Container', count: 34200100 },
    { name: 'WordPress', category: 'CMS', count: 31900400 },
    { name: 'MySQL / MariaDB', category: 'Database', count: 28400900 },
    { name: 'Redis', category: 'Database', count: 14200800 },
    { name: 'Kubernetes', category: 'Container', count: 9800400 },
    { name: 'Elasticsearch', category: 'Database', count: 6200300 }
  ],
  topPorts: [
    { port: 443, service: 'HTTPS', count: 298400900 },
    { port: 80, service: 'HTTP', count: 245100400 },
    { port: 22, service: 'SSH', count: 98200100 },
    { port: 53, service: 'DNS', count: 64100200 },
    { port: 8080, service: 'HTTP-Alt', count: 48200900 },
    { port: 8443, service: 'HTTPS-Alt', count: 32100800 },
    { port: 3306, service: 'MySQL', count: 22900400 },
    { port: 3389, service: 'RDP', count: 18400200 },
    { port: 5432, service: 'PostgreSQL', count: 12100900 },
    { port: 6379, service: 'Redis', count: 9400200 },
    { port: 9200, service: 'Elasticsearch', count: 4800100 }
  ],
  topCountries: [
    { code: 'US', name: 'United States', count: 142800900 },
    { code: 'CN', name: 'China', count: 68400100 },
    { code: 'DE', name: 'Germany', count: 38200400 },
    { code: 'IN', name: 'India', count: 29400100 },
    { code: 'GB', name: 'United Kingdom', count: 24800900 },
    { code: 'JP', name: 'Japan', count: 22100400 },
    { code: 'FR', name: 'France', count: 19800200 },
    { code: 'NL', name: 'Netherlands', count: 17400900 },
    { code: 'BR', name: 'Brazil', count: 14200800 },
    { code: 'SG', name: 'Singapore', count: 11900400 }
  ],
  recentIncidents: [
    { id: 'inc-1', title: 'Surge in OpenSSH 8.x/9.x probing attempts matching CVE-2024-6387', severity: 'HIGH', timeAgo: '14 mins ago' },
    { id: 'inc-2', title: 'Exploit campaign targeting Fortinet SSL-VPN (CVE-2024-21762) active', severity: 'CRITICAL', timeAgo: '38 mins ago' },
    { id: 'inc-3', title: '3,400+ newly unauthenticated Redis instances detected on public IPv4', severity: 'HIGH', timeAgo: '1 hour ago' },
    { id: 'inc-4', title: 'Mass scanning against exposed Kubernetes Kubelet endpoints (port 10250)', severity: 'MEDIUM', timeAgo: '2 hours ago' }
  ]
};
