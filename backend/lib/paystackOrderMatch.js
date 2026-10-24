const PRIMARY_OFFER = Object.freeze({
  product: '30-Day AI Content System',
  amountKobo: 2200000,
  currency: 'NGN'
});

function matchesPrimaryOfferOrder({ order, data, customerEmail }) {
  if (!order || !data || data.status !== 'success') return false;
  const email = String(customerEmail || '').trim().toLowerCase();
  const orderEmail = String(order.email || '').trim().toLowerCase();

  return Boolean(
    order.product === PRIMARY_OFFER.product &&
    Number(order.amount_kobo) === PRIMARY_OFFER.amountKobo &&
    order.currency === PRIMARY_OFFER.currency &&
    Number(data.amount) === PRIMARY_OFFER.amountKobo &&
    data.currency === PRIMARY_OFFER.currency &&
    email &&
    email === orderEmail &&
    (!order.paystack_ref || order.paystack_ref === data.reference)
  );
}

module.exports = { PRIMARY_OFFER, matchesPrimaryOfferOrder };
