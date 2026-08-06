# Full Stack Map — CINIS NEXUS

## Frontend
- Multiple static HTML entry points (index.html, index_complete.html, index-production.html, funnel-lane variants)
- Admin dashboard + Customer success portal
- CSS: styles.css, style-1.css
- JS: app.js (large), various helpers
- Netlify for dynamic/edge functions

## Backend
- Node.js: `backend/server.js`, routes (auth, deploy, orders, payments)
- Auth stubs: login.js, callback.js
- Prisma schema present
- Python: agents, orchestrators, engines (agent.py, cinis_orchestrator.py, enterprise_engine.py, zero_engine.py, etc.)

## Payments & Commerce
- Paystack (documented + webhook function)
- Shopify client + deploy workflow

## Agents Layer
- MikeComplex AI (Runner)
- CINIS NEXUS AI (Architect)
- Target i7 A18+ (Analytics)
- Supporting worker scripts

## Infrastructure
- GitHub Actions workflows
- Netlify Functions
- Docker / docker-compose present
- Cloud Build yaml

## Documentation
Now being centralized under `/docs` with Command Center as entry point.
