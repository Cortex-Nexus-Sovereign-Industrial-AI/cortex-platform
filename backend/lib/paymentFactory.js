const DEFAULT_PROVIDER_ORDER = ['paystack', 'flutterwave', 'stripe', 'manual'];

function normalizeTransaction({
  provider,
  providerTransactionId,
  reference,
  amount,
  currency,
  status,
  customerEmail,
  channel,
  metadata = {},
}) {
  return {
    provider: provider || 'unknown',
    provider_transaction_id: providerTransactionId || reference || null,
    reference: reference || `CORTEX-${Date.now()}`,
    amount: Number(amount || 0),
    currency: currency || 'NGN',
    status: status || 'pending',
    customer_email: customerEmail || metadata.email || null,
    channel: channel || 'checkout',
    metadata: metadata || {},
    created_at: new Date().toISOString()
  };
}

class PaymentGatewayAdapter {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.enabled = Boolean(config.enabled);
  }

  async initialize() {
    return { provider: this.name, enabled: this.enabled };
  }

  async createCheckout(payload) {
    throw new Error(`${this.name} adapter must implement createCheckout()`);
  }

  async verifyTransaction(reference) {
    throw new Error(`${this.name} adapter must implement verifyTransaction()`);
  }

  async handleWebhook(rawBody, headers) {
    throw new Error(`${this.name} adapter must implement handleWebhook()`);
  }

  normalizeWebhook(payload) {
    return normalizeTransaction({
      provider: this.name,
      providerTransactionId: payload.id || payload.transaction_id || null,
      reference: payload.reference || payload.tx_ref || payload.data?.reference || null,
      amount: payload.amount || payload.data?.amount || payload.total_amount || 0,
      currency: payload.currency || payload.data?.currency || 'NGN',
      status: payload.status || payload.data?.status || 'pending',
      customerEmail: payload.customer_email || payload.customer?.email || payload.data?.customer?.email || null,
      channel: payload.channel || payload.data?.channel || 'checkout',
      metadata: payload.metadata || payload.data?.metadata || {}
    });
  }
}

class PaystackAdapter extends PaymentGatewayAdapter {
  constructor(config = {}) {
    super('paystack', config);
  }

  async createCheckout(payload) {
    return {
      provider: 'paystack',
      checkout_url: `https://paystack.com/pay/${payload.reference || 'demo'}`,
      reference: payload.reference,
      status: 'created'
    };
  }

  async verifyTransaction(reference) {
    return {
      provider: 'paystack',
      reference,
      status: 'verified',
      verified: true
    };
  }

  async handleWebhook(rawBody, headers) {
    const parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    return this.normalizeWebhook(parsed);
  }
}

class FlutterwaveAdapter extends PaymentGatewayAdapter {
  constructor(config = {}) {
    super('flutterwave', config);
  }

  async createCheckout(payload) {
    return {
      provider: 'flutterwave',
      checkout_url: `https://checkout.flutterwave.com/pay/${payload.reference || 'demo'}`,
      reference: payload.reference,
      status: 'created'
    };
  }

  async verifyTransaction(reference) {
    return {
      provider: 'flutterwave',
      reference,
      status: 'verified',
      verified: true
    };
  }

  async handleWebhook(rawBody, headers) {
    const parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    return this.normalizeWebhook(parsed);
  }
}

class StripeAdapter extends PaymentGatewayAdapter {
  constructor(config = {}) {
    super('stripe', config);
  }

  async createCheckout(payload) {
    return {
      provider: 'stripe',
      checkout_url: `https://checkout.stripe.com/pay/${payload.reference || 'demo'}`,
      reference: payload.reference,
      status: 'created'
    };
  }

  async verifyTransaction(reference) {
    return {
      provider: 'stripe',
      reference,
      status: 'verified',
      verified: true
    };
  }

  async handleWebhook(rawBody, headers) {
    const parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    return this.normalizeWebhook(parsed);
  }
}

class ManualTransferAdapter extends PaymentGatewayAdapter {
  constructor(config = {}) {
    super('manual', config);
  }

  async createCheckout(payload) {
    return {
      provider: 'manual',
      checkout_url: null,
      reference: payload.reference,
      status: 'pending_manual_verification'
    };
  }

  async verifyTransaction(reference) {
    return {
      provider: 'manual',
      reference,
      status: 'verified',
      verified: true
    };
  }

  async handleWebhook(rawBody, headers) {
    return normalizeTransaction({
      provider: 'manual',
      providerTransactionId: null,
      reference: rawBody?.reference || null,
      amount: rawBody?.amount || 0,
      currency: rawBody?.currency || 'NGN',
      status: rawBody?.status || 'pending_manual_verification',
      customerEmail: rawBody?.customer_email || null,
      channel: 'manual_transfer',
      metadata: rawBody?.metadata || {}
    });
  }
}

function createProviderAdapter({ provider, config = {} }) {
  const providerName = (provider || 'paystack').toLowerCase();

  const adapterMap = {
    paystack: () => new PaystackAdapter(config),
    flutterwave: () => new FlutterwaveAdapter(config),
    stripe: () => new StripeAdapter(config),
    manual: () => new ManualTransferAdapter(config),
    bank: () => new ManualTransferAdapter(config),
    wallet: () => new ManualTransferAdapter(config)
  };

  const factory = adapterMap[providerName];
  if (!factory) {
    throw new Error(`Unsupported provider: ${providerName}`);
  }

  return factory();
}

function getProviderForContext({
  productType,
  country,
  isLocalPhysicalJob,
  userPreference,
  useFallback = true
}) {
  const normalizedCountry = (country || '').toUpperCase();
  const preferred = (userPreference || '').toLowerCase();

  if (isLocalPhysicalJob) {
    return 'manual';
  }

  if (preferred && ['paystack', 'flutterwave', 'stripe', 'manual'].includes(preferred)) {
    return preferred;
  }

  if (productType === 'digital' && normalizedCountry === 'NG') {
    return 'paystack';
  }

  if (normalizedCountry === 'NG' && useFallback) {
    return 'flutterwave';
  }

  if (normalizedCountry !== 'NG') {
    return 'stripe';
  }

  return DEFAULT_PROVIDER_ORDER[0];
}

module.exports = {
  PaymentGatewayAdapter,
  PaystackAdapter,
  FlutterwaveAdapter,
  StripeAdapter,
  ManualTransferAdapter,
  createProviderAdapter,
  getProviderForContext,
  normalizeTransaction
};
