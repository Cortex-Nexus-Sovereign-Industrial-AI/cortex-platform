# Cortex Platform — CINIS NEXUS
**Official hub for Cortex Intelligence Nexus-Intel Solution (CINIS)**  
Sovereign Industrial AI · Ogoja, Nigeria · Founded by Michael Ujuku Morim

[![Status](https://img.shields.io/badge/Status-Active%20Build-00C2FF)](./STATUS.md)
[![Command Center](https://img.shields.io/badge/Command-Center-001F5B)](./COMMAND_CENTER.md)

---

## Quick Links

| Surface | URL |
|---------|-----|
| **Command Center** | [COMMAND_CENTER.md](./COMMAND_CENTER.md) |
| **Live Status** | [STATUS.md](./STATUS.md) |
| **Member Dashboard** | [member-dashboard.html](./member-dashboard.html) |
| GitHub Pages | [cortex-platform site](https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform/) |
| Netlify | [cortex-platforms.netlify.app](https://cortex-platforms.netlify.app) |
| Identity | [about.me/mikecomplexai](https://about.me/mikecomplexai) |
| Publication | [mikecomplexai.substack.com](https://mikecomplexai.substack.com) |
| Public surfaces map | [PUBLIC_SURFACES.md](./PUBLIC_SURFACES.md) |

---

## What is ready

- Command center, status board, activity log, root inventory
- Documentation hierarchy under `/docs`
- Secrets removed from Git (`.env` examples only)
- Backend API v2.2 — JWT register/login, `/api/auth/me`, protected orders/stats, Paystack webhook → access grants
- Shopify client + product seed script (4 products)
- Primary `index.html` with public CTAs
- `member-dashboard.html` bound to `/api/auth/me`

## Owner actions to go live

```bash
export JWT_SECRET=long-random-string
export PAYSTACK_SECRET_KEY=sk_test_or_live_...
export PAYSTACK_PUBLIC_KEY=pk_test_or_live_...
export SHOPIFY_ADMIN_TOKEN=shpat_...

node backend/server.js
node scripts/seed-shopify-products.js   # optional
```

Set the same variables in **Netlify → Environment variables** for production.

---

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML/CSS/JS + Netlify |
| Backend | Node.js (Express + SQLite) + Python agents |
| Payments | Paystack |
| Commerce | Shopify |
| Hosting | GitHub Pages + Netlify |

---

**Built under active command by MikeComplex AI / CINIS NEXUS.**  
All operational documents and progress are versioned in this repository.
