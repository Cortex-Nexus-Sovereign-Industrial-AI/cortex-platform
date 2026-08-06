# Root Inventory — Canonical vs Experimental
**Updated:** 2026-08-06

## Canonical (use these)

| Path | Role |
|------|------|
| `index.html` | Primary app shell |
| `member-dashboard.html` | Member UI bound to `/api/auth/me` |
| `styles.css` / `app.js` | Primary frontend assets |
| `backend/server.js` | Primary API v2.2 |
| `shopify-client.js` | Shopify connector |
| `scripts/seed-shopify-products.js` | Product seed |
| `netlify.toml` + `netlify/functions/` | Deploy |
| `COMMAND_CENTER.md` / `STATUS.md` / `PUBLIC_SURFACES.md` | Ops |
| `docs/` | Tracked documentation |

## Supporting portals
- `admin-dashboard.html`, `customer-success-portal.html`, `test-payment.html`
- `join.html`, `projects.html`, `documents.html`

## Experimental / duplicate (do not link externally)
- `index_complete.html`, `index-production.html`, `index-9.html`, `index-10.html`
- `funnel-lane.html` and `funnel-lane (1..5).html`
- Other one-off HTML experiments in root

## Rule
External links only to canonical surfaces in `PUBLIC_SURFACES.md`.
