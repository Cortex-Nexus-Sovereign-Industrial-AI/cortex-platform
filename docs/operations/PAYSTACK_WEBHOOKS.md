# Paystack Webhooks — CINIS NEXUS

Configure Paystack so successful payments notify your platform automatically.

Official docs: https://paystack.com/docs/payments/webhooks/

---

## 1. Choose your webhook URL

### Option A — Netlify function (static site + serverless)

```
https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
```

### Option B — Express API on Render (recommended when JWT/SQLite backend is live)

```
https://<your-service>.onrender.com/api/webhooks/paystack
```

Example:
```
https://cortex-platform-api.onrender.com/api/webhooks/paystack
```

Use **one primary URL** in the Paystack dashboard for each mode (Test / Live).

---

## 2. Paystack Dashboard steps

1. Log in: https://dashboard.paystack.com  
2. Toggle **Test** or **Live** (top of dashboard) — configure **both** modes separately.  
3. Go to **Settings → API Keys & Webhooks**.  
4. Under **Webhook URL**, paste your URL from section 1.  
5. Save.  
6. Copy your **Secret Key** (`sk_test_...` or `sk_live_...`) — used for signature verification (not a separate “webhook secret”).

### Events you care about

| Event | Purpose |
|-------|--------|
| `charge.success` | Payment completed — grant access / mark order paid |

Paystack may send other events; the handlers log them and still return `200`.

---

## 3. Environment variables

### Netlify (Site settings → Environment variables)

| Variable | Value |
|----------|--------|
| `PAYSTACK_SECRET_KEY` | `sk_test_...` or `sk_live_...` |
| `PAYSTACK_PUBLIC_KEY` | `pk_test_...` or `pk_live_...` (frontend) |
| `API_BASE_URL` | Optional — e.g. `https://cortex-platform-api.onrender.com` to forward events to Express |

Redeploy Netlify after setting env vars.

### Render / local Express (`backend/.env`)

| Variable | Value |
|----------|--------|
| `PAYSTACK_SECRET_KEY` | Same secret key as above |
| `PAYSTACK_PUBLIC_KEY` | Public key |
| `JWT_SECRET` | Long random string |
| `FRONTEND_URL` | `https://cortex-platforms.netlify.app` |

---

## 4. How verification works

Paystack sends header:

```
x-paystack-signature: <hex>
```

Your server computes:

```js
crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
  .update(rawBody)
  .digest('hex')
```

Must match the header before processing. Respond **`200 OK`** quickly or Paystack retries.

**Paystack source IPs** (optional firewall allowlist):

- `52.31.139.75`
- `52.49.173.169`
- `52.214.14.220`

---

## 5. Test the webhook

### A. Dashboard test (if available)

Some Paystack accounts can send a test event from the dashboard after the URL is saved.

### B. Manual signature test (local)

```bash
# With backend running on :5000
BODY='{"event":"charge.success","data":{"reference":"TEST_REF","amount":100000,"status":"success","customer":{"email":"test@example.com"}}}'
SIG=$(node -e "const c=require('crypto');console.log(c.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(process.argv[1]).digest('hex'))" "$BODY")

curl -sS -X POST http://localhost:5000/api/webhooks/paystack \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: $SIG" \
  -d "$BODY"
```

### C. Real test payment

1. Use **Test mode** keys.  
2. Pay with Paystack test card (see Paystack docs — e.g. `4084084084084081`).  
3. Confirm webhook delivery in Paystack → **Settings → API Keys & Webhooks** / transaction logs.  
4. Check Netlify function logs or Render logs for `[paystack-webhook]` / payment verified.

---

## 6. What the platform does on `charge.success`

| Handler | Behavior |
|---------|----------|
| **Express** `POST /api/webhooks/paystack` | Verifies signature, marks/creates order completed, writes transaction, creates **access_grant** |
| **Netlify** `paystack-webhook` | Verifies signature, logs event, optionally forwards to `API_BASE_URL` |

For full member access grants, run the **Express API** (Render) and point Paystack at that URL, or set `API_BASE_URL` on Netlify so the function forwards.

---

## 7. Checklist

- [ ] Webhook URL saved in Paystack **Test** mode  
- [ ] Webhook URL saved in Paystack **Live** mode (when going live)  
- [ ] `PAYSTACK_SECRET_KEY` set on Netlify and/or Render  
- [ ] Netlify redeployed after env change  
- [ ] Test charge succeeds and logs show received event  
- [ ] Never commit secret keys to Git  

---

**Related:** [DEPLOY_CHECKLIST.md](../../DEPLOY_CHECKLIST.md) · [backend/README.md](../../backend/README.md)
