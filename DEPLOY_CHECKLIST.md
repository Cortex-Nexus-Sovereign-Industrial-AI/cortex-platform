# Deploy Checklist — CINIS NEXUS
**Repo:** Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform  
**Updated:** 2026-08-06

## 1. Local API (member dashboard + orders)

```bash
cd backend   # or from root with path
cp .env.example .env
# Edit .env: JWT_SECRET, PAYSTACK_*, optional SHOPIFY_*
npm install express cors dotenv sqlite3 bcryptjs jsonwebtoken
node server.js
# Health: GET http://localhost:5000/api/health
```

Open `member-dashboard.html` (with API running).

## 2. Shopify products

```bash
export SHOPIFY_ADMIN_TOKEN=shpat_...
export SHOPIFY_STORE_DOMAIN=cortex-intelligence-nexus.myshopify.com
node scripts/seed-shopify-products.js
```

## 3. Netlify

1. Site connected to this GitHub repo, branch `main`
2. Build: use existing `netlify.toml` (publish = `.`)
3. **Environment variables** (Site settings → Environment):

| Variable | Required |
|----------|----------|
| `JWT_SECRET` | Yes (long random) |
| `PAYSTACK_SECRET_KEY` | Yes for live payments |
| `PAYSTACK_PUBLIC_KEY` | Yes |
| `PAYSTACK_WEBHOOK_SECRET` | Recommended |
| `SHOPIFY_ADMIN_TOKEN` | For commerce admin |
| `SHOPIFY_STORE_DOMAIN` | Optional (has default) |
| `FRONTEND_URL` | Production site URL |

4. Deploy / trigger redeploy
5. Test:
   - `/` → index shell
   - `/member-dashboard.html` → member UI
   - `/.netlify/functions/paystack-webhook` → webhook target in Paystack dashboard

## 4. Paystack dashboard

- Webhook URL: `https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook`
  (or `/api/webhooks/paystack` if backend is hosted separately)
- Confirm public key matches frontend

## 5. GitHub Pages (optional mirror)

Settings → Pages → Deploy from `main` / root. Static only; API still needs Netlify functions or separate Node host.

## 6. Post-deploy verification

- [ ] STATUS.md reflects current reality
- [ ] about.me links to live surfaces
- [ ] Member register/login works against live API base
- [ ] No secrets committed (`git status` clean of `.env`)

---
**Command Center:** [COMMAND_CENTER.md](./COMMAND_CENTER.md) · **Status:** [STATUS.md](./STATUS.md)
