# Cortex Platform Backend v2.2

Node.js + Express + SQLite — JWT auth, orders, Paystack webhooks, access grants.

## Quick start

```bash
cd backend
npm install
cp .env.example .env
# Set JWT_SECRET, PAYSTACK_*, FRONTEND_URL
npm start
# → http://localhost:5000
```

## Endpoints

### Public
| Method | Path | Purpose |
|--------|------|--------|
| GET | /api/health | Health |
| POST | /api/auth/register | Register + JWT |
| POST | /api/auth/login | Login + JWT |
| POST | /api/orders | Create order |
| GET | /api/orders/:id | Receipt by id/ref |
| POST | /api/payments/verify | Verify reference |
| POST | /api/webhooks/paystack | Paystack webhook |

### Protected (Authorization: Bearer &lt;token&gt;)
| Method | Path | Purpose |
|--------|------|--------|
| GET | /api/auth/me | Profile + access grants |
| GET | /api/orders | Full order list |
| GET | /api/stats | Revenue stats |

On `charge.success`, an `access_grants` row is created for the payer email/product.

## Environment

See `.env.example`. Critical: `JWT_SECRET`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, `FRONTEND_URL`.

## Deploy (Render)

Root `render.yaml` defines a Node web service rooted at `backend/`.

Set the same env vars in the Render dashboard. Point Paystack webhook to:
`https://<your-service>.onrender.com/api/webhooks/paystack`

CORS: set `FRONTEND_URL` to your Netlify/GitHub Pages origin.

## Member UI

Repo root `member-dashboard.html` talks to this API.
