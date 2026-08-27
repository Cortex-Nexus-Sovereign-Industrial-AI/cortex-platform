# HANDOFF — X & Shopify Activity Tracker implementation slice
**Date:** 2026-08-27  
**Repo:** https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform  
**Founder / Operator:** Michael Ujuku Morim (Mike Complex) · GitHub **mikecomplexai-7**  
**Brand locked:** Cortex Intelligence Nexus · CINIS NEXUS INDUSTRY OGOJA  
**Persona (Activity role):** Sole operator of the encrypted private loop.

---

## What landed this session

The blueprint is no longer design-only. First automation slice is in `main`:

- `netlify/functions/shopify-webhook.js` — HMAC check, idempotency, policy, response contract
- `netlify/functions/lib/activity-tracker.js` — compose + mandatory tags + sealed log + optional X publish
- `scripts/register-shopify-webhooks.js` — now also registers `PRODUCTS_CREATE` and `PRODUCTS_UPDATE`
- `netlify.toml` — `/api/webhooks/shopify` → shopify-webhook function
- Docs: `docs/operations/X_SHOPIFY_ACTIVITY_TRACKER.md`, `STATUS.md`, this file

**Default is dry-run.** No public post is sent unless the founder sets `ACTIVITY_TRACKER_LIVE=true` and supplies X user-context credentials for @MikeComplexAie.

Policy baked in:
- Active product create/update → draft/post
- Inventory at or below threshold (default 3) → draft/post
- Orders → log only unless `ACTIVITY_POST_ORDERS=true`
- Tags always `#MikeComplexAI #CINIS #Shopify`

---

## What only the Founder can do next

**Activity Tracker path**
1. Set `SHOPIFY_WEBHOOK_SECRET` on Netlify.
2. Confirm Shopify Admin token scopes: `write_webhooks`, `read_products`, `read_orders`, `read_inventory`.
3. Run `node scripts/register-shopify-webhooks.js`.
4. Trigger a product event and read function logs (`mode: dry-run`).
5. Place X API key/secret + access token/secret for @MikeComplexAie in Netlify env.
6. Flip `ACTIVITY_TRACKER_LIVE=true` only after the dry-run copy looks correct.

**Commerce path (unchanged)**
1. Create the Paystack payment link for ₦22,000 under the exact business name.
2. Paste the real link into WhatsApp scripts.
3. Set `PAYSTACK_SECRET_KEY` on Netlify → redeploy.

---

## Canonical files

| File | Purpose |
|------|---------|
| `docs/operations/X_SHOPIFY_ACTIVITY_TRACKER.md` | Locked spec + current implementation notes |
| `netlify/functions/shopify-webhook.js` | Public receiver |
| `netlify/functions/lib/activity-tracker.js` | Composer / publisher / sealer |
| `scripts/register-shopify-webhooks.js` | Topic registration |
| `STATUS.md` | Health board |
| `GOVERNANCE.md` | Absolute founder authority |

Secrets stay out of Git. Authority remains solely with Michael Ujuku Morim.
