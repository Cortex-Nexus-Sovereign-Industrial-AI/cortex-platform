# Register Webhooks - README

This folder contains scripts to register and test webhooks for Shopify, Paystack and Flutterwave.

Files
- `register-shopify-webhooks.js` — Node script that upserts Shopify webhook subscriptions (GraphQL).
- `register-payments-webhooks.sh` — curl examples to POST test webhook payloads to your webhook endpoints.
- `README-register-webhooks.md` — this file.

Required environment variables
- SHOPIFY_STORE_DOMAIN (e.g. cortex-intelligence-nexus.myshopify.com)
- SHOPIFY_ADMIN_TOKEN (Admin access token with write_webhooks / orders / inventory scopes)
- WEBHOOK_CALLBACK_URL (optional) — default: https://cortex-platforms.netlify.app/api/webhooks/shopify
- PAYSTACK_WEBHOOK_SECRET (used by your backend; not required to run the scripts)
- FLUTTERWAVE_WEBHOOK_SECRET (used by your backend; not required to run the scripts)

Install & run
1. Install deps (Node 18+):
   npm ci

2. Run the Shopify registration:
   SHOPIFY_STORE_DOMAIN="your-store.myshopify.com" \
   SHOPIFY_ADMIN_TOKEN="shpat_xxx" \
   WEBHOOK_CALLBACK_URL="https://cortex-platforms.netlify.app/api/webhooks/shopify" \
   node scripts/register-shopify-webhooks.js

3. Test payment webhooks (example):
   bash scripts/register-payments-webhooks.sh

Notes
- The Node script will skip creating duplicate webhook subscriptions with the same callback URL and topic.
- Add the required secrets to your Netlify site or GitHub repository secrets before running the workflow.
