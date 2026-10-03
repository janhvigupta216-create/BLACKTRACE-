import { GoogleGenAI, Type } from '@google/genai';
import { 
  AIAnalysisRequest, 
  AIAnalysisResponse, 
  AIExplanationItem, 
  AIExplainItemRequest,
  AIAssetSummaryExplanation 
} from '../src/types';
import { generateLocalAIExplanation } from '../src/utils/aiSecurityExplainer';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

export async function explainItemWithGemini(req: AIExplainItemRequest): Promise<AIExplanationItem | null> {
  const ai = getGenAI();
  if (!ai) return null;

  try {
    const prompt = `Analyze this technical cybersecurity item in context of perimeter asset defense.
Category: ${req.category}
Identifier: ${req.identifier}
Data: ${JSON.stringify(req.itemData || {})}
Host Context: ${JSON.stringify(req.assetContext || {})}

Return a structured JSON object answering the user's questions in clear, accessible cybersecurity language:
- whatIsIt: Simple explanation of what this item is.
- whatItMeans: What the scan output indicates.
- whyItMatters: Why this is important for external security.
- howUseful: How defensive security teams can use this information.
- securityRisk: Realistic security impact (distinguish "Service detected" vs "Vulnerability confirmed"; do not claim open ports are automatic vulnerabilities).
- recommendedAction: Concrete defensive remediation or verification step.
- confidence: Exactly one of "Observed", "Inferred", "Potential", or "Confirmed".
- evidence: Specific data source or banner indicator.
- priority: "Critical" | "High" | "Medium" | "Low" | "Informational"
- priorityReasoning: Why this priority is assigned.
- nextSteps: Array of objects { priority: 'High' | 'Medium' | 'Low', action: string, why: string }
- suggestedQuestions: Array of 3 short questions the user could ask next.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are BLACKTRACE AI, a defensive cybersecurity intelligence assistant.
Explain complex network security concepts clearly and objectively.
Strict Rules:
1. Purely defensive focus (never provide exploit payloads or attack steps).
2. Clearly distinguish between "Observed", "Inferred", "Potential", and "Confirmed".
3. Do NOT claim that an open port or missing header is a confirmed vulnerability unless specific CVE evidence exists.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            whatIsIt: { type: Type.STRING },
            whatItMeans: { type: Type.STRING },
            whyItMatters: { type: Type.STRING },
            howUseful: { type: Type.STRING },
            securityRisk: { type: Type.STRING },
            recommendedAction: { type: Type.STRING },
            confidence: { type: Type.STRING },
            evidence: { type: Type.STRING },
            priority: { type: Type.STRING },
            priorityReasoning: { type: Type.STRING },
            nextSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING },
                  action: { type: Type.STRING },
                  why: { type: Type.STRING }
                },
                required: ['priority', 'action']
              }
            },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['whatIsIt', 'whatItMeans', 'whyItMatters', 'howUseful', 'securityRisk', 'recommendedAction', 'confidence', 'evidence']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      title: parsed.title || `${req.category.toUpperCase()}: ${req.identifier}`,
      category: req.category,
      whatIsIt: parsed.whatIsIt,
      whatItMeans: parsed.whatItMeans,
      whyItMatters: parsed.whyItMatters,
      howUseful: parsed.howUseful,
      securityRisk: parsed.securityRisk,
      recommendedAction: parsed.recommendedAction,
      confidence: (parsed.confidence as any) || 'Observed',
      evidence: parsed.evidence,
      priority: (parsed.priority as any) || 'Low',
      priorityReasoning: parsed.priorityReasoning,
      nextSteps: parsed.nextSteps || [],
      suggestedQuestions: parsed.suggestedQuestions || []
    };
  } catch (err) {
    console.warn('Gemini Item Explanation failed, using local generator:', err);
    return null;
  }
}

export async function analyzeWithGemini(req: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  const { question, assetData, contextType, itemExplanationRequest } = req;
  const ai = getGenAI();

  if (itemExplanationRequest) {
    const itemExpl = (await explainItemWithGemini(itemExplanationRequest)) || 
      generateLocalAIExplanation(
        itemExplanationRequest.category,
        itemExplanationRequest.identifier,
        itemExplanationRequest.itemData,
        itemExplanationRequest.assetContext
      );

    return {
      answer: `### ${itemExpl.title}\n\n**What is this?**\n${itemExpl.whatIsIt}\n\n**What does it mean?**\n${itemExpl.whatItMeans}\n\n**Why does it matter?**\n${itemExpl.whyItMatters}\n\n**How can it be useful?**\n${itemExpl.howUseful}\n\n**Security Relevance:**\n${itemExpl.securityRisk}\n\n**Recommended Action:**\n${itemExpl.recommendedAction}`,
      contextType: 'item_explanation',
      timestamp: new Date().toISOString(),
      structuredExplanation: itemExpl,
      findings: [{
        type: itemExpl.confidence === 'Confirmed' ? 'Confirmed Vulnerability' : itemExpl.confidence === 'Inferred' ? 'AI Inference' : itemExpl.confidence === 'Potential' ? 'Potential Risk' : 'Observed Data',
        text: itemExpl.whatItMeans
      }],
      recommendedActions: [itemExpl.recommendedAction]
    };
  }

  const systemInstruction = `You are BLACKTRACE AI, an elite defensive cybersecurity threat intelligence analyst.
Your job is to analyze Internet asset intelligence, open ports, exposed services, SSL/TLS configurations, DNS records, and CVE vulnerabilities.

CRITICAL RULES:
1. Explain technical cybersecurity findings in clear, simple, and actionable language.
2. NEVER fabricate scan results or claim exploitation unless the data directly confirms it.
3. Clearly distinguish between:
   - "Observed Data": Verified factual telemetry (ports, banners, certificates, ASN).
   - "AI Inference": Probabilistic deduction based on tech stack or configuration.
   - "Confirmed Vulnerability": Directly matched CVEs or documented flaws.
   - "Potential Risk": Configuration weaknesses that could lead to exploitation.
4. Distinguish "Service detected" from "Vulnerability confirmed".
5. Provide prioritized, practical defensive remediation steps.
6. Purely defensive focus: no exploit code, weaponization guides, or malware instructions.`;

  const assetContext = assetData ? `
TARGET ASSET INTELLIGENCE:
- Target: ${assetData.ip || 'N/A'} (Domain: ${assetData.domain || 'N/A'}, Hostname: ${assetData.hostname || 'N/A'})
- Organization: ${assetData.org || 'N/A'} (${assetData.asn || 'N/A'})
- Location: ${assetData.city || 'N/A'}, ${assetData.country || 'N/A'}
- Risk Score: ${assetData.riskScore ?? 'N/A'}/100 (Severity: ${assetData.severity || 'N/A'})
- Open Ports: ${assetData.openPorts ? assetData.openPorts.map(p => `${p.port}/${p.protocol} (${p.service} - ${p.product || 'Unknown'} ${p.version || ''})`).join(', ') : 'None'}
- Technologies: ${assetData.technologies ? assetData.technologies.map(t => `${t.name} (${t.version || 'v?'})`).join(', ') : 'None'}
- Vulnerabilities: ${assetData.vulnerabilities && assetData.vulnerabilities.length > 0 ? assetData.vulnerabilities.map(v => `${v.cveId} (CVSS ${v.cvss}, ${v.severity}): ${v.title}`).join(' | ') : 'No known CVEs identified'}
- SSL Status: ${assetData.sslInfo ? `Issuer: ${assetData.sslInfo.issuer}, TLS: ${assetData.sslInfo.tlsVersion}, Grade: ${assetData.sslInfo.grade}, Expired: ${assetData.sslInfo.isExpired}` : 'N/A'}
- Threat Indicators: ${assetData.threatIndicators ? `Tor: ${assetData.threatIndicators.isTorExitNode}, VPN: ${assetData.threatIndicators.isVpn}, Proxy: ${assetData.threatIndicators.isProxy}, Spam: ${assetData.threatIndicators.isSpamSource}` : 'N/A'}
` : 'No specific asset loaded in context.';

  if (ai) {
    try {
      const prompt = `Context: ${contextType}\n\n${assetContext}\n\nUser Question: ${question}\n\nPlease provide a clear, structured analysis answering what this is, what it means, why it matters, how security teams can use it, and what prioritized actions should be taken next.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });

      const text = response.text || 'Analysis completed.';

      const findings = extractFindingsFromText(text, assetData);
      const recommendedActions = extractActionsFromText(text, assetData);

      return {
        answer: text,
        contextType,
        timestamp: new Date().toISOString(),
        findings,
        recommendedActions
      };
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to heuristic engine:', err.message);
    }
  }

  // Fallback intelligent heuristic response
  return generateHeuristicAnalysis(req);
}

function extractFindingsFromText(text: string, assetData?: any) {
  const findings: AIAnalysisResponse['findings'] = [];
  
  if (assetData?.openPorts?.length) {
    findings.push({
      type: 'Observed Data',
      text: `Observed ${assetData.openPorts.length} open Internet-facing service ports (${assetData.openPorts.map((p: any) => p.port).join(', ')}).`
    });
  }

  if (assetData?.vulnerabilities?.length) {
    assetData.vulnerabilities.forEach((v: any) => {
      findings.push({
        type: 'Confirmed Vulnerability',
        text: `${v.cveId} (${v.severity} - CVSS ${v.cvss}): ${v.title}`
      });
    });
  }

  if (assetData?.sslInfo?.isExpired) {
    findings.push({
      type: 'Potential Risk',
      text: `SSL/TLS Certificate is expired (${assetData.sslInfo.issuer}), causing security warnings and trust failure.`
    });
  }

  if (assetData?.riskScore > 70) {
    findings.push({
      type: 'AI Inference',
      text: `Calculated attack surface posture presents elevated exposure requiring prioritized defensive review.`
    });
  }

  return findings;
}

function extractActionsFromText(text: string, assetData?: any): string[] {
  const actions: string[] = [];
  if (assetData?.vulnerabilities?.length) {
    actions.push(`Priority 1 — High: Review and patch software affected by ${assetData.vulnerabilities.map((v: any) => v.cveId).join(', ')}.`);
  }
  if (assetData?.openPorts?.some((p: any) => [22, 3389, 6379, 10250, 9200].includes(p.port))) {
    actions.push('Priority 2 — Medium: Restrict administrative and database ports behind VPN or firewall access controls.');
  }
  if (assetData?.securityHeaders?.some((h: any) => h.status === 'missing')) {
    actions.push('Priority 3 — Low: Enforce Strict-Transport-Security (HSTS) and Content-Security-Policy (CSP) headers.');
  }
  if (actions.length === 0) {
    actions.push('Priority 1 — Low: Maintain continuous attack surface monitoring for perimeter configuration drift.');
    actions.push('Priority 2 — Low: Audit automated vulnerability scanner coverage across external network prefixes.');
  }
  return actions;
}

function generateHeuristicAnalysis(req: AIAnalysisRequest): AIAnalysisResponse {
  const { question, assetData, contextType } = req;
  const q = question.toLowerCase();

  let answer = '';
  const findings: AIAnalysisResponse['findings'] = [];
  const recommendedActions: string[] = [];

  if (assetData) {
    const isHighRisk = (assetData.riskScore || 0) >= 70;
    const vulnCount = assetData.vulnerabilities?.length || 0;
    const portCount = assetData.openPorts?.length || 0;

    findings.push({
      type: 'Observed Data',
      text: `Host ${assetData.ip} is operated by ${assetData.org} (${assetData.asn}) in ${assetData.city}, ${assetData.country} with ${portCount} open service ports.`
    });

    if (vulnCount > 0 && assetData.vulnerabilities) {
      assetData.vulnerabilities.forEach((v: any) => {
        findings.push({
          type: 'Confirmed Vulnerability',
          text: `${v.cveId} (CVSS ${v.cvss}): ${v.title}`
        });
      });
    }

    if (q.includes('vulnerabilit') || q.includes('priorit') || contextType === 'vulnerability_triage') {
      answer = `### AI Security Analysis: Vulnerability Triage for ${assetData.hostname || assetData.ip}\n\n` +
        `**What is this?**\n` +
        `We identified **${vulnCount} active vulnerabilities** associated with running services on this host.\n\n` +
        `**What does this mean?**\n` +
        `The detected software versions expose known security flaws documented in public CVE databases.\n\n` +
        `**Why does it matter?**\n` +
        `Unpatched vulnerabilities in Internet-facing applications can allow threat actors to perform unauthorized actions or compromise system availability.\n\n` +
        `**How security teams can use this:**\n` +
        `- Prioritize emergency patch deployments according to CVSS and CISA KEV status.\n` +
        `- Deploy temporary Web Application Firewall (WAF) mitigation rules.\n` +
        `- Audit server access logs for indicators of compromise.\n\n` +
        `**Detailed CVE Breakdown:**\n\n` +
        (vulnCount > 0 && assetData.vulnerabilities
          ? assetData.vulnerabilities.map((v: any, i: number) => 
              `**Priority ${i + 1}: ${v.cveId} (${v.severity} — CVSS ${v.cvss})**\n` +
              `- **Product:** ${v.affectedProduct}\n` +
              `- **Exploit Status:** ${v.exploitAvailable ? `⚠️ Exploit Available (${v.exploitType})` : 'No known public weaponized exploit'}\n` +
              `- **CISA KEV:** ${v.inCisaKev ? '🚨 Cataloged in CISA Known Exploited Vulnerabilities' : 'Not in CISA KEV'}\n` +
              `- **Remediation:** ${v.remediation?.summary || 'Upgrade to latest release.'}\n`
            ).join('\n\n')
          : `✅ **No known public CVEs** detected in active service banners. Maintain routine vulnerability assessment schedule.`);
      
      recommendedActions.push('Priority 1 — High: Patch highest CVSS / KEV-listed vulnerabilities within the next maintenance window.');
      recommendedActions.push('Priority 2 — Medium: Validate that affected network ports are not exposed to the public Internet without authentication.');
    } else if (q.includes('remediat') || contextType === 'remediation_plan') {
      answer = `### AI Recommended Next Steps for ${assetData.hostname || assetData.ip}\n\n` +
        `**Priority 1 — High (Vulnerability Remediation):**\n` +
        `Update affected software components (${assetData.technologies?.map((t: any) => t.name).join(', ') || 'N/A'}) to vendor-supported secure releases.\n\n` +
        `**Priority 2 — Medium (Perimeter Hardening):**\n` +
        `Limit exposed attack surface. Restrict administrative services (SSH, RDP, databases) behind a private VPN or IP whitelist.\n\n` +
        `**Priority 3 — Low (Cryptographic & Header Hardening):**\n` +
        `Enforce modern TLS 1.3 encryption and deploy HSTS and Content-Security-Policy headers.`;
      
      recommendedActions.push('Audit firewall ingress policies.');
      recommendedActions.push('Rotate potentially exposed credentials or session tokens.');
    } else {
      answer = `### AI Security Analysis for ${assetData.hostname || assetData.ip}\n\n` +
        `**What is this?**\n` +
        `This asset is an Internet-facing server (${assetData.ip}${assetData.domain ? ` / ${assetData.domain}` : ''}) operated by **${assetData.org}** (${assetData.asn}) in **${assetData.country}**.\n\n` +
        `**What does the result mean?**\n` +
        `The scan identified ${portCount} publicly reachable service port(s), ${assetData.technologies?.length || 0} technology stack component(s), and ${vulnCount} recorded vulnerability flag(s).\n\n` +
        `**Why does it matter?**\n` +
        `Publicly exposed services increase the organization's attack surface and require ongoing monitoring, secure configuration, and patch maintenance.\n\n` +
        `**How is this useful for security teams?**\n` +
        `- Maintain continuous attack surface visibility.\n` +
        `- Identify unneeded or obsolete exposed services.\n` +
        `- Prioritize remediation based on real-world exploit availability.\n\n` +
        `**Recommended Next Steps:**\n` +
        `1. Verify that each exposed port (${assetData.openPorts?.map((p: any) => p.port).join(', ') || 'None'}) is required.\n` +
        `2. Check detected software versions against current vendor releases.\n` +
        `3. Address confirmed vulnerabilities in priority order.\n` +
        `4. Review SSL/TLS certificate validity and security header configuration.`;

      recommendedActions.push('Review open administrative listening ports.');
      recommendedActions.push('Monitor asset for configuration drift.');
    }
  } else {
    answer = `BLACKTRACE Cyber AI Engine standing by. Please query an asset, domain, CVE, or IP to generate targeted threat analysis and remediation playbooks.`;
    recommendedActions.push('Submit an IP, domain, or CVE query in the search console.');
  }

  return {
    answer,
    contextType,
    timestamp: new Date().toISOString(),
    findings,
    recommendedActions
  };
}
