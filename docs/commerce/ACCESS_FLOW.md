# Payment → Access Flow (CINIS / Cortex)

**Status:** Coding & wiring in progress (test keys)  
**Last updated:** 2026-09-20

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
| Member dashboard | `/member/index.html` | Scaffolded |
| Directory | `/member/directory.html` | Scaffolded with search |
| Live key switch guide | `docs/commerce/LIVE_KEY_SWITCH.md` | Ready for later |

---

## 3. What we are wiring now

- Clear documentation of the flow (this file)
- Member area that is ready to display real plan status
- Placeholder for how access status will be read (localStorage demo → real record later)
- Keep all live-key actions deferred until Director reminder

---

## 4. Access status (current practical approach)

While full auth is still being completed:

1. Webhook receives `charge.success` and logs reference + email.
2. Member area can show plan/status (currently demo via localStorage for structure).
3. Next coding steps will connect a durable grant record so the dashboard reads real status.

---

## 5. Webhook URL (do not change yet)

```
https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
```

This is the URL that must be registered in **both** Test and Live modes in the Paystack dashboard when the time comes.

---

## 6. Reminder rule

Do **not** switch to `sk_live_...` until the Acting Technical Director explicitly says the coding and wiring phase is complete.

See: `docs/commerce/LIVE_KEY_SWITCH.md`
