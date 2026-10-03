<div align="center">⚫ BLACKTRACE

live: https://blacktrace.ai.studio

AI-Powered Cyber Threat Intelligence & Internet Asset Search Platform

<p>
  <strong>Search. Discover. Understand the Internet.</strong>
</p><p>
  <img src="https://img.shields.io/badge/AI-Powered-000000?style=for-the-badge&logo=openai&logoColor=white">
  <img src="https://img.shields.io/badge/Cyber%20Security-111111?style=for-the-badge&logo=hackthebox&logoColor=white">
  <img src="https://img.shields.io/badge/Threat%20Intelligence-000000?style=for-the-badge">
  <img src="https://img.shields.io/badge/Status-Active%20Development-333333?style=for-the-badge">
</p><img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80" width="100%" alt="Cybersecurity"></div>---

🛡️ About BLACKTRACE

BLACKTRACE is an AI-powered Cyber Threat Intelligence and Internet asset search platform designed to help security researchers, SOC analysts, cybersecurity students, penetration testers, and defenders understand Internet-exposed infrastructure.

BLACKTRACE combines asset intelligence, vulnerability information, security analysis, visualization, and AI-powered explanations into one platform.

Instead of simply showing technical results, the AI explains:

- What the result means
- Why it matters
- How it can be useful
- What security risk it may indicate
- What should be investigated next
- Recommended defensive actions

---

🧠 How BLACKTRACE Works

<div align="center"><img src="https://mermaid.ink/img/pako:eNp1kMFOwzAMRX8l8gqJQ2nqkQ0Jx0pTqZQ4dQJmSxKkKxQ0xkKQxJb4d9rGxY0G3b2t7-8vJ7QYkG2Y0c0M0pGmQ2yQqW5JmW7c4v6xQG5sY4g6g1m3gkqQ7vVY2w4dVYq7g9WQmQk6m2Y2lYkJ9d7h3qj6b9qJrJ1bq8k6JvQxYqYj8x5d9p1bY2mYx2mW0yYw1GmZ2nW8zW3J0rK4cG8tQYkYw" width="850" alt="BLACKTRACE workflow"></div>User Search
     │
     ▼
Query Understanding
     │
     ▼
Intelligence Search
     │
     ├── IP Intelligence
     ├── Domain Intelligence
     ├── DNS
     ├── SSL/TLS
     ├── Ports & Services
     ├── Technologies
     └── Vulnerabilities
     │
     ▼
AI Analysis
     │
     ▼
Security Explanation
     │
     ▼
Risk & Recommendations

---

🔎 Intelligence Search

Search for:

<div align="center"><table>
<tr>
<td align="center">🌐<br><b>IP Addresses</b></td>
<td align="center">🔗<br><b>Domains</b></td>
<td align="center">🖥️<br><b>Hosts</b></td>
<td align="center">🔐<br><b>CVEs</b></td>
</tr>
<tr>
<td align="center">🚪<br><b>Ports</b></td>
<td align="center">⚙️<br><b>Services</b></td>
<td align="center">💻<br><b>Technologies</b></td>
<td align="center">🛡️<br><b>Vulnerabilities</b></td>
</tr>
</table></div>---

🤖 AI Security Explanation

The most important feature of BLACKTRACE is the AI Explanation Layer.

Example

Search:
example.com

BLACKTRACE returns technical information.

The AI then explains:

What is this?

This is a publicly reachable web asset associated with the searched domain.

What does it mean?

The asset exposes services and technologies that can be identified from available intelligence.

Why does it matter?

Internet-facing services contribute to an organization's external attack surface.

How is it useful?

Security teams can use this information for:

• Attack-surface management
• Asset inventory
• Vulnerability prioritization
• Configuration review
• Security monitoring

Recommended Action

Review exposed services and verify that detected software and configurations are properly secured.

---

🖥️ Platform Screenshots

Homepage

<div align="center"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80" width="90%" alt="BLACKTRACE Homepage"></div>---

Cybersecurity Intelligence

<div align="center"><img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80" width="90%" alt="Cybersecurity Intelligence"></div>---

AI Security Analysis

<div align="center"><img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1400&q=80" width="90%" alt="AI Cybersecurity"></div>«Note: Replace these demo images with screenshots of your actual BLACKTRACE interface for the final repository.»

---

🌐 Asset Intelligence

Analyze Internet-facing assets and view:

IP Address
Hostname
Organization
ASN
ISP
Location
Open Ports
Services
Technologies
DNS
SSL/TLS
HTTP
Vulnerabilities
Risk Score
AI Analysis

---

🔐 Vulnerability Intelligence

BLACKTRACE can organize vulnerability information including:

- CVE identifiers
- CVSS scores
- Severity
- Affected products
- Affected versions
- Vulnerability descriptions
- Security impact
- Remediation recommendations
- References

Example:

┌──────────────────────────────────────┐
│ CVE-XXXX-XXXXX                       │
├──────────────────────────────────────┤
│ Severity       HIGH                  │
│ CVSS            8.8                   │
│ Product         Example Software      │
│ Status          Requires Verification │
└──────────────────────────────────────┘

---

🌍 Global Intelligence

