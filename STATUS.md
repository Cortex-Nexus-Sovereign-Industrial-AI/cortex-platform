# Cortex AI Nexus — LIVE STATUS
**Updated:** 2026-08-27  
**Founder GitHub:** mikecomplexai-7  
**Brand:** Cortex Intelligence Nexus

---

## Commerce (payment-ready)

| Asset | State |
|-------|--------|
| Merchant profile | Unified under **Cortex Intelligence Nexus** (Google + Paystack + Shopify matched) |
| Shopify store | cortex-intelligence-nexus.myshopify.com (password protected until public) |
| Offer ladder | docs/commerce/OFFER_LADDER.md |
| Mid-ticket stack | docs/commerce/MID_TICKET_OFFER.md (₦22,000) |
| WhatsApp scripts | docs/commerce/WHATSAPP_SALES_SCRIPT.md (ready — paste real Paystack link) |
| Payment → Delivery SOP | docs/commerce/PAYMENT_TO_DELIVERY_SOP.md |
| Operating model | docs/commerce/OPERATING_MODEL.md |
| Public offers page | offers.html → `/offers.html` after Netlify deploy |
| Shopify seed | scripts/seed-shopify-products.js (includes 30-Day system + access tiers) |

**Automated / open:** all docs, scripts, webhook function, offers page structure.  
**Manual (founder):** Create Paystack payment link → paste into WhatsApp script → set secret key on Netlify → optional Shopify seed → order caps & fulfillment.

---

## Platform

| Component | State |
|-----------|--------|
| Enterprise / architecture docs | In repo |
| Edge CBF source | edge/cbf/ |
| App shell | Netlify — https://cortex-platforms.netlify.app |
| Paystack webhook code | Ready; secret in env only |
| Member dashboard | /member-dashboard.html |
| X ↔ Shopify Activity Tracker | Code slice in repo, dry-run default — [docs/operations/X_SHOPIFY_ACTIVITY_TRACKER.md](./docs/operations/X_SHOPIFY_ACTIVITY_TRACKER.md) |
| Shopify webhook receiver | `/.netlify/functions/shopify-webhook` + `/api/webhooks/shopify` |

---

## Owner next actions (payment reception)

1. Create Paystack payment link / product for ₦22,000 under business name **Cortex Intelligence Nexus**.
2. Paste the real link into every `[PASTE PAYSTACK LINK]` in WhatsApp scripts.
3. Set `PAYSTACK_SECRET_KEY` on Netlify (and optionally `PAYSTACK_PUBLIC_KEY`) → redeploy.
4. Confirm webhook URL saved in Paystack Dashboard (Test + Live):
   `https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook`
5. (Optional) `export SHOPIFY_ADMIN_TOKEN=shpat_... && node scripts/seed-shopify-products.js`
6. Cap concurrent mid-ticket orders (recommend 5).
7. Remove Shopify store password when ready for public traffic.

## Owner next actions (Activity Tracker)

1. Set `SHOPIFY_WEBHOOK_SECRET` on Netlify.
2. Run `node scripts/register-shopify-webhooks.js` with Admin token.
3. Leave `ACTIVITY_TRACKER_LIVE` unset/false and confirm dry-run logs on a product event.
4. Add X user-context credentials for @MikeComplexAie, then set `ACTIVITY_TRACKER_LIVE=true`.

---

## Payment readiness summary

- Branding matched across Google, Paystack, Shopify.
- Infrastructure (webhook, seed, scripts, SOP) complete.
- Only remaining step for first payment: create the Paystack link and put the secret in environment variables.
