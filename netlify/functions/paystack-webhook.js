/**
 * Cortex Intelligence Nexus — Paystack webhook ingress.
 *
 * This function verifies Paystack's signature, validates the primary fixed offer,
 * and forwards verified events to the durable API. It does not itself grant access.
 *
 * Primary offer: 30-Day AI Content System — NGN 22,000 (2,200,000 kobo).
 * Secrets are configured only in Netlify environment settings.
 */
const crypto = require('crypto');

const seen = global.__paystackSeen || (global.__paystackSeen = new Map());
const SEEN_TTL_MS = 24 * 60 * 60 * 1000;
const PRIMARY_OFFER_AMOUNT_KOBO = 2200000;
const PRIMARY_OFFER_CURRENCY = 'NGN';

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('[paystack-webhook] PAYSTACK_SECRET_KEY not set');
    return json(500, { error: 'Server misconfigured' });
  }

  const raw = event.isBase64Encoded && event.body
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : typeof event.body === 'string' ? event.body : JSON.stringify(event.body || {});
  const headers = normalizeHeaders(event.headers || {});
  const signature = headers['x-paystack-signature'] || '';
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');

  if (!safeEqual(expected, signature)) {
    console.warn('[paystack-webhook] Invalid signature');
    return json(400, { error: 'Invalid signature' });
  }

  let payload;
  try { payload = JSON.parse(raw); }
  catch { return json(400, { error: 'Invalid JSON' }); }

  const eventName = payload.event || 'unknown';
  const data = payload.data || {};
  const reference = typeof data.reference === 'string' ? data.reference : null;
  const keyMode = secret.startsWith('sk_live_') ? 'live' : 'test';

  // Non-success events do not trigger paid fulfilment.
  if (eventName !== 'charge.success') {
    console.log('[paystack-webhook] verified non-success event', { event: eventName, reference, keyMode });
    return json(200, { received: true, event: eventName, reference, keyMode, fulfilment: 'not_applicable' });
  }

  // Validate before any dedupe or backend side effect. Do not silently fulfil
  // a different product, amount, or currency through the primary-offer path.
  if (data.status !== 'success' || !reference) {
    console.warn('[paystack-webhook] charge.success payload missing success status/reference', { reference });
    return json(400, { error: 'Invalid successful charge payload' });
  }
  if (data.amount !== PRIMARY_OFFER_AMOUNT_KOBO || data.currency !== PRIMARY_OFFER_CURRENCY) {
    console.error('[paystack-webhook] payment requires manual reconciliation', {
      reference, amount: data.amount, currency: data.currency, keyMode
    });
    // Acknowledge receipt to avoid endless retries, but explicitly do not forward
    // this unmatched payment into the primary offer's fulfilment path.
    return json(200, {
      received: true, event: eventName, reference, keyMode,
      fulfilment: 'blocked_amount_or_currency_mismatch',
      manualReviewRequired: true
    });
  }

  pruneSeen();
  const idemKey = `${eventName}::${reference}`;
  if (seen.has(idemKey)) {
    return json(200, { received: true, idempotent: true, event: eventName, reference, keyMode });
  }

  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) {
    console.error('[paystack-webhook] API_BASE_URL missing; verified event not durably recorded');
    // Return 5xx so Paystack retries. Do not mark the event as seen in memory.
    return json(500, { error: 'Durable payment processor unavailable; retry required' });
  }

  try {
    const res = await fetch(apiBase.replace(/\\/$/, '') + '/api/webhooks/paystack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-paystack-signature': signature },
      body: raw
    });
    const responseText = await res.text();
    if (!res.ok) {
      console.error('[paystack-webhook] durable API rejected event', { status: res.status, reference });
      return json(502, { error: 'Durable payment processor rejected event; retry required' });
    }

    // Only suppress duplicates after the durable API accepted the event.
    seen.set(idemKey, Date.now());
    console.log('[paystack-webhook] durable API accepted event', { reference, keyMode });
    return json(200, {
      received: true, idempotent: false, event: eventName, reference, keyMode,
      durableProcessorAccepted: true
    });
  } catch (err) {
    console.error('[paystack-webhook] durable API unavailable', { reference, message: err.message });
    return json(502, { error: 'Durable payment processor unavailable; retry required' });
  }
};

function pruneSeen() {
  const now = Date.now();
  for (const [key, timestamp] of seen.entries()) {
    if (now - timestamp > SEEN_TTL_MS) seen.delete(key);
  }
}
function normalizeHeaders(headers) {
  const out = {};
  for (const key of Object.keys(headers)) out[key.toLowerCase()] = headers[key];
  return out;
}
function safeEqual(a, b) {
  try {
    const left = Buffer.from(String(a), 'utf8');
    const right = Buffer.from(String(b), 'utf8');
    return left.length === right.length && crypto.timingSafeEqual(left, right);
  } catch { return false; }
}
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-paystack-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}
function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(), 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}
