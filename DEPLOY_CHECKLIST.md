# Deploy Checklist — CINIS NEXUS
**Updated:** 2026-08-06

## A. Local API

```bash
cd backend
npm install
cp .env.example .env
# JWT_SECRET, PAYSTACK_*, FRONTEND_URL
npm start
# GET http://localhost:5000/api/health
```

Open `member-dashboard.html` with the API running.

## B. Shopify products

```bash
export SHOPIFY_ADMIN_TOKEN=shpat_...
node scripts/seed-shopify-products.js
```

## C. Netlify (static + functions)

1. Connect repo → branch `main`
2. Env: `PAYSTACK_*`, optional Shopify tokens
3. Confirm `netlify.toml` publish = `.`
4. Test `/` and `/member-dashboard.html`
5. Optional webhook: `https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook`

## D. Render (Express API — recommended for JWT/SQLite)

1. New Blueprint from this repo (`render.yaml`)
2. Service: `cortex-platform-api` (rootDir `backend`)
3. Set env: `FRONTEND_URL`, `PAYSTACK_*`, confirm `JWT_SECRET`
4. Health: `https://<service>.onrender.com/api/health`
5. Paystack webhook: `https://<service>.onrender.com/api/webhooks/paystack`
6. Point member-dashboard `API_BASE` or host under same CORS origin via `FRONTEND_URL`

## E. Verify

- [ ] /api/health OK
- [ ] Register/login on member-dashboard
- [ ] No `.env` in Git
- [ ] STATUS.md still accurate

**Command Center:** [COMMAND_CENTER.md](./COMMAND_CENTER.md)
