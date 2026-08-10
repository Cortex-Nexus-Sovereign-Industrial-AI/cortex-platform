# Idempotency Handling — Paystack Webhooks

**Platform:** CINIS NEXUS / Cortex API v2.3

## Why

Paystack retries webhooks when it does not receive a timely `200 OK` (or on network failures). Without idempotency, retries can:

- Create duplicate orders
- Insert duplicate transactions
- Grant access more than once

## Design

### Express API (`backend/server.js`)

1. **`processed_webhooks` table**  
   `UNIQUE(event_type, reference)` — first successful process wins; later deliveries return `200` with `idempotent: true`.

2. **`transactions.reference` UNIQUE**  
   Second insert of the same Paystack reference is ignored (race-safe).

3. **`access_grants.transaction_reference` unique index**  
   One grant per payment reference.

4. **`orders.paystack_ref` unique index**  
   One order row per Paystack reference.

5. **Early exits**  
   - If `processed_webhooks` already has `(event, reference)` → skip  
   - If `transactions` already has `reference` with `status = verified` → skip  

Always responds **`200`** on duplicates so Paystack stops retrying.

### Netlify function

Warm-instance memory map skips obvious duplicates. **Durable** idempotency is on the Express API — set `API_BASE_URL` so Netlify forwards to Render/local backend.

## Response shapes

```json
{ "success": true, "idempotent": false, "message": "Payment verified and access granted", "reference": "..." }
```

```json
{ "success": true, "idempotent": true, "message": "Event already processed", "reference": "..." }
```

## Test

Send the same signed `charge.success` payload twice:

1. First → `idempotent: false`, grant created  
2. Second → `idempotent: true`, no new grant  

## Related

- [PAYSTACK_WEBHOOKS.md](./PAYSTACK_WEBHOOKS.md)
- [DEPLOY_CHECKLIST.md](../../DEPLOY_CHECKLIST.md)
