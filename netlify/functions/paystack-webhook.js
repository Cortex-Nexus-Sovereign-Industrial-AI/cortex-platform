const crypto = require('crypto');
const { PrismaClient, Prisma } = require('@prisma/client');

// Reuse Prisma client between invocations (for serverless environments)
if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}
const prisma = global.__prisma;

exports.handler = async function (event, context) {
  // Netlify functions provide raw body as a string in event.body
  const raw = typeof event.body === 'string' ? event.body : JSON.stringify(event.body || {});

  const headers = {};
  // Normalize headers to lowercase keys for easier access
  for (const k of Object.keys(event.headers || {})) headers[k.toLowerCase()] = event.headers[k];

  const signature = String(headers['x-paystack-signature'] || headers['x-paystack-signature'.toUpperCase()] || '');
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  if (!secret) {
    console.error('PAYSTACK_WEBHOOK_SECRET not configured');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  // Compute expected HMAC-SHA512 hex digest
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');

  // Timing-safe compare
  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      console.warn('Paystack signature mismatch', { expected, received: signature });
      return { statusCode: 400, body: 'Invalid signature' };
    }
  } catch (err) {
    console.warn('Signature compare failed', err);
    return { statusCode: 400, body: 'Invalid signature' };
  }

  // Parse JSON payload
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    console.warn('Invalid JSON payload', err);
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const txRef = payload?.data?.reference;
  if (!txRef) return { statusCode: 400, body: 'Missing reference' };

  // Idempotent processing using Prisma
  try {
    // 1) Try to insert payment event; if it already exists, treat as duplicate
    const eventRow = await prisma.paymentEvent.create({
      data: {
        gateway: 'paystack',
        transaction_reference: txRef,
        payload: payload,
        headers: headers,
      },
    });

    // 2) Process business logic inside a transaction. Create ledger row.
    // Normalize amount: Paystack often sends amount in kobo (integer)
    const amountRaw = payload?.data?.amount;
    const amountNumeric = typeof amountRaw === 'number' ? amountRaw / 100 : 0;

    try {
      await prisma.$transaction(async (tx) => {
        await tx.revenueLedger.create({
          data: {
            transaction_id: txRef,
            gateway: 'paystack',
            amount_numeric: amountNumeric,
            metadata: payload,
          },
        });

        await tx.paymentEvent.update({
          where: { id: eventRow.id },
          data: { processed: true, processed_at: new Date() },
        });
      });

      return { statusCode: 200, body: JSON.stringify({ message: 'Processed' }) };
    } catch (err) {
      // If ledger insert failed due to unique constraint, someone already processed the ledger
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        // Mark the event as processed for consistency
        await prisma.paymentEvent.update({ where: { id: eventRow.id }, data: { processed: true, processed_at: new Date() } });
        return { statusCode: 200, body: JSON.stringify({ message: 'Duplicate - ledger already exists' }) };
      }
      console.error('Processing transaction failed', err);
      return { statusCode: 500, body: 'Processing failed' };
    }
  } catch (err) {
    // If creating paymentEvent failed due to unique constraint, it's a duplicate delivery
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return { statusCode: 200, body: JSON.stringify({ message: 'Duplicate - already processed' }) };
    }

    console.error('Failed to record payment event', err);
    return { statusCode: 500, body: 'Failed' };
  }
};
