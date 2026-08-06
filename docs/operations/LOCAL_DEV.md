# Local Development — CINIS NEXUS

## 1. API (required for real login)

```bash
cd backend
npm install
cp .env.example .env
# Edit: JWT_SECRET=any-long-string
npm start
# → http://localhost:5000/api/health
```

## 2. Frontend

Serve the repo root (any static server), e.g.:

```bash
# from repo root
npx --yes serve -p 3000
```

Open http://localhost:3000  
`app.js` and `member-dashboard.html` use `http://localhost:5000` as API base on localhost.

## 3. Shopify seed (optional)

```bash
export SHOPIFY_ADMIN_TOKEN=shpat_...
node scripts/seed-shopify-products.js
```

## 4. Smoke checks

| Check | Expected |
|-------|----------|
| GET localhost:5000/api/health | `{ status: "ok" }` |
| Register on index or member-dashboard | JWT returned, app opens |
| GET /api/auth/me with Bearer token | Profile + grants |

## Production

- Static + functions: Netlify (`/api/health` → Netlify function)
- Full JWT/SQLite API: Render (`render.yaml`) or any Node host
- Set `FRONTEND_URL` on the API to your Netlify origin for CORS

See [DEPLOY_CHECKLIST.md](../../DEPLOY_CHECKLIST.md).
