# Shopify Integration — CINIS NEXUS

## Confirmed Store
- **Domain:** `cortex-intelligence-nexus.myshopify.com`
- **Client:** `shopify-client.js` (GraphQL + REST helpers)
- **Seed script:** `scripts/seed-shopify-products.js`

## Goal
Bind a live Shopify storefront so digital products, SDK access, and paid plans can be sold and tracked.

## Current State
- [x] Store domain identified
- [x] Admin client present (`shopify-client.js`)
- [x] Deploy workflow present (`shopify-deploy.yml`)
- [x] Product seed script ready (4 initial products)
- [ ] Admin token set in environment (`SHOPIFY_ADMIN_TOKEN`)
- [ ] Products pushed to live store
- [ ] Storefront linked from main index + about.me

## Seed Products (ready to push)
1. CINIS Platform Access — Starter (₦5,000)
2. CINIS Platform Access — Pro (₦15,000)
3. MikeComplex AI Agent Pack (₦7,500)
4. Market Intelligence Report — Ogoja / Cross River (₦10,000)

## How to Push Products
```bash
export SHOPIFY_ADMIN_TOKEN=shpat_your_token_here
# optional:
# export SHOPIFY_STORE_DOMAIN=cortex-intelligence-nexus.myshopify.com
node scripts/seed-shopify-products.js
```

## Environment Variables Required
- `SHOPIFY_ADMIN_TOKEN` — private app / custom app Admin API token
- `SHOPIFY_STORE_DOMAIN` — defaults to cortex-intelligence-nexus.myshopify.com

Never commit tokens. Use Netlify / local env only.

## After Products Are Live
1. Confirm in Shopify Admin → Products
2. Link storefront URL from `index.html` Business Hub / Commerce tabs
3. Optionally map Paystack or Shopify Payments for Nigerian customers
4. Record completion in STATUS.md and ACTIVITY_LOG.md
