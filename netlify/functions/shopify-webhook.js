/**
 * CINIS NEXUS — Shopify webhook → X Activity Tracker (Netlify Function)
 * HMAC-validated, idempotent on warm isolates.
 * Live X publish only when ACTIVITY_TRACKER_LIVE=true and X_* credentials are set.
 *
 * URLs:
 *   https://cortex-platforms.netlify.app/.netlify/functions/shopify-webhook
 *   https://cortex-platforms.netlify.app/api/webhooks/shopify
 *
 * Env: SHOPIFY_WEBHOOK_SECRET, optional X_API_*, ACTIVITY_TRACKER_LIVE,
 *      ACTIVITY_LOG_ENCRYPTION_KEY, ACTIVITY_POST_ORDERS, ACTIVITY_INVENTORY_THRESHOLD
 */
const crypto = require('crypto');
const tracker = require('./lib/activity-tracker');

const seen = global.__shopifySeen || (global.__shopifySeen = new Map());
const SEEN_TTL_MS = 24 * 60 * 60 * 1000;

function pruneSeen() {
  const now = Date.now();
  for (const [k, t] of seen.entries()) {
    if (now - t > SEEN_TTL_MS) seen.delete(k);
  }
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  const raw =
    event.isBase64Encoded && event.body
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : typeof event.body === 'string'
        ? event.body
        : JSON.stringify(event.body || {});

  const headers = normalizeHeaders(event.headers || {});
  const topic = headers['x-shopify-topic'] || 'unknown';
  const webhookId = headers['x-shopify-webhook-id'] || '';
  const hmac = headers['x-shopify-hmac-sha256'] || '';

  if (secret) {
    const expected = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('base64');
    if (!safeEqual(expected, hmac)) {
      console.warn('[shopify-webhook] Invalid HMAC');
      return json(401, { error: 'Invalid HMAC' });
    }
  } else {
    console.warn('[shopify-webhook] SHOPIFY_WEBHOOK_SECRET unset — signature not verified');
  }

  let payload;
  try {
    payload = JSON.parse(raw || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const idemKey = webhookId || `${topic}::${payload && payload.id}::${payload && payload.updated_at}`;
  pruneSeen();
  if (idemKey && seen.has(idemKey)) {
    return json(200, { received: true, idempotent: true, topic });
  }

  const decision = tracker.composeFromShopify(topic, payload);
  let publish = { status: decision.action, mode: 'none', id: null, url: null };

  if (decision.action === 'post' && decision.text) {
    try {
      publish = await tracker.publishToX(decision.text);
    } catch (err) {
      publish = { status: 'failed', mode: 'exception', id: null, url: null, error: err.message };
    }
  }

  const record = tracker.buildLogEntry({ topic, payload, decision, publish });
  const sealed = tracker.encryptRecord(record);
  console.log('[shopify-activity]', {
    topic,
    action: decision.action,
    reason: decision.reason,
    publish: publish.status,
    mode: publish.mode,
    xId: publish.id || null,
    sealedAlg: sealed.alg
  });

  if (idemKey) seen.set(idemKey, Date.now());

  return json(200, {
    received: true,
    topic,
    action: decision.action,
    reason: decision.reason,
    publish: publish.status,
    mode: publish.mode,
    x_post_id: publish.id || null,
    operator: tracker.OPERATOR,
    target: tracker.TARGET_HANDLE
  });
};

function normalizeHeaders(h) {
  const out = {};
  for (const k of Object.keys(h)) out[k.toLowerCase()] = h[k];
  return out;
}

function safeEqual(a, b) {
  try {
    const ba = Buffer.from(String(a), 'utf8');
    const bb = Buffer.from(String(b), 'utf8');
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Shopify-Hmac-Sha256, X-Shopify-Topic, X-Shopify-Webhook-Id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body)
  };
}
