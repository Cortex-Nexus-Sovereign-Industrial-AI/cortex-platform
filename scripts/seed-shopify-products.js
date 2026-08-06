/**
 * CINIS NEXUS — Shopify Product Seed
 * Store: cortex-intelligence-nexus.myshopify.com
 *
 * Usage (after setting env):
 *   SHOPIFY_ADMIN_TOKEN=shpat_xxx node scripts/seed-shopify-products.js
 *
 * Requires: SHOPIFY_ADMIN_TOKEN in environment
 * Optional: SHOPIFY_STORE_DOMAIN (defaults to cortex-intelligence-nexus.myshopify.com)
 */

const STORE = process.env.SHOPIFY_STORE_DOMAIN || 'cortex-intelligence-nexus.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = '2024-10';

if (!TOKEN) {
  console.error('[seed] Missing SHOPIFY_ADMIN_TOKEN. Set it in env and retry.');
  process.exit(1);
}

const PRODUCTS = [
  {
    title: 'CINIS Platform Access — Starter',
    body_html: '<p>Entry-level access to CINIS NEXUS intelligence surface. Includes community features and core documentation.</p>',
    vendor: 'CINIS NEXUS',
    product_type: 'Subscription',
    tags: ['access', 'starter', 'cinis'],
    variants: [{ price: '5000.00', sku: 'CINIS-START-01', inventory_quantity: 999 }]
  },
  {
    title: 'CINIS Platform Access — Pro',
    body_html: '<p>Full member dashboard, priority updates, and extended intelligence packs.</p>',
    vendor: 'CINIS NEXUS',
    product_type: 'Subscription',
    tags: ['access', 'pro', 'cinis'],
    variants: [{ price: '15000.00', sku: 'CINIS-PRO-01', inventory_quantity: 999 }]
  },
  {
    title: 'MikeComplex AI Agent Pack',
    body_html: '<p>Prompt templates and operational playbooks for MikeComplex AI runner workflows.</p>',
    vendor: 'CINIS NEXUS',
    product_type: 'Digital',
    tags: ['agent', 'digital', 'mikecomplex'],
    variants: [{ price: '7500.00', sku: 'CINIS-AGENT-01', inventory_quantity: 999 }]
  },
  {
    title: 'Market Intelligence Report — Ogoja / Cross River',
    body_html: '<p>Localized market and opportunity briefing for Ogoja and surrounding Cross River corridors.</p>',
    vendor: 'CINIS NEXUS',
    product_type: 'Report',
    tags: ['report', 'ogoja', 'intelligence'],
    variants: [{ price: '10000.00', sku: 'CINIS-RPT-OGOJA-01', inventory_quantity: 999 }]
  }
];

async function createProduct(product) {
  const url = `https://${STORE}/admin/api/${API_VERSION}/products.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN
    },
    body: JSON.stringify({ product })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data.product;
}

async function main() {
  console.log(`[seed] Targeting store: ${STORE}`);
  for (const p of PRODUCTS) {
    try {
      const created = await createProduct(p);
      console.log(`[seed] Created: ${created.title} (id=${created.id})`);
    } catch (err) {
      console.error(`[seed] Failed: ${p.title}`, err.message || err);
    }
  }
  console.log('[seed] Done. Verify products in Shopify admin.');
}

main();
