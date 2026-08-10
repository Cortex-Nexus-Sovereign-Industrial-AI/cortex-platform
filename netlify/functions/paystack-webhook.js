/**
 * CINIS NEXUS — Paystack Webhook (Netlify Function)
 *
 * URL (after deploy):
 *   https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook
 *   https://cortex-platforms.netlify.app/api/paystack-webhook  (if redirected)
 *
 * Signature: HMAC-SHA512 of raw body using PAYSTACK_SECRET_KEY
 * (Paystack secret key = sk_test_... or sk_live_...)
 *
 * Env (Netlify → Site settings → Environment variables):
 *   PAYSTACK_SECRET_KEY=sk_test_... or sk_live_...
 */

const crypto = require('crypto');

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('[paystack-webhook] PAYSTACK_SECRET_KEY not set');
    return json(500, { error: 'Server misconfigured' });
  }

  // Raw body required for signature verification
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
  } catch (err) {
    return json(400, { error: 'Invalid JSON' });
  }

  const eventName = payload.event || 'unknown';
  const data = payload.data || {};
  const reference = data.reference || null;
  const amountKobo = typeof data.amount === 'number' ? data.amount : null;
  const amountNgn = amountKobo != null ? amountKobo / 100 : null;
  const email = (data.customer && data.customer.email) || null;

  // Acknowledge immediately — Paystack times out around 30s
  console.log('[paystack-webhook]', {
    event: eventName,
    reference,
    amountNgn,
    email,
    status: data.status
  });

  // Business handling: charge.success is the primary fulfillment event
  if (eventName === 'charge.success') {
    // Optional: forward to Express API if configured
    const apiBase = process.env.API_BASE_URL; // e.g. https://cortex-platform-api.onrender.com
    if (apiBase) {
      try {
        await fetch(apiBase.replace(/\/$/, '') + '/api/webhooks/paystack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-paystack-signature': signature
          },
          body: raw
        });
      } catch (err) {
        console.warn('[paystack-webhook] Forward to API failed', err.message);
        // Still return 200 so Paystack does not retry endlessly for forward failures
      }
    }
  }

  return json(200, {
    received: true,
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
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    },
    body: JSON.stringify(body)
  };
}
