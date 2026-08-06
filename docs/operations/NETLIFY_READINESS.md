# Netlify Readiness — CINIS NEXUS

**Target:** https://cortex-platforms.netlify.app  
**Full checklist:** [DEPLOY_CHECKLIST.md](../../DEPLOY_CHECKLIST.md)

## Present
- `netlify.toml` — publish `.`, functions `netlify/functions`, `/api/*` → functions
- CSP allows Paystack JS + API, Shopify connect
- Static HTML (`index.html`, `member-dashboard.html`) served from root
- Functions folder: paystack-webhook, hf helpers, repo-status, session

## Environment variables to set in Netlify UI
```
JWT_SECRET=
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=
SHOPIFY_ADMIN_TOKEN=
SHOPIFY_STORE_DOMAIN=cortex-intelligence-nexus.myshopify.com
FRONTEND_URL=https://cortex-platforms.netlify.app
```

## Verify after deploy
1. Homepage loads
2. `/member-dashboard.html` loads (not swallowed by SPA redirect)
3. Paystack webhook URL registered in Paystack dashboard
4. No real secrets in Git

## Note
Full Node `backend/server.js` (SQLite JWT API) needs a Node host (Railway, Render, VPS, or local). Netlify Functions cover serverless webhooks; long-running Express can be pointed via `FRONTEND_URL` / CORS when hosted separately.
