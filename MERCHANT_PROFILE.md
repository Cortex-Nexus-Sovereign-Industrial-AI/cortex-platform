# Merchant Profile — Cortex Intelligence Nexus
**Status:** Ready for payment reception  
**Updated:** 2026-08-16  
**Founder:** Michael Ujuku Morim · GitHub mikecomplexai-7

---

## Unified Brand Identity (Single Source of Truth)

| Layer | Exact Value |
|-------|-------------|
| **Primary Brand Name** | Cortex Intelligence Nexus |
| **Platform Line** | Cortex AI Nexus · CINIS NEXUS INDUSTRY OGOJA |
| **Shopify Store Name** | Cortex Intelligence Nexus |
| **Shopify Domain** | cortex-intelligence-nexus.myshopify.com |
| **Paystack Business Name** | Cortex Intelligence Nexus |
| **Google Business** | Matches above (owner-confirmed) |
| **HQ** | Ogoja, Cross River State, Nigeria |
| **Contact** | cortexnexus@proton.me |
| **Live Command Site** | https://cortex-platforms.netlify.app |
| **Member Dashboard** | https://cortex-platforms.netlify.app/member-dashboard.html |
| **Repo (source of truth)** | https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform |

This exact name set is used across Google Business, Paystack, Shopify, and all customer-facing payment receipts and links. No mismatches.

---

## Payment Channels

### A. Paystack (Primary for WhatsApp / Direct Mid-Ticket)
- Business profile completed under **Cortex Intelligence Nexus**
- Public test key recorded in `docs/commerce/PAYSTACK_KEYS.md`
- Webhook URL (Test + Live):
  ```
  https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
  ```
- Secret key lives only in Netlify / Render environment variables (`PAYSTACK_SECRET_KEY`)
- Never commit secrets

### B. Shopify Storefront
- Domain: `cortex-intelligence-nexus.myshopify.com`
- Currently password-protected (remove when ready for public traffic)
- Seed script ready: `scripts/seed-shopify-products.js`
- Products include platform access tiers + the 30-Day AI Content System

---

## Core Offer Ready for Payment

**Name:** 30-Day AI Content System  
**Price:** ₦22,000 (early / test: ₦18,000 for first 10)  
**Delivery:** Within 5 days of payment + brief  
**Guarantee:** Full refund if not delivered in 5 days (delivery only)  
**Ethics:** No income, follower, or sales guarantees. Assets + plan only.

See full stack in `docs/commerce/MID_TICKET_OFFER.md`.

---

## Founder-Only Actions Remaining (Secrets Only)

1. Create the live Paystack payment link / product for ₦22,000 under the exact business name.
2. Paste the real link into WhatsApp scripts (see `docs/commerce/WHATSAPP_SALES_SCRIPT.md`).
3. Set `PAYSTACK_SECRET_KEY` (and optionally public key) on Netlify → redeploy.
4. Confirm webhook URL saved in Paystack Dashboard (both Test and Live modes).
5. (Optional) Run Shopify seed or create products manually with `SHOPIFY_ADMIN_TOKEN`.
6. Remove Shopify store password when ready.
7. Cap concurrent mid-ticket orders (recommended max 5).

All infrastructure, docs, scripts, and routing are prepared.  
Payment reception path is open once the link is created and the secret is in env.
