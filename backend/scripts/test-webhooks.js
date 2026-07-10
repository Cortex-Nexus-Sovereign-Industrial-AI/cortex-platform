#!/usr/bin/env node

/**
 * CORTEX PLATFORM v2.1 — Webhook Testing Script
 * Phase 3: Simulate Paystack webhook events locally
 * 
 * Usage:
 *   node scripts/test-webhooks.js [event-type] [webhook-url]
 * 
 * Examples:
 *   node scripts/test-webhooks.js charge.success http://localhost:8080/api/webhooks/paystack
 *   node scripts/test-webhooks.js charge.failed http://localhost:8080/api/webhooks/paystack
 * 
 * Supported Events:
 *   - charge.success (successful payment)
 *   - charge.failed (failed payment)
 *   - charge.refunded (refund issued)
 *   - customer.identification.success
 */

const http = require('http');
const crypto = require('crypto');

// Configuration
const WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET || 'whsec_test_secret_key_here';
const DEFAULT_WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:8080/api/webhooks/paystack';
const DEFAULT_EVENT = process.env.EVENT_TYPE || 'charge.success';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function log(type, message, data = null) {
  const timestamp = new Date().toISOString();
  const prefix = {
    'INFO': `${colors.blue}[INFO]${colors.reset}`,
    'SUCCESS': `${colors.green}[SUCCESS]${colors.reset}`,
    'SEND': `${colors.blue}[SEND]${colors.reset}`,
    'RECV': `${colors.green}[RECV]${colors.reset}`,
    'WARN': `${colors.yellow}[WARN]${colors.reset}`,
    'ERROR': `${colors.red}[ERROR]${colors.reset}`
  }[type] || type;

  console.log(`${prefix} [${timestamp}] ${message}`);
  if (data) {
    console.log(colors.gray + JSON.stringify(data, null, 2) + colors.reset);
  }
}

// ============================================
// MOCK PAYSTACK EVENTS
// ============================================

const MOCK_EVENTS = {
  'charge.success': {
    event: 'charge.success',
    data: {
      id: Math.floor(Math.random() * 1000000),
      status: 'success',
      reference: `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: 500000, // ₦5,000 in kobo
      paid_at: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      customer: {
        id: 12345,
        email: 'test@cortex-platform.com',
        customer_code: 'CUS_1234567890',
        first_name: 'Test',
        last_name: 'User',
        phone: '+2349010251577'
      },
      authorization: {
        authorization_code: 'AUTH_4n3kz9n' + Date.now(),
        bin: '408408',
        last4: '0845',
        exp_month: '12',
        exp_year: '2026',
        channel: 'card',
        card_type: 'visa',
        bank: 'Test Bank',
        country_code: 'NG',
        brand: 'visa',
        reusable: true,
        signature: 'SIG_' + crypto.randomBytes(10).toString('hex')
      },
      order_id: `ORD_${Date.now()}`,
      currency: 'NGN',
      ip_address: '192.168.1.100',
      fees: 7500,
      gateway_response: 'Successful',
      message: 'Authorized',
      channel: 'card'
    }
  },

  'charge.failed': {
    event: 'charge.failed',
    data: {
      id: Math.floor(Math.random() * 1000000),
      status: 'failed',
      reference: `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: 500000,
      paid_at: null,
      paidAt: null,
      customer: {
        id: 12345,
        email: 'test@cortex-platform.com',
        customer_code: 'CUS_1234567890',
        first_name: 'Test',
        last_name: 'User'
      },
      authorization: null,
      gateway_response: 'Insufficient Funds',
      message: 'Charge declined',
      currency: 'NGN',
      ip_address: '192.168.1.100'
    }
  },

  'charge.refunded': {
    event: 'charge.refunded',
    data: {
      id: Math.floor(Math.random() * 1000000),
      status: 'success',
      reference: `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: 500000,
      refunded_at: new Date().toISOString(),
      customer: {
        id: 12345,
        email: 'test@cortex-platform.com',
        customer_code: 'CUS_1234567890'
      },
      currency: 'NGN',
      message: 'Charge refunded',
      refund_amount: 500000
    }
  },

  'customer.identification.success': {
    event: 'customer.identification.success',
    data: {
      id: 12345,
      customer_code: 'CUS_1234567890',
      email: 'test@cortex-platform.com',
      first_name: 'Test',
      last_name: 'User',
      phone: '+2349010251577',
      identified: true,
      identification: {
        type: 'bvn',
        value: '12345678901'
      }
    }
  }
};

// ============================================
// WEBHOOK SIGNATURE & SENDING
// ============================================

function generateWebhookSignature(payload) {
  /**
   * Paystack uses HMAC-SHA512 for webhook signatures
   * Signature = hex(HMAC-SHA512(SECRET_KEY, payload))
   */
  return crypto
    .createHmac('sha512', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
}

function sendWebhook(webhookUrl, eventData) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(eventData);
    const signature = generateWebhookSignature(payload);

    const url = new URL(webhookUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-paystack-signature': signature
      }
    };

    log('SEND', `Sending webhook to ${webhookUrl}`, {
      event: eventData.event,
      signature: signature,
      payload_size: Buffer.byteLength(payload)
    });

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        log('RECV', `Webhook response received`, {
          status_code: res.statusCode,
          status_message: res.statusMessage,
          response: responseData ? JSON.parse(responseData) : null
        });

        if (res.statusCode >= 200 && res.statusCode < 300) {
          log('SUCCESS', 'Webhook delivered successfully');
          resolve({ status: res.statusCode, data: responseData });
        } else {
          log('WARN', `Webhook returned status ${res.statusCode}`);
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      log('ERROR', `Webhook request failed: ${error.message}`);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  const eventType = process.argv[2] || DEFAULT_EVENT;
  const webhookUrl = process.argv[3] || DEFAULT_WEBHOOK_URL;

  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}CORTEX PLATFORM — Webhook Test Simulator${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  // Validate event type
  if (!MOCK_EVENTS[eventType]) {
    log('ERROR', `Unknown event type: ${eventType}`);
    console.log(`\n${colors.yellow}Supported Events:${colors.reset}`);
    Object.keys(MOCK_EVENTS).forEach((event) => {
      console.log(`  • ${event}`);
    });
    process.exit(1);
  }

  try {
    log('INFO', `Testing webhook event: ${colors.yellow}${eventType}${colors.reset}`);
    log('INFO', `Target URL: ${colors.yellow}${webhookUrl}${colors.reset}`);
    log('INFO', `Webhook Secret: ${colors.yellow}${WEBHOOK_SECRET.substring(0, 10)}...${colors.reset}`);

    const eventData = MOCK_EVENTS[eventType];
    await sendWebhook(webhookUrl, eventData);

    console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.green}✓ Test Complete${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

    process.exit(0);
  } catch (error) {
    log('ERROR', `Test failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { MOCK_EVENTS, sendWebhook, generateWebhookSignature };
