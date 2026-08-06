# NEXT ACTIONS
**Updated:** 2026-08-06

## Code orchestration — complete without secrets
- [x] Command / docs / security / inventory
- [x] Shopify seed + backend auth + access grants
- [x] Frontend CTAs + member-dashboard.html

## Owner credentials (required for live commerce)
```bash
export SHOPIFY_ADMIN_TOKEN=shpat_...
export JWT_SECRET=long-random-string
export PAYSTACK_SECRET_KEY=sk_test_or_live_...
export PAYSTACK_PUBLIC_KEY=pk_test_or_live_...

node scripts/seed-shopify-products.js
# Start API: node backend/server.js
# Open: member-dashboard.html
```

Set the same variables in Netlify for production.

## Optional
- [ ] Founder approval to archive duplicate HTML / large PDFs
