# NEXT ACTIONS — Execution Queue
**Updated:** 2026-08-06

## Completed in this orchestration
- [x] Command / status / docs / security
- [x] Shopify seed + auth + member route protection + access grants
- [x] Frontend public CTAs
- [x] Root inventory (canonical vs experimental)

## Your credentials (required to go live on commerce/payments)
```bash
# Local or Netlify environment — never commit these
export SHOPIFY_ADMIN_TOKEN=shpat_...
export JWT_SECRET=long-random-string
export PAYSTACK_SECRET_KEY=sk_live_...
export PAYSTACK_PUBLIC_KEY=pk_live_...

node scripts/seed-shopify-products.js
```

## Optional code follow-ups
- [ ] Move large root PDFs into docs/archive (binary)
- [ ] Founder review then archive/delete duplicate funnel/index variants
- [ ] Bind member UI to GET /api/auth/me

---
All structural heavy lifting that can be done without secrets is complete.
