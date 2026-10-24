const test = require('node:test');
const assert = require('node:assert/strict');
const { claimWebhookEvent } = require('./webhookIdempotency');

test('claims a new event', async () => {
  const db = {
    dbRun: async () => ({ changes: 1, id: 7 }),
    dbGet: async () => { throw new Error('dbGet should not run for a new claim'); }
  };
  assert.deepEqual(await claimWebhookEvent(db, { eventType: 'charge.success', reference: 'r-new' }), { claimed: true, id: 7 });
});

test('treats processed events as idempotent', async () => {
  const db = {
    dbRun: async () => ({ changes: 0 }),
    dbGet: async () => ({ id: 3, status: 'processed', created_at: '2026-10-24 00:00:00' })
  };
  const result = await claimWebhookEvent(db, { eventType: 'charge.success', reference: 'r-done' });
  assert.equal(result.claimed, false);
  assert.equal(result.alreadyProcessed, true);
});

test('does not steal a recent processing claim', async () => {
  let reads = 0;
  const db = {
    dbRun: async (sql) => sql.startsWith('INSERT') ? { changes: 0 } : { changes: 0 },
    dbGet: async () => {
      reads++;
      return { id: 4, status: 'processing', created_at: '2026-10-24 00:00:00' };
    }
  };
  const result = await claimWebhookEvent(db, { eventType: 'charge.success', reference: 'r-busy' });
  assert.equal(result.claimed, false);
  assert.equal(result.alreadyProcessed, false);
  assert.equal(reads, 2);
});

test('reclaims an expired processing claim', async () => {
  const db = {
    dbRun: async (sql) => sql.startsWith('INSERT') ? { changes: 0 } : { changes: 1 },
    dbGet: async () => ({ id: 5, status: 'processing', created_at: '2026-10-23 00:00:00' })
  };
  const result = await claimWebhookEvent(db, { eventType: 'charge.success', reference: 'r-stale' });
  assert.equal(result.claimed, true);
  assert.equal(result.reclaimed, true);
  assert.equal(result.id, 5);
});

test('does not persist a claim when reference is missing', async () => {
  const db = { dbRun: async () => { throw new Error('must not write'); }, dbGet: async () => null };
  assert.deepEqual(await claimWebhookEvent(db, { eventType: 'charge.success', reference: null }), { claimed: true, ephemeral: true });
});
