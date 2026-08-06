# Root Inventory — Canonical vs Experimental
**Updated:** 2026-08-06  
**Purpose:** Stop confusion about which files are the live surface vs historical experiments.

## Canonical (use these)

| Path | Role |
|------|------|
| `index.html` | Primary app shell (Netlify publish + CTAs) |
| `styles.css` | Primary stylesheet |
| `app.js` | Primary frontend logic |
| `backend/server.js` | Primary API (v2.2) |
| `shopify-client.js` | Shopify Admin connector |
| `scripts/seed-shopify-products.js` | Product seed |
| `netlify.toml` + `netlify/functions/` | Deploy + serverless |
| `COMMAND_CENTER.md` | Ops entry |
| `STATUS.md` | Live health |
| `PUBLIC_SURFACES.md` | Public URL map |
| `docs/` | Tracked documentation hierarchy |

## Supporting portals (keep)

| Path | Role |
|------|------|
| `admin-dashboard.html` | Admin UI experiment |
| `customer-success-portal.html` | Support portal |
| `test-payment.html` | Paystack test page |
| `join.html` / `Join–professional.html` | Join flows |
| `projects.html` | Projects listing |
| `documents.html` | Documents surface |

## Experimental / duplicate HTML (do not link externally)

Treat as archive candidates — do not delete without Founder approval:

- `index_complete.html`
- `index-production.html`
- `index-9.html`, `index-10.html`
- `funnel-lane.html`, `funnel-lane (1..5).html`
- `cortex-connector-hub_agentic_artifact_1_ef996e8c5cda (1).html`
- `documentation.html`, `media.html`, `research.html`, `support.html`, `product-search.html`

## Binary / historical documents (root)

Large PDFs and DOCX remain in root for history. Policy: see `docs/archive/README.md`.
Examples:
- ` THE SUPREME CONSTITUTION...pdf`
- `Global_Correction_Protocol...pdf`
- `CINIS_*.pdf` blueprints
- `infographics_*.pdf`
- Various images (png/jpeg/webp)

## Rule
External links and about.me must only point to **canonical** surfaces listed in `PUBLIC_SURFACES.md` and the Canonical table above.
