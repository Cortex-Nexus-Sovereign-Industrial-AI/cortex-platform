# CINIS NEXUS — COMMAND CENTER
**Official Single Source of Truth**  
**Founder:** Michael Ujuku Morim (mikecomplexai-7)  
**Last Updated:** 2026-08-06

---

## Start here

| Document | Purpose |
|----------|--------|
| [STATUS.md](./STATUS.md) | Live health board |
| [NEXT_ACTIONS.md](./NEXT_ACTIONS.md) | Execution queue |
| [PUBLIC_SURFACES.md](./PUBLIC_SURFACES.md) | All public URLs |
| [ACTIVITY_BADGE.md](./ACTIVITY_BADGE.md) | Activity signal |
| [docs/product/ROOT_INVENTORY.md](./docs/product/ROOT_INVENTORY.md) | Canonical vs experimental files |
| [docs/README.md](./docs/README.md) | Docs index |

## Live surfaces
- GitHub Pages: https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform/
- Netlify: https://cortex-platforms.netlify.app
- Identity: https://about.me/mikecomplexai
- Publication: https://mikecomplexai.substack.com
- Shopify: cortex-intelligence-nexus.myshopify.com (seed ready)
- Repo: https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform

## Stack
Frontend: `index.html` + Netlify  
Backend: `backend/server.js` v2.2 (JWT, orders, Paystack, access grants)  
Commerce: `shopify-client.js` + `scripts/seed-shopify-products.js`  
Agents: Python + JS workers under repo

## Owner actions remaining
1. Set `SHOPIFY_ADMIN_TOKEN` and run product seed  
2. Set Netlify production secrets (JWT, Paystack, Shopify)  
3. Optional: approve archive of duplicate HTML / root PDFs

**This file is the entry point.**
