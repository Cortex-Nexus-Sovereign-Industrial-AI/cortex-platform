# Cortex Intelligence Nexus — cortex-platform

**Public brand:** Cortex Intelligence Nexus  
**Product:** Cortex AI Nexus (this repository)  
**Founder:** Michael Ujuku Morim  
**Org:** [Cortex-Nexus-Sovereign-Industrial-AI](https://github.com/Cortex-Nexus-Sovereign-Industrial-AI)

Industrial AI engineering, agentic systems, and sovereign automation tools. Based in Ogoja, Cross River State, Nigeria.

---

## Live surfaces (SSOT)

| Surface | URL |
|---------|-----|
| **Primary website** | https://cortex-platforms.netlify.app |
| **Identity** | https://cortex-platforms.netlify.app/identity.html |
| **Platform Pulse (Phase 0)** | https://cortex-platforms.netlify.app/metrics-dashboard.html |
| **Offers** | https://cortex-platforms.netlify.app/offers.html |
| **GitHub Pages shell** | https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform/ |
| **Google Business** | https://maps.google.com/maps?cid=2073161413550473641 |
| **Command repo** | https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform |

**Identity source of truth:** [IDENTITY.md](./IDENTITY.md) · **Ops entry:** [COMMAND_CENTER.md](./COMMAND_CENTER.md) · **Health:** [STATUS.md](./STATUS.md)

---

## What this repo is

- Static public HTML on Netlify (`publish = "."`) + pure Node functions under `netlify/functions/`
- Express API under `backend/` (Paystack webhooks, JWT, SQLite when hosted)
- Edge CBF sources under `edge/`
- Internal agents under `agents/` (e.g. Mike Complex AI = **runner only**, not public company name)

---

## Local / deploy notes

```bash
# No heavy root npm install required for static + functions
# Netlify: linked to main → auto deploy
# Secrets: Netlify env only (never commit)
```

Required for payments (founder): `PAYSTACK_SECRET_KEY` on Netlify + Paystack payment link under business name **Cortex Intelligence Nexus**.

Optional: `SOFA_API_KEY`, Shopify tokens — see `backend/.env.example` and `docs/operations/`.

---

## Policy

- Public name: **Cortex Intelligence Nexus** only  
- Founder name: **Michael Ujuku Morim** only  
- Primary website: **https://cortex-platforms.netlify.app**  
- Do not present Mike Complex AI / mikecomplexai as the company identity  

© 2026 Cortex Intelligence Nexus
