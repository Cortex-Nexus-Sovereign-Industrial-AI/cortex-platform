# Cortex Platform — CINIS NEXUS

**Sovereign Industrial AI · Ogoja, Nigeria**  
**Founder:** Michael Ujuku Morim ([@mikecomplexai-7](https://github.com/mikecomplexai-7))

[![Status](https://img.shields.io/badge/Status-Production%20Shell-3b82f6)](./STATUS.md)
[![GitHub](https://img.shields.io/badge/GitHub-Command%20Repo-111827)](https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform)

---

## Central identity

| Layer | Location |
|-------|----------|
| **Founder account** | [github.com/mikecomplexai-7](https://github.com/mikecomplexai-7) |
| **Organization** | [Cortex-Nexus-Sovereign-Industrial-AI](https://github.com/Cortex-Nexus-Sovereign-Industrial-AI) |
| **This command repo** | [cortex-platform](https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform) |
| **Live site** | [cortex-platforms.netlify.app](https://cortex-platforms.netlify.app) |
| **Identity hub** | [about.me/mikecomplexai](https://about.me/mikecomplexai) |

All operational truth is versioned here. No bank routing, no off-repo secret stores in Git.

---

## Live surfaces

| Surface | URL |
|---------|-----|
| Production shell | https://cortex-platforms.netlify.app |
| Member dashboard | https://cortex-platforms.netlify.app/member-dashboard.html |
| GitHub Pages | https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform/ |
| Command Center | [COMMAND_CENTER.md](./COMMAND_CENTER.md) |
| Status | [STATUS.md](./STATUS.md) |
| Deploy checklist | [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) |
| Handoff | [HANDOFF.md](./HANDOFF.md) |

---

## Ready now

- Clean production landing (`index.html`)
- Member dashboard (JWT-ready UI)
- Backend API v2.2 (`backend/server.js`)
- Paystack webhook path + Shopify seed script
- Netlify + Render deploy configs
- Secrets kept out of Git

## Activate (owner)

1. Set env secrets (JWT, Paystack, optional Shopify)
2. Host API: `cd backend && npm start` or Render blueprint
3. Redeploy Netlify from `main`
4. Optional: `node scripts/seed-shopify-products.js`

Full steps: [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)

---

**CINIS NEXUS INDUSTRY OGOJA** · Contact: cortexnexus@proton.me
