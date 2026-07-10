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
- **X (Twitter):** [@cortexainexus](https://x.com/@cortexainexus) — Real-time technical updates
- **YouTube:** [@MikecomplexAi](https://youtube.com/@MikecomplexAi) — Deep-dive video documentation
- **TikTok Hub:** Connected Profile — Dynamic platform demonstrations
- **Facebook:** Business Page — Community engagement
- **Instagram:** Business Profile — Visual storytelling
- **LinkedIn:** Company Page — B2B networking

---

## 🛠 Core Architecture & Capabilities

This repository houses the core operational layers for our decentralized, offline-first agentic infrastructure.

- **Deterministic Workflows:** Engineered for zero-latency execution across local terminal-level environments (Termux, Pydroid-3)
- **Isolation of Concerns:** Core systems focus purely on localized edge efficiency, completely decoupled from global API integrations
- **Resilient Infrastructure:** Designed from the ground up for data sovereignty, private node hosting, and local network survivability
- **AI Command Center:** 4 specialized AI agents — Cortex Nexus, MikeComplex AI, Builder Bot, Scout AI
- **Payment Rails:** Paystack (primary) + Flutterwave (secondary) with secure webhook validation
- **Commerce:** Shopify store integration with inventory sync and AI recommendations
- **Social Command:** Cross-platform content generation and scheduling for X, TikTok, YouTube, Facebook, Instagram, LinkedIn

---

## ⚙️ Repository Structure

```text
├── index.html                  # Main platform gateway (SPA)
├── styles.css                  # Complete design system
├── app.js                      # Full application logic & AI engine
├── webhook_trigger_engine.py   # Flask webhook listener
├── netlify.toml                # Netlify deployment config
├── requirements.txt            # Python dependencies
├── .env.example                # Secrets template (copy to .env)
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
6. Deploy — your platform is live at `https://cortex-platforms.netlify.app`

### Option B: Local Development
```bash
# 1. Clone the repo
git clone https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform.git
cd cortex-platform

# 2. Create virtual environment (for webhook engine)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Configure secrets
cp .env.example .env
# Edit .env with your real API keys (NEVER commit .env)

# 4. Run webhook listener
export FLASK_APP=webhook_trigger_engine.py
flask run --port=8080
# OR
python webhook_trigger_engine.py

# 5. Open index.html in browser or serve with:
python -m http.server 3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/health` | Detailed system health |
| POST | `/api/webhooks/paystack` | Paystack webhook receiver |
| POST | `/api/webhooks/flutterwave` | Flutterwave webhook receiver |
| POST | `/api/webhooks/shopify` | Shopify webhook receiver |
| GET | `/api/transactions/<provider>` | Transaction logs |
| GET | `/api/transactions/summary` | Cross-provider summary |

---

## 🛡 Security & Privacy

- **Never commit secrets** (API keys, webhook secrets) to the repository
- Use environment variables or a secrets manager (`.env` file)
- Configure webhook endpoints with **HTTPS only**
- Validate all webhook signatures before processing
- Add a **Privacy Policy** and **Terms of Service** page if collecting emails or processing payments
- Enable CSP headers (configured in `netlify.toml`)

---

## 🤖 AI Agents

| Agent | Role | Voice |
|-------|------|-------|
| **Cortex Nexus** | Sovereign command node | Authoritative, precise, industrial |
| **MikeComplex AI** | Strategic advisor | Visionary, business-focused |
| **Builder Bot** | Code & infrastructure | Technical, hands-on |
| **Scout AI** | Research & intelligence | Curious, data-driven |

Switch personas in the AI Workspace to get different perspectives on the same task.

---

## 📦 Shopify Integration

1. Go to **Settings → Payments → Shopify Store**
2. Click **Connect Shopify Store**
3. Enter your store URL (e.g., `yourstore.myshopify.com`)
4. Authorize Cortex Platform in Shopify admin
5. Inventory, orders, and products sync automatically

---

## 💳 Payment Configuration

### Paystack
1. Go to **Settings → Payment Config**
2. Enter your Paystack Secret Key and Webhook Secret
3. Set webhook URL in Paystack dashboard to:
   `https://cortex-platforms.netlify.app/api/webhooks/paystack`

### Flutterwave
1. Enter your Flutterwave Secret Key and Webhook Secret
2. Set webhook URL in Flutterwave dashboard to:
   `https://cortex-platforms.netlify.app/api/webhooks/flutterwave`

---

## 📄 License

Proprietary — CINIS NEXUS INDUSTRY OGOJA. All rights reserved.

---

**Built with sovereignty in mind. Powered by African innovation.** 🇳🇬⚡
