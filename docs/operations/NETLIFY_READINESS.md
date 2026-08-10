# Netlify Readiness — CINIS NEXUS

**Site:** https://cortex-platforms.netlify.app

## Functions

| Function | Path |
|----------|------|
| Health | `/.netlify/functions/health` |
| Paystack webhook | `/.netlify/functions/paystack-webhook` |

## Required env (Site settings → Environment variables)

```
PAYSTACK_SECRET_KEY=sk_test_...   # or sk_live_
PAYSTACK_PUBLIC_KEY=pk_test_...
API_BASE_URL=                     # optional Render API origin
```

After changes: **Trigger deploy**.

## Paystack webhook URL to paste in dashboard

```
https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
```

Full guide: [PAYSTACK_WEBHOOKS.md](./PAYSTACK_WEBHOOKS.md)
