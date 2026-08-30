# Paystack keys — Cortex AI Nexus

**Business:** Matched to Google Business Name on Paystack (owner confirmed 2026-08-15).

## Payment link (live)

```
https://paystack.shop/pay/cortex-demo
```

- Offer: 30-Day AI Content System — ₦22,000
- Injected: offers.html + WhatsApp scripts (2026-08-30)

## Public key (frontend / Inline JS only)

```
pk_test_51886aa836c3bfef178cd65a60122e1f0e0c5259
```

- Mode: **Test**
- Safe to use in browser, offers page, Paystack Popup/Inline
- Does **not** verify webhooks

## Secret key (server only — never in Git)

| Where | Variable |
|-------|----------|
| Netlify env | `PAYSTACK_SECRET_KEY` = `sk_test_…` (from same dashboard) |
| Webhook HMAC | Uses **secret** key, not public |

Get secret: Paystack Dashboard → Settings → API Keys & Webhooks → **Secret Key** (Test).

## Webhook URL

```
https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
```

## Checklist

1. [x] Public test key recorded (this file)
2. [x] Payment link live (cortex-demo)
3. [ ] `PAYSTACK_SECRET_KEY` set on Netlify (Test secret from same account)
4. [ ] `PAYSTACK_PUBLIC_KEY` set on Netlify = the pk_test above (optional but clean)
5. [ ] Webhook URL saved in Paystack (Test mode)
6. [ ] One test charge → function logs show 200

## Live mode later

Replace with `pk_live_…` / `sk_live_…` and set Live webhook URL separately. Never commit live secret keys.
