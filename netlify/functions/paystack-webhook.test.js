const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const secret = 'sk_test_cortex_webhook_unit_test_secret';
process.env.PAYSTACK_SECRET_KEY = secret;
delete process.env.API_BASE_URL;
const { handler } = require('./paystack-webhook');

function signedEvent(data, eventName = 'charge.success') {
  const body = JSON.stringify({ event: eventName, data });
  return {
    httpMethod: 'POST',
    headers: { 'x-paystack-signature': crypto.createHmac('sha512', secret).update(body).digest('hex') },
    body
  };
}
function responseBody(response) { return JSON.parse(response.body); }

test('rejects an invalid Paystack signature', async () => {
  const response = await handler({
    httpMethod: 'POST', headers: { 'x-paystack-signature': 'invalid' },
    body: JSON.stringify({ event: 'charge.success', data: {} })
  });
  assert.equal(response.statusCode, 400);
});

test('blocks the primary offer path for wrong amount or currency', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls++; return { ok: true, status: 200, text: async () => '{}' }; };
  try {
    const response = await handler(signedEvent({
      status: 'success', reference: 'unit-wrong-amount', amount: 10000, currency: 'NGN'
    }));
    assert.equal(response.statusCode, 200);
    assert.equal(responseBody(response).manualReviewRequired, true);
    assert.equal(calls, 0);
  } finally { global.fetch = originalFetch; }
});

test('returns retryable failure when durable API is absent', async () => {
  delete process.env.API_BASE_URL;
  const response = await handler(signedEvent({
    status: 'success', reference: 'unit-api-missing', amount: 2200000, currency: 'NGN'
  }));
  assert.equal(response.statusCode, 500);
});

test('does not mark an event seen until the durable API accepts it', async () => {
  const originalFetch = global.fetch;
  const ref = 'unit-retry-after-failure';
  let calls = 0;
  try {
    process.env.API_BASE_URL = 'https://backend.example.invalid';
    global.fetch = async () => {
      calls++;
      if (calls === 1) throw new Error('temporary outage');
      return { ok: true, status: 200, text: async () => '{}' };
    };
    const event = signedEvent({ status: 'success', reference: ref, amount: 2200000, currency: 'NGN' });
    assert.equal((await handler(event)).statusCode, 502);
    assert.equal((await handler(event)).statusCode, 200);
    assert.equal(calls, 2);
    assert.equal(responseBody(await handler(event)).idempotent, true);
    assert.equal(calls, 2);
  } finally {
    global.fetch = originalFetch;
    delete process.env.API_BASE_URL;
  }
});