BLACKTRACE can visualize aggregated intelligence through:

- Countries
- ASNs
- Organizations
- Technologies
- Services
- Vulnerabilities
- Asset distribution

The platform can use interactive maps and analytics to help security teams understand infrastructure at scale.

---

📊 Security Dashboard

<div align="center"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80" width="90%" alt="Security Analytics Dashboard"></div>Dashboard metrics include:

Metric| Description
Assets| Observed security assets
Services| Exposed services
Technologies| Detected technologies
Vulnerabilities| Associated vulnerabilities
Risk| Security risk indicators
Searches| Search activity
AI Analysis| AI-generated explanations

---

🧩 AI Context Engine

BLACKTRACE provides the AI with the relevant search context.

{
  "asset": "example.com",
  "ports": [],
  "services": [],
  "technologies": [],
  "vulnerabilities": [],
  "dns": {},
  "ssl": {},
  "http": {},
  "risk_score": 0
}

The AI uses this information to generate context-aware explanations.

It should never invent results that are not present in the underlying data.

---

🔬 Evidence-Based AI

BLACKTRACE separates:

🟢 Observed

Information directly obtained from a trusted data source.

🔵 Inferred

AI interpretation based on observed information.

🟡 Potential

A possible security concern requiring verification.

🔴 Confirmed

A finding supported by reliable evidence.

This helps prevent AI-generated assumptions from being presented as confirmed vulnerabilities.

---

🏗️ Architecture

                    ┌─────────────────┐
                    │    BLACKTRACE   │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    FastAPI      │
                    │      API        │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             ▼               ▼               ▼
       ┌───────────┐   ┌───────────┐   ┌───────────┐
       │  Search   │   │Intelligence│   │    AI     │
       │  Engine   │   │   Engine   │   │  Engine   │
       └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
             │               │               │
             └───────────────┼───────────────┘
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘

---

🛠️ Technology Stack

Frontend

React
TypeScript
Tailwind CSS
Three.js
React Three Fiber
Framer Motion

Backend

Python
FastAPI
SQLAlchemy
Pydantic
Redis

Database

PostgreSQL
OpenSearch / Elasticsearch

Infrastructure

Docker
Docker Compose
REST API
WebSockets / SSE

AI

AI API
Natural Language Understanding
Context-Aware Analysis
Security Explanation
Risk Interpretation
Remediation Guidance

---

📁 Project Structure

BLACKTRACE/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── search/
│   │   ├── charts/
│   │   ├── three/
│   │   └── services/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── intelligence/
│   │   ├── models/
│   │   ├── search/
│   │   └── services/
│   └── requirements.txt
│
├── database/
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md

---

🚀 Getting Started

Clone

git clone https://github.com/YOUR_USERNAME/BLACKTRACE.git
cd BLACKTRACE

Install Frontend

cd frontend
npm install
npm run dev

Install Backend

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Docker

docker compose up --build

---

🔌 API

Example endpoints:

GET  /api/v1/search?q=
GET  /api/v1/ip/{ip}
GET  /api/v1/domain/{domain}
GET  /api/v1/cve/{cve}
GET  /api/v1/technology/{technology}

POST /api/v1/ai/analyze

GET  /api/v1/assets
GET  /api/v1/vulnerabilities

---

💬 Example AI Questions

Users can ask:

What does this IP information mean?

Explain these open ports.

Why is this vulnerability important?

Which vulnerability should I prioritize?

Explain this result in simple language.

What security risks should I investigate?

What does this SSL certificate information mean?

Summarize this asset.

What should I check next?

---

🔒 Responsible Use

BLACKTRACE is designed for:

- Defensive cybersecurity
- Threat intelligence
- Security research
- Asset management
- Vulnerability analysis
- Security education
- Authorized security assessments

Only analyze systems and assets that you are authorized to assess.

Do not use the platform for unauthorized exploitation, credential theft, malware deployment, destructive attacks, or attacks against third-party systems.

---

🗺️ Roadmap

[x] Cybersecurity search interface
[x] Asset intelligence interface
[x] Vulnerability intelligence
[x] AI explanation layer
[x] 3D cybersecurity interface
[ ] Advanced search engine
[ ] Historical asset intelligence
[ ] Advanced analytics
[ ] Threat intelligence connectors
[ ] API marketplace
[ ] Organization accounts
[ ] Advanced reporting
[ ] Mobile optimization

---

⭐ Contributing

Contributions are welcome.

git checkout -b feature/new-feature

git add .

git commit -m "Add new feature"

git push origin feature/new-feature

Then create a Pull Request.

---

⚠️ Disclaimer

BLACKTRACE is intended for educational, research, and authorized defensive cybersecurity purposes.

AI-generated analysis should be treated as an interpretation of available data. Important security findings should always be verified against reliable source evidence.

The developers are not responsible for misuse of this project.

---

<div align="center">⚫ BLACKTRACE

Search. Discover. Understand the Internet.

<br><img src="https://img.shields.io/badge/Made%20for-Cybersecurity-000000?style=for-the-badge">
<img src="https://img.shields.io/badge/Powered%20by-AI-111111?style=for-the-badge"><br><br>

⭐ Star the repository if you like the project!

</div>
