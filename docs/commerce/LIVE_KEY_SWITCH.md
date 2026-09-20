# Live Key Switch — Clean Placeholder

**Purpose:** Keep the platform clean while we finish coding and wiring.  
**Rule:** Do **not** switch to live keys until the Acting Technical Director explicitly reminds the Founder that the system is ready for the live switch.

---

## Current Mode

| Item | Current State |
|------|---------------|
| Mode | **Test** |
| Secret key on Netlify | `PAYSTACK_SECRET_KEY` = `sk_test_...` (already present) |
| Public key (frontend) | `pk_test_...` (documented in PAYSTACK_KEYS.md) |
| Webhook function | `/.netlify/functions/paystack-webhook` |
| Payment link | https://paystack.shop/pay/cortex-demo |

The code is written so that **only the environment variable value** needs to change. No code rewrite is required for the live switch.

---

## When the Director says “Ready for live switch”

### Founder steps (only at that moment)

1. Open Paystack Dashboard → toggle to **Live** mode.
2. Copy the **Live Secret Key** (`sk_live_...`).
3. Open Netlify → Site `cortex-platforms` → Environment variables.
4. Update `PAYSTACK_SECRET_KEY`:
   - Production context → paste `sk_live_...`
   - (Optional) keep `sk_test_...` only in the `dev` context if you still want test mode for local work.
5. (Recommended) Also set `PAYSTACK_PUBLIC_KEY` = `pk_live_...` for frontend if you use it.
6. In Paystack Dashboard (Live mode) → Settings → API Keys & Webhooks → set Webhook URL to:
   ```
   https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
   ```
7. Trigger a Netlify redeploy (or wait for the next deploy).
8. Do one small live test payment and confirm the webhook returns 200 and membership access is granted.

---

## Design principle

- One variable: `PAYSTACK_SECRET_KEY`
- Code already reads only this variable for HMAC verification.
- Switching test ↔ live is a configuration change, not a code change.
- This file is the permanent reminder so the switch stays clean and intentional.

---

**Status:** Placeholder active. Coding and wiring continue under test keys.  
**Next reminder:** Will be issued by the Acting Technical Director before system build conclusion.
