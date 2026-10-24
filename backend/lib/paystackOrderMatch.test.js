const test = require('node:test');
const assert = require('node:assert/strict');
const { matchesPrimaryOfferOrder } = require('./paystackOrderMatch');

const order = {
  order_ref: 'CORTEX-TEST-001',
  product: '30-Day AI Content System',
  amount_kobo: 2200000,
  currency: 'NGN',
  email: 'buyer@example.com',
  status: 'pending',
  paystack_ref: null
};
const data = {
  status: 'success',
  reference: 'pay_test_001',
  amount: 2200000,
  currency: 'NGN'
};

test('accepts an exact successful primary-offer match', () => {
  assert.equal(matchesPrimaryOfferOrder({ order, data, customerEmail: 'BUYER@example.com' }), true);
});
test('rejects a missing order', () => {
  assert.equal(matchesPrimaryOfferOrder({ order: null, data, customerEmail: 'buyer@example.com' }), false);
});
test('rejects wrong amount', () => {
  assert.equal(matchesPrimaryOfferOrder({ order, data: { ...data, amount: 10000 }, customerEmail: 'buyer@example.com' }), false);
});
test('rejects wrong currency', () => {
  assert.equal(matchesPrimaryOfferOrder({ order, data: { ...data, currency: 'USD' }, customerEmail: 'buyer@example.com' }), false);
});
test('rejects wrong product', () => {
  assert.equal(matchesPrimaryOfferOrder({ order: { ...order, product: 'Other product' }, data, customerEmail: 'buyer@example.com' }), false);
});
test('rejects customer mismatch', () => {
  assert.equal(matchesPrimaryOfferOrder({ order, data, customerEmail: 'someone-else@example.com' }), false);
});
test('rejects a reference conflict', () => {
  assert.equal(matchesPrimaryOfferOrder({ order: { ...order, paystack_ref: 'other-ref' }, data, customerEmail: 'buyer@example.com' }), false);
});
test('rejects non-success event status', () => {
  assert.equal(matchesPrimaryOfferOrder({ order, data: { ...data, status: 'pending' }, customerEmail: 'buyer@example.com' }), false);
});
