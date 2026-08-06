# Authentication Setup — CINIS NEXUS

## Backend (server.js v2.2)

### Public
| Method | Path | Purpose |
|--------|------|--------|
| POST | /api/auth/register | Create account + JWT |
| POST | /api/auth/login | Login + JWT |
| GET | /api/health | Health check |
| POST | /api/orders | Create checkout order |
| GET | /api/orders/:id | Public receipt by id/ref |
| POST | /api/payments/verify | Verify payment reference |
| POST | /api/webhooks/paystack | Paystack webhook |

### Protected (Authorization: Bearer &lt;token&gt;)
| Method | Path | Purpose |
|--------|------|--------|
| GET | /api/auth/me | Profile + active access grants |
| GET | /api/orders | Full order list |
| GET | /api/stats | Revenue and platform stats |

### Access grants
On `charge.success`, webhook writes a row to `access_grants` (email, product, order_ref, transaction_reference).
`/api/auth/me` returns active grants for the logged-in user email.

## Required env
```
JWT_SECRET=
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_MODE=live
FRONTEND_URL=
```

Never commit real secrets. Use Netlify / local `.env` only.

## OAuth PKCE (optional alternate path)
See `backend/routes/auth.js` for OAuth authorize/callback/status/logout when an external IdP is configured.
