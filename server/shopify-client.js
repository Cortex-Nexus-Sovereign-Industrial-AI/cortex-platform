/**
 * Cortex Nexus - Shopify Admin Connector
 * Store: cortex-intelligence-nexus.myshopify.com
 * App: 396467634177
 * Secure - uses env vars, never hardcode secrets
 */

const STORE = process.env.SHOPIFY_STORE_DOMAIN || 'cortex-intelligence-nexus.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = '2024-10';

if (!TOKEN) console.warn('[Shopify] Missing SHOPIFY_ADMIN_TOKEN in env');

const baseUrl = `https://${STORE}/admin/api/${API_VERSION}`;

async function gql(query, variables = {}) {
  const res = await fetch(`${baseUrl}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function rest(path, method = 'GET', body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Shopify ${method} ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export const shopify = {
  // PRODUCTS
  createProduct: ({ title, description, price, sku, inventory = 10 }) =>
    gql(`
      mutation create($input: ProductInput!) {
        productCreate(input: $input) { product { id title handle } userErrors { message } }
      }`, {
      input: {
        title,
        descriptionHtml: description,
        variants: [{ price, sku, inventoryQuantities: { availableQuantity: inventory } }]
      }
    }),

  listProducts: (first = 10) =>
    gql(`{ products(first: ${first}) { nodes { id title handle status totalInventory } } }`),

  // ORDERS
  listOrders: (first = 10) =>
    gql(`{ orders(first: ${first}, sortKey: CREATED_AT, reverse: true) { nodes { id name totalPriceSet { shopMoney { amount } } displayFulfillmentStatus } } }`),

  // INVENTORY
  updateInventory: (inventoryItemId, locationId, available) =>
    gql(`mutation { inventoryAdjustQuantities(input: { reason: "correction", name: "available", changes: [{ inventoryItemId: "${inventoryItemId}", locationId: "${locationId}", delta: ${available} }] }) { userErrors { message } } }`),

  // WEBHOOKS - register Pub/Sub or HTTP
  registerWebhook: (topic, callbackUrlOrPubSub) => {
    const isPubSub = callbackUrlOrPubSub.startsWith('pubsub://');
    return gql(`
      mutation webhookCreate($topic: WebhookSubscriptionTopic!, $sub: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $sub) {
          webhookSubscription { id } userErrors { message }
        }
      }`, {
      topic,
      sub: isPubSub 
        ? { pubSubWebhookSubscription: { pubSubProject: callbackUrlOrPubSub.split('/')[2], pubSubTopic: callbackUrlOrPubSub.split('/').pop() } }
        : { callbackUrl: callbackUrlOrPubSub, format: JSON }
    });
  }
};

export default shopify;
