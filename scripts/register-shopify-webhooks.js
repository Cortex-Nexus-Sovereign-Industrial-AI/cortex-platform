#!/usr/bin/env node
/**
 * Upsert Shopify webhooks via Admin GraphQL API
 *
 * Usage:
 *   SHOPIFY_STORE_DOMAIN="cortex-intelligence-nexus.myshopify.com" \
 *   SHOPIFY_ADMIN_TOKEN="shpat_xxx" \
 *   WEBHOOK_CALLBACK_URL="https://cortex-platforms.netlify.app/api/webhooks/shopify" \
 *   node scripts/register-shopify-webhooks.js
 *
 * Topics include commerce + Activity Tracker product events.
 * Duplicate callbackUrl + topic pairs are skipped.
 */

const assert = require('assert');

const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const CALLBACK_URL =
  process.env.WEBHOOK_CALLBACK_URL || 'https://cortex-platforms.netlify.app/api/webhooks/shopify';
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-10';

assert(SHOP, 'Missing SHOPIFY_STORE_DOMAIN env');
assert(TOKEN, 'Missing SHOPIFY_ADMIN_TOKEN env');

const topics = [
  'ORDERS_CREATED',
  'ORDERS_UPDATED',
  'INVENTORY_LEVELS_UPDATE',
  'PRODUCTS_CREATE',
  'PRODUCTS_UPDATE'
];

async function graphqlRequest(query, variables = {}) {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

async function listExistingWebhooks() {
  const query = `
    {
      webhookSubscriptions(first: 50) {
        edges {
          node {
            id
            topic
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
          }
        }
      }
    }
  `;
  const data = await graphqlRequest(query);
  const edges = data?.webhookSubscriptions?.edges || [];
  return edges.map((e) => ({
    id: e.node.id,
    topic: e.node.topic,
    callbackUrl: e.node.endpoint?.callbackUrl
  }));
}

async function createWebhook(topic) {
  const mutation = `
    mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $callbackUrl: URL!) {
      webhookSubscriptionCreate(topic: $topic, webhookSubscription: {callbackUrl: $callbackUrl, format: JSON}) {
        webhookSubscription {
          id
          topic
          endpoint {
            __typename
            ... on WebhookHttpEndpoint {
              callbackUrl
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = { topic, callbackUrl: CALLBACK_URL };
  const data = await graphqlRequest(mutation, variables);
  const result = data.webhookSubscriptionCreate;
  if (result.userErrors && result.userErrors.length) {
    console.error('User errors creating webhook:', result.userErrors);
    return null;
  }
  return result.webhookSubscription;
}

(async function main() {
  try {
    console.log('Listing existing webhooks...');
    const existing = await listExistingWebhooks();
    console.log(`Found ${existing.length} existing webhook subscriptions.`);

    for (const topic of topics) {
      const already = existing.find((w) => w.topic === topic && w.callbackUrl === CALLBACK_URL);
      if (already) {
        console.log(`Webhook for ${topic} already exists at ${CALLBACK_URL} (id=${already.id}). Skipping.`);
        continue;
      }
      console.log(`Creating webhook for ${topic} -> ${CALLBACK_URL}`);
      const created = await createWebhook(topic);
      if (created) {
        console.log(`Created webhook: topic=${created.topic} callbackUrl=${created.endpoint.callbackUrl}`);
      } else {
        console.warn(`Failed to create webhook for ${topic}`);
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 2;
  }
})();
