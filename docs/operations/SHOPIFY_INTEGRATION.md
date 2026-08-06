# Shopify Integration — CINIS NEXUS

## Goal
Bind a live Shopify storefront so digital products, SDK access, and paid plans can be sold and tracked.

## Current State
- `shopify-client.js` exists in root
- GitHub workflow `shopify-deploy.yml` present
- Product catalog blueprints (PDF) exist in repo
- No confirmed public live storefront with products yet

## Required Next Actions
1. Confirm exact Shopify store URL (cortexintelligencenexus.myshopify.com or current variant)
2. Generate / store private app or custom app credentials securely (never commit secrets)
3. Use existing `shopify-client.js` + workflow to push products
4. Map Paystack or Shopify Payments for Nigerian customers
5. Link storefront from main index.html and about.me

## Recommended Product Categories (initial)
- Platform subscription access codes
- Digital reports / market intelligence packs
- AI agent prompt packs / templates
- Training materials from Education Hub

## Tracking
All Shopify-related changes must be committed here so activity and ownership remain visible.
