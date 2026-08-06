# Frontend Notes — Canonical Landing

## Canonical Entry
- Primary public shell: `index.html` (also served via Netlify publish = ".")
- Alternate variants exist (`index_complete.html`, `index-production.html`, `funnel-lane*.html`) — keep for experiments but point external links to the primary surfaces in PUBLIC_SURFACES.md.

## Required CTA Targets
Every primary landing should eventually expose clear links to:
1. GitHub Command Repo / Command Center
2. Netlify app
3. about.me identity
4. Substack publication
5. Shopify storefront (once products are live)
6. STATUS.md (activity / health)

## Activity Signal
Add a visible “Last updated” or status badge pointing at STATUS.md so visitors see ongoing professional activity even before revenue.

## Auth Overlay
The current auth overlay in `index.html` is client-side UX. Real protection remains on the backend (`/api/auth/*` JWT routes in `backend/server.js` and OAuth routes in `backend/routes/auth.js`).
