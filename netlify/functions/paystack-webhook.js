/**
 * CINIS NEXUS — Paystack Webhook (Netlify Function)
 * Idempotent: same event+reference returns 200 without re-side-effects on warm isolates.
 * Durable store = Express API when API_BASE_URL is set.
 *
 * URL: https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
 * Env: PAYSTACK_SECRET_KEY, optional API_BASE_URL
 */

const crypto = require('crypto');

const seen = global.__paystackSeen || (global.__paystackSeen = new Map());
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

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('[paystack-webhook] PAYSTACK_SECRET_KEY not set');
    return json(500, { error: 'Server misconfigured' });
  }

  const raw =
    event.isBase64Encoded && event.body
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : typeof event.body === 'string'
        ? event.body
        : JSON.stringify(event.body || {});

  const headers = normalizeHeaders(event.headers || {});
  const signature = headers['x-paystack-signature'] || '';
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');

  if (!safeEqual(expected, signature)) {
    console.warn('[paystack-webhook] Invalid signature');
    return json(400, { error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const eventName = payload.event || 'unknown';
  const data = payload.data || {};
  const reference = data.reference || null;
  const idemKey = reference ? `${eventName}::${reference}` : null;

  pruneSeen();
  if (idemKey && seen.has(idemKey)) {
    console.log('[paystack-webhook] idempotent warm-skip', idemKey);
    return json(200, {
      received: true,
      idempotent: true,
      event: eventName,
      reference,
      message: 'Already handled on this isolate'
    });
  }

  console.log('[paystack-webhook]', {
    event: eventName,
    reference,
    amountNgn: typeof data.amount === 'number' ? data.amount / 100 : null,
    email: data.customer && data.customer.email
  });

  if (eventName === 'charge.success') {
    const apiBase = process.env.API_BASE_URL;
    if (apiBase) {
      try {
        const res = await fetch(apiBase.replace(/\/$/, '') + '/api/webhooks/paystack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-paystack-signature': signature
          },
          body: raw
        });
        const body = await res.text();
        console.log('[paystack-webhook] forwarded to API', res.status, body.slice(0, 200));
      } catch (err) {
        console.warn('[paystack-webhook] Forward failed', err.message);
      }
    }
  }

  if (idemKey) seen.set(idemKey, Date.now());

  return json(200, {
    received: true,
    idempotent: false,
    event: eventName,
    reference
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
    'Access-Control-Allow-Headers': 'Content-Type, x-paystack-signature',
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
