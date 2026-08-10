# Deploy Checklist — CINIS NEXUS

## Paystack webhooks (quick)

1. Netlify env: `PAYSTACK_SECRET_KEY` (+ optional `API_BASE_URL` for Render forward)  
2. Redeploy Netlify  
3. Paystack Dashboard → **Settings → API Keys & Webhooks**  
4. Webhook URL (Test and Live separately):

```
https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
```

Or when Express API is on Render:

```
https://<your-service>.onrender.com/api/webhooks/paystack
```

5. Full guide: [docs/operations/PAYSTACK_WEBHOOKS.md](./docs/operations/PAYSTACK_WEBHOOKS.md)

---

## A. Local API

```bash
cd backend && npm install && cp .env.example .env
# JWT_SECRET, PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY, FRONTEND_URL
npm start
```

## B. Shopify (optional)

```bash
export SHOPIFY_ADMIN_TOKEN=shpat_...
node scripts/seed-shopify-products.js
```

## C. Netlify

- Branch `main`, env vars above, redeploy  
- Test: `/` and `/.netlify/functions/health`

## D. Render API (JWT + access grants)

- Blueprint `render.yaml` · env: `JWT_SECRET`, `PAYSTACK_*`, `FRONTEND_URL`  
- Webhook: `https://<service>.onrender.com/api/webhooks/paystack`

## E. Verify

- [ ] Test payment with test card  
- [ ] Webhook log shows `charge.success`  
- [ ] No secrets in Git  
