# Register Webhooks - README

This folder contains scripts to register and test webhooks for Shopify, Paystack and Flutterwave.

Files
- `register-shopify-webhooks.js` — Node script that upserts Shopify webhook subscriptions (GraphQL).
- `register-payments-webhooks.sh` — curl examples to POST test webhook payloads to your webhook endpoints.
- `README-register-webhooks.md` — this file.

Required environment variables
- SHOPIFY_STORE_DOMAIN (e.g. cortex-intelligence-nexus.myshopify.com)
- SHOPIFY_ADMIN_TOKEN (Admin access token with write_webhooks / products / orders / inventory scopes)
- WEBHOOK_CALLBACK_URL (optional) — default: https://cortex-platforms.netlify.app/api/webhooks/shopify
- SHOPIFY_WEBHOOK_SECRET — HMAC validation on the Netlify receiver
- PAYSTACK_WEBHOOK_SECRET (used by your backend; not required to run the scripts)
- FLUTTERWAVE_WEBHOOK_SECRET (used by your backend; not required to run the scripts)

Activity Tracker topics registered by the Node script
- ORDERS_CREATED
- ORDERS_UPDATED
- INVENTORY_LEVELS_UPDATE
- PRODUCTS_CREATE
- PRODUCTS_UPDATE

Receiver
- `netlify/functions/shopify-webhook.js`
- Redirect: `/api/webhooks/shopify` → `/.netlify/functions/shopify-webhook`
- Default mode is dry-run. Live X posts require `ACTIVITY_TRACKER_LIVE=true` plus X API user-context credentials for @MikeComplexAie.

Install & run
1. Node 18+
2. Register Shopify topics:
   SHOPIFY_STORE_DOMAIN="cortex-intelligence-nexus.myshopify.com" \
   SHOPIFY_ADMIN_TOKEN="shpat_xxx" \
   WEBHOOK_CALLBACK_URL="https://cortex-platforms.netlify.app/api/webhooks/shopify" \
   node scripts/register-shopify-webhooks.js

3. Test payment webhooks (example):
   bash scripts/register-payments-webhooks.sh

Notes
- The Node script skips duplicate webhook subscriptions with the same callback URL and topic.
- Never commit tokens. Place secrets only in Netlify / local `.env`.
