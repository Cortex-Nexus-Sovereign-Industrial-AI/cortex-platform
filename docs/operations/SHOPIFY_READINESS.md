# Shopify Readiness — Cortex Intelligence Nexus
**Store:** cortex-intelligence-nexus.myshopify.com  
**Updated:** 2026-08-16

---

## Current state
- Store exists and displays the correct brand name: **Cortex Intelligence Nexus**
- Password protection is active (expected for pre-launch)
- Seed script is ready and includes:
  - 30-Day AI Content System (₦22,000) — flagship mid-ticket
  - CINIS Platform Access — Starter (₦5,000)
  - CINIS Platform Access — Pro (₦15,000)
  - MikeComplex AI Agent Pack (₦7,500)
  - Market Intelligence Report — Ogoja (₦10,000)

## How to seed products
```bash
export SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxx
# optional: export SHOPIFY_STORE_DOMAIN=cortex-intelligence-nexus.myshopify.com
node scripts/seed-shopify-products.js
```

## Recommended public launch sequence
1. Seed or manually create products.
2. Confirm pricing currency is NGN (or set correctly).
3. Connect Shopify Payments or preferred gateway if desired (Paystack can still be primary for WhatsApp).
4. Remove store password.
5. Add store link to the main platform shell and offers page when ready.

## Relationship to Paystack
- Paystack remains the primary channel for WhatsApp-driven mid-ticket sales.
- Shopify serves as the public storefront and additional product channel.
- Both use the same brand name so customer trust and reconciliation stay clean.

## Notes
- Keep `SHOPIFY_ADMIN_TOKEN` in environment variables only.
- Never commit the token.
- After seeding, verify products appear correctly in Shopify Admin → Products.
