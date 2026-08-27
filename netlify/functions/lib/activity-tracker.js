/**
 * Owner-only X ↔ Shopify activity loop helpers.
 * No secrets in source. Live publish is opt-in via ACTIVITY_TRACKER_LIVE=true.
 */
const crypto = require('crypto');

const MANDATORY_TAGS = '#MikeComplexAI #CINIS #Shopify';
const STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN || 'cortex-intelligence-nexus.myshopify.com';
const STOREFRONT = `https://${STORE_DOMAIN}`;
const INVENTORY_THRESHOLD = Number(process.env.ACTIVITY_INVENTORY_THRESHOLD || 3);
const TARGET_HANDLE = '@MikeComplexAie';
const OPERATOR = 'Michael Ujuku Morim (Mike Complex)';

function appendTags(text) {
  const body = String(text || '').trim();
  if (body.includes('#MikeComplexAI') && body.includes('#CINIS') && body.includes('#Shopify')) {
    return body;
  }
  const tagged = `${body}\n\n${MANDATORY_TAGS}`;
  return tagged.length <= 280 ? tagged : `${body.slice(0, 280 - MANDATORY_TAGS.length - 3)}\n\n${MANDATORY_TAGS}`;
}

function productUrl(product) {
  const handle = product && product.handle;
  if (handle) return `${STOREFRONT}/products/${handle}`;
  return STOREFRONT;
}

function composeFromShopify(topic, payload) {
  const t = String(topic || '').toLowerCase();
  if (t.includes('products/create') || t.includes('products/update') || t.includes('products/publish')) {
    const title = (payload && payload.title) || 'New Cortex offer';
    const status = payload && payload.status;
    if (t.includes('products/update') && status && status !== 'active') {
      return { action: 'skip', reason: 'product_not_active', text: null };
    }
    const desc = String((payload && (payload.body_html || payload.bodyHtml || '')) || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 90);
    const line = desc
      ? `Now live: ${title} — ${desc}`
      : `Now live from Cortex Intelligence Nexus: ${title}`;
    return {
      action: 'post',
      reason: 'product_event',
      text: appendTags(`${line}\n${productUrl(payload)}`)
    };
  }

  if (t.includes('inventory_levels/update')) {
    const available = Number(payload && (payload.available ?? payload.available_adjustment));
    if (!Number.isFinite(available)) {
      return { action: 'skip', reason: 'inventory_unreadable', text: null };
    }
    if (available <= INVENTORY_THRESHOLD) {
      return {
        action: 'post',
        reason: 'inventory_low',
        text: appendTags(
          `Inventory signal: ${available} unit(s) remaining on a Cortex SKU. Check the store before it goes dark.\n${STOREFRONT}`
        )
      };
    }
    return { action: 'skip', reason: 'inventory_above_threshold', text: null };
  }

  if (t.includes('orders/create')) {
    if (process.env.ACTIVITY_POST_ORDERS === 'true') {
      const name = (payload && payload.name) || 'order';
      return {
        action: 'post',
        reason: 'order_milestone_owner_gated',
        text: appendTags(`Commerce pulse: ${name} received. Pipeline live.\n${STOREFRONT}`)
      };
    }
    return { action: 'log_only', reason: 'orders_owner_gated', text: null };
  }

  if (t.includes('orders/updated')) {
    return { action: 'log_only', reason: 'order_update_no_public_post', text: null };
  }

  return { action: 'skip', reason: 'unmapped_topic', text: null };
}

function encryptRecord(plainObj) {
  const keyRaw = process.env.ACTIVITY_LOG_ENCRYPTION_KEY;
  const json = JSON.stringify(plainObj);
  if (!keyRaw) {
    return { alg: 'plain-owner-loop', ciphertext: json };
  }
  const key = crypto.createHash('sha256').update(String(keyRaw)).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    alg: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: enc.toString('base64')
  };
}

function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) =>
    '%' + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

function oauth1Header(method, url, extraParams, keys) {
  const oauth = {
    oauth_consumer_key: keys.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: keys.accessToken,
    oauth_version: '1.0'
  };
  const all = { ...oauth, ...(extraParams || {}) };
  const paramString = Object.keys(all)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(String(all[k]))}`)
    .join('&');
  const base = [method.toUpperCase(), percentEncode(url), percentEncode(paramString)].join('&');
  const signingKey = `${percentEncode(keys.apiSecret)}&${percentEncode(keys.accessSecret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(base).digest('base64');
  oauth.oauth_signature = signature;
  const header =
    'OAuth ' +
    Object.keys(oauth)
      .sort()
      .map((k) => `${percentEncode(k)}="${percentEncode(oauth[k])}"`)
      .join(', ');
  return header;
}

async function publishToX(text) {
  const live = process.env.ACTIVITY_TRACKER_LIVE === 'true';
  const apiKey = process.env.X_API_KEY || process.env.TWITTER_API_KEY;
  const apiSecret = process.env.X_API_SECRET || process.env.TWITTER_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN || process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_TOKEN_SECRET || process.env.TWITTER_ACCESS_SECRET;

  if (!live) {
    return { status: 'queued', mode: 'dry-run', id: null, url: null };
  }
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { status: 'failed', mode: 'live-missing-creds', id: null, url: null };
  }

  const url = 'https://api.twitter.com/2/tweets';
  const auth = oauth1Header('POST', url, {}, { apiKey, apiSecret, accessToken, accessSecret });
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      status: 'failed',
      mode: 'live',
      id: null,
      url: null,
      error: body && (body.detail || body.title || JSON.stringify(body).slice(0, 180))
    };
  }
  const id = body.data && body.data.id;
  return {
    status: 'posted',
    mode: 'live',
    id,
    url: id ? `https://x.com/${TARGET_HANDLE.replace('@', '')}/status/${id}` : null
  };
}

function buildLogEntry({ topic, payload, decision, publish }) {
  const productId = payload && (payload.id || payload.product_id || payload.admin_graphql_api_id);
  return {
    ts: new Date().toISOString(),
    shopify_event: {
      topic,
      id: payload && payload.id ? String(payload.id) : null,
      product_id: productId ? String(productId) : null
    },
    x_post: {
      id: publish && publish.id,
      text_preview: decision && decision.text ? decision.text.slice(0, 140) : null,
      url: publish && publish.url
    },
    tags: ['#MikeComplexAI', '#CINIS', '#Shopify'],
    metrics_snapshot: { likes: 0, reposts: 0, replies: 0, views: 0 },
    status: publish ? publish.status : decision.action,
    reason: decision.reason,
    operator: OPERATOR,
    target: TARGET_HANDLE,
    mode: publish && publish.mode
  };
}

module.exports = {
  MANDATORY_TAGS,
  composeFromShopify,
  encryptRecord,
  publishToX,
  buildLogEntry,
  TARGET_HANDLE,
  OPERATOR
};
