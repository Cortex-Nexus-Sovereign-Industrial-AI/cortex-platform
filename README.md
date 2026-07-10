# Cortex Platform: Sovereign Industrial AI Core

The primary production engine and orchestration node for **CINIS NEXUS INDUSTRY HQ**, engineered for high-performance, edge-resilient industrial automation.

Founded by **Michael Ujuku Morim** in Ogoja, Cross River State, Nigeria.

---

## 🌐 Unified Ecosystem Directory

| Resource | Link |
|----------|------|
| **Live Platform** | [cortex-platforms.netlify.app](https://cortex-platforms.netlify.app) |
| **GitHub Repository** | [Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform](https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform) |
| **Identity** | [about.me/mikecomplexai](https://about.me/mikecomplexai) |
| **Secure Email** | `cortexnexus@proton.me` |

### 📢 Connected Media Channels
- **X (Twitter):** [@MikeComplexAie](https://x.com/MikeComplexAie) — Real-time technical updates
- **YouTube:** [@MikecomplexAI-i2e](https://www.youtube.com/@MikecomplexAI-i2e) — Deep-dive video documentation
- **TikTok:** [@cinisnio.ai](https://www.tiktok.com/@cinisnio.ai) — Dynamic platform demonstrations
- **Medium:** [@mikecomplexai](https://medium.com/@mikecomplexai) — Technical articles and analysis
- **LinkedIn:** [michaelujukumorim](https://www.linkedin.com/in/michaelujukumorim) — Professional networking
- **Snapchat:** [@mikecomplexai](https://www.snapchat.com/add/mikecomplexai) — Behind-the-scenes updates

### 📡 Direct Communication Endpoints
- **WhatsApp:** [+234 901 025 1577](https://wa.me/2349010251577)
- **Telegram:** [@mikecomplexai](https://t.me/mikecomplexai)
- **Email:** cortexnexus@proton.me

### 🏗️ Infrastructure Custom Domains
- **Cinematic Analysis Hub:** [cinisnio.ai](https://cinisnio.ai)
- **Matrix Routing Layer:** [corte.io](https://corte.io)

---

## 🛠 Core Architecture & Capabilities

This repository houses the core operational layers for our decentralized, offline-first agentic infrastructure.

- **Deterministic Workflows:** Engineered for zero-latency execution across local terminal-level environments (Termux, Pydroid-3)
- **Isolation of Concerns:** Core systems focus purely on localized edge efficiency, completely decoupled from global API integrations
- **Resilient Infrastructure:** Designed from the ground up for data sovereignty, private node hosting, and local network survivability
- **AI Command Center:** 4 specialized AI agents — Cortex Nexus, MikeComplex AI, Builder Bot, Scout AI
- **Payment Rails:** Paystack (primary) + Flutterwave (secondary) with secure webhook validation
- **Commerce:** Shopify store integration with inventory sync and AI recommendations
- **Social Command:** Cross-platform content generation and scheduling

---

## ⚙️ Repository Structure

```text
├── index.html                  # Main platform gateway (SPA)
├── styles.css                  # Complete design system
├── app.js                      # Full application logic & AI engine
├── webhook_trigger_engine.py   # Flask webhook listener
├── netlify.toml                # Netlify deployment config
├── requirements.txt            # Python dependencies
├── .env.example                # Secrets template
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🧭 Quick Start

### Option A: Deploy to Netlify (Recommended)
1. Fork this repository on GitHub
2. Connect your GitHub repo to [Netlify](https://netlify.com)
3. Set build command to: `echo "Static site"`
4. Set publish directory to: `.`
5. Configure environment variables in Netlify dashboard
6. Deploy — your platform is live

### Option B: Local Development
```bash
# 1. Clone the repo
git clone https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform.git
cd cortex-platform

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Configure secrets
cp .env.example .env
# Edit .env with your real API keys

# 4. Run webhook listener
export FLASK_APP=webhook_trigger_engine.py
flask run --port=8080

# 5. Serve the platform
python -m http.server 3000
```

---

## 💳 Payment Integration

### Paystack
1. Go to **Settings → Payment Config**
2. Enter your Paystack Secret Key
3. Set webhook URL in Paystack dashboard

### Flutterwave
1. Enter your Flutterwave Secret Key
2. Set webhook URL in Flutterwave dashboard

---

## 📄 License

Proprietary — CINIS NEXUS INDUSTRY OGOJA. All rights reserved.

---

**Built with sovereignty in mind. Powered by African innovation.** 🇳🇬⚡