# Payment → Access Flow (CINIS / Cortex)

**Status:** Coding & wiring in progress (test keys)  
**Last updated:** 2026-09-21

This document describes the intended clean path from payment to member access.

---

## 1. High-level flow

```
User pays (Paystack)
    ↓
Paystack sends charge.success webhook
    ↓
Netlify function: /.netlify/functions/paystack-webhook
    ↓
Signature verified with PAYSTACK_SECRET_KEY
    ↓
(Optional) Forward to API_BASE_URL if set
    ↓
Membership / access grant recorded
    ↓
User lands in /member/ area with active status
```

---

## 2. What already exists

| Component | Location | Status |
|-----------|----------|--------|
| Webhook function | `netlify/functions/paystack-webhook.js` | Exists, verifies HMAC, idempotent |
| Secret key | Netlify env `PAYSTACK_SECRET_KEY` | Present (currently test key) |
| Member dashboard | `/member/index.html` | On main |
| Directory | `/member/directory.html` + `data/directory.json` | MVP data expanded |
| Live key switch guide | `docs/commerce/LIVE_KEY_SWITCH.md` | Ready for later |

---

## 3. Netlify production note (2026-09-21)

Production deploys are **paused** because the Netlify team used all deploy credits for the billing cycle. Published site stays online; **new** production deploys are skipped.

- Continue coding on GitHub `main` / director branches.
- When credits resume (upgrade or next cycle), run **Clear cache and deploy site** once to publish accumulated work.

---

## 4. Access status (current practical approach)

1. Webhook receives `charge.success` and logs reference + email.
2. Member area can show plan/status (demo via localStorage until durable store).
3. Next: durable grant record when API/store is active.

---

## 5. Webhook URL

```
https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
```

Register in Paystack Test and Live when ready. Do **not** switch to `sk_live_...` until Director command.

See: `docs/commerce/LIVE_KEY_SWITCH.md`
