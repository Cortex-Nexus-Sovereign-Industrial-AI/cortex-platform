# Paystack keys — Cortex Intelligence Nexus

**Business:** Cortex Intelligence Nexus (match Google Business name).  
**Products:** See [PAYSTACK_PRODUCTS.md](./PAYSTACK_PRODUCTS.md) — exact titles only.

## Payment link (primary digital offer)

```
https://paystack.shop/pay/cortex-demo
```

- Product: **30-Day AI Content System** — ₦22,000  
- Wired on: `offers.html` + WhatsApp scripts  

## Storefront (optional · do not share while Test banner shows)

```
https://paystack.shop/cortex-intelligence-nexus
```

Allowed products only: 30-Day AI Content System · Agro starter · Electronics Diagnosis Fee.  
Remove **Custom Solution Access** if still listed.

## Public key (frontend only)

```
pk_test_51886aa836c3bfef178cd65a60122e1f0e0c5259
```

- Mode: **Test** until compliance complete  
- Does **not** verify webhooks  

## Secret key (server only — never in Git)

| Where | Variable |
|-------|----------|
| Netlify env | `PAYSTACK_SECRET_KEY` = `sk_test_…` (same dashboard) |
| Webhook HMAC | Uses **secret** key |

## Webhook URL

```
https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
```

## Checklist

1. [x] Public test key recorded  
2. [x] Payment link live (cortex-demo → ₦22k Content System)  
3. [x] Test charge succeeded (e.g. ref T456761397718190, 2026-10-02)  
4. [ ] `PAYSTACK_SECRET_KEY` set on Netlify + redeploy  
5. [ ] Webhook URL saved in Paystack (Test)  
6. [ ] Function logs show `charge.success` for a test payment  
7. [ ] Storefront products match PAYSTACK_PRODUCTS.md  
8. [ ] Compliance completed on Cortex Intelligence Nexus (for live)  
9. [ ] Never commit secret keys  

## Live mode later

Use `pk_live_…` / `sk_live_…` and Live webhook separately. See `LIVE_KEY_SWITCH.md`.
