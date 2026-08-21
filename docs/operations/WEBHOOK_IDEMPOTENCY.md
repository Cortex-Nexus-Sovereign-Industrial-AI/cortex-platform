# Webhook Durable Idempotency — CINIS NEXUS

**Platform:** Cortex Platform v2.3+  
**Store:** SQLite table `processed_webhooks` on the Express API

---

## Problem

Paystack (and most gateways) retry webhooks. Without a durable store, the same `charge.success` can:

- Grant access twice
- Mark revenue twice
- Fail after a process restart when only an in-memory map was used

Netlify function isolates are **ephemeral**. The in-memory `global.__paystackSeen` map is a warm-start optimization only — not the source of truth.

---

## Source of truth

| Layer | Role |
|-------|------|
| **Express API** `processed_webhooks` | Durable idempotency (SQLite, UNIQUE on event_type + reference) |
| **transactions.reference** UNIQUE | Secondary guard |
| **access_grants.transaction_reference** UNIQUE | Secondary guard |
| **Netlify** in-memory map | Optional warm skip only |

### Table

```sql
CREATE TABLE IF NOT EXISTS processed_webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  reference TEXT NOT NULL,
  paystack_id TEXT,
  status TEXT DEFAULT 'processed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_type, reference)
);
```

---

## Atomic claim pattern

1. Verify HMAC over **raw body** (timing-safe compare).
2. **Claim** the event:
   ```sql
   INSERT OR IGNORE INTO processed_webhooks (event_type, reference, paystack_id, status)
   VALUES (?, ?, ?, 'processing');
   ```
3. If `changes === 0` → another worker already claimed it → return `200` idempotent.
4. Process side effects (order, transaction, access_grant).
5. Update status to `processed` (or leave as inserted).

This avoids the race where two concurrent requests both pass a SELECT and both grant access.

---

## Netlify vs Express

| Setup | Behavior |
|-------|----------|
| Paystack → Express only | Full durable path |
| Paystack → Netlify, `API_BASE_URL` set | Netlify verifies + forwards; Express owns durability |
| Paystack → Netlify only | Signature + warm map only — **not durable across cold starts** |

**Production recommendation:** Point Paystack at Express, or set `API_BASE_URL` on Netlify so every verified event is claimed in SQLite.

---

## Signature rule

Always HMAC the **exact raw bytes** Paystack sent. Never `JSON.stringify(req.body)` after Express has parsed JSON (key order / spacing can break the hash).

---

## Related

- [PAYSTACK_WEBHOOKS.md](./PAYSTACK_WEBHOOKS.md)
- `backend/server.js` — `POST /api/webhooks/paystack`
- `netlify/functions/paystack-webhook.js`
