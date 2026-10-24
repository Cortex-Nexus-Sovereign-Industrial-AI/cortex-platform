/**
 * Durable webhook idempotency helpers (SQLite processed_webhooks).
 * Atomic claim prevents double-processing under concurrent retries.
 */

const crypto = require('crypto');

function safeEqualHex(a, b) {
  try {
    const ba = Buffer.from(String(a), 'utf8');
    const bb = Buffer.from(String(b), 'utf8');
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/**
 * Verify Paystack HMAC-SHA512 over raw body string.
 * @param {string} rawBody
 * @param {string} signatureHeader
 * @param {string} secret
 */
function verifyPaystackRaw(rawBody, signatureHeader, secret) {
  if (!secret || !signatureHeader) return false;
  const expected = crypto.createHmac('sha512', secret).update(rawBody, 'utf8').digest('hex');
  return safeEqualHex(expected, signatureHeader);
}

/**
 * Atomically claim an event. Returns { claimed: true } or { claimed: false, existing }.
 * @param {{ dbRun: Function, dbGet: Function }} db
 * @param {{ eventType: string, reference: string, paystackId?: string|null }}
 */
async function claimWebhookEvent(db, { eventType, reference, paystackId }) {
  if (!reference) {
    return { claimed: true, ephemeral: true };
  }
  const result = await db.dbRun(
    `INSERT OR IGNORE INTO processed_webhooks (event_type, reference, paystack_id, status)
     VALUES (?, ?, ?, 'processing')`,
    [eventType || 'unknown', reference, paystackId != null ? String(paystackId) : null]
  );
  if (result.changes === 0) {
    let existing = await db.dbGet(
      'SELECT id, status, created_at FROM processed_webhooks WHERE event_type = ? AND reference = ?',
      [eventType || 'unknown', reference]
    );

    if (existing && existing.status === 'processed') {
      return { claimed: false, existing, alreadyProcessed: true };
    }

    // Recover a claim left behind by a crashed/failed handler. The guarded
    // update is atomic; only one retry can reclaim an expired processing row.
    const reclaimed = await db.dbRun(
      `UPDATE processed_webhooks
          SET status = 'processing', created_at = CURRENT_TIMESTAMP,
              paystack_id = COALESCE(?, paystack_id)
        WHERE event_type = ? AND reference = ? AND status != 'processed'
          AND datetime(created_at) < datetime('now', '-2 minutes')`,
      [paystackId != null ? String(paystackId) : null, eventType || 'unknown', reference]
    );
    if (reclaimed.changes > 0) {
      return { claimed: true, id: existing && existing.id, reclaimed: true };
    }

    existing = await db.dbGet(
      'SELECT id, status, created_at FROM processed_webhooks WHERE event_type = ? AND reference = ?',
      [eventType || 'unknown', reference]
    );
    return { claimed: false, existing, alreadyProcessed: Boolean(existing && existing.status === 'processed') };
  }
  return { claimed: true, id: result.id };
}

async function markWebhookProcessed(db, { eventType, reference }) {
  if (!reference) return;
  await db.dbRun(
    `UPDATE processed_webhooks SET status = 'processed' WHERE event_type = ? AND reference = ?`,
    [eventType || 'unknown', reference]
  );
}

module.exports = {
  safeEqualHex,
  verifyPaystackRaw,
  claimWebhookEvent,
  markWebhookProcessed
};
