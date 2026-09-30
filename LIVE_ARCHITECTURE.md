# Live Production Architecture

## Canonical system model

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
   ┌────▼─────┐    ┌─────▼─────────┐
   │  Static  │    │   Backend API  │
   │ Frontend │    │   (Render)     │
   │(Netlify) │    │                │
   └─┬────────┘    └────┬──────┬────┘
     │                  │      │
     │            ┌─────▼──┐ ┌─┴──────────┐
     │            │SQLite  │ │ Paystack   │
     │            │  DB    │ │ Gateway    │
     │            └────────┘ └────────────┘
     │
     └─ index.html
     └─ offers.html
     └─ identity.html
     └─ member-dashboard.html
     └─ metrics-dashboard.html
     └─ assets/ (css, js, images)
```

## Data flow

### Authentication flow
```
Browser
  -> POST /api/auth/register
  -> Backend validates input
  -> Hash password with bcryptjs
  -> Store user in SQLite
  -> Return JWT token
  -> Frontend stores token in localStorage
```

### Order flow
```
Browser (logged in)
  -> POST /api/orders (with JWT)
  -> Backend creates order
  -> Store in SQLite
  -> Return order reference
  -> Frontend redirects to Paystack
  -> Paystack payment flow
  -> Paystack webhook → Backend
  -> Backend verifies with Paystack
  -> Create access grant
  -> Update order status
```

### Payment verification flow
```
Paystack webhook
  -> POST /api/webhooks/paystack
  -> Backend verifies signature
  -> GET /api/payments/verify (with reference)
  -> Paystack API confirmation
  -> Update access grants
  -> Mark order as paid
```

## API endpoints (production)

### Public endpoints
- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- POST /api/orders
- GET /api/orders/:id
- POST /api/payments/verify
- POST /api/webhooks/paystack

### Protected endpoints (require JWT)
- GET /api/auth/me
- GET /api/orders
- GET /api/stats

## Database schema

### Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP
);
```

### Orders
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_email TEXT,
  amount INTEGER,
  reference TEXT,
  status TEXT,
  created_at TIMESTAMP
);
```

### Access grants
```sql
CREATE TABLE access_grants (
  id INTEGER PRIMARY KEY,
  user_email TEXT,
  product TEXT,
  granted_at TIMESTAMP
);
```

## Environment

### Development
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=dev_secret
FRONTEND_URL=http://localhost:3000
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
```

### Production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=[secure random]
FRONTEND_URL=https://cortex-platforms.netlify.app
PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_SECRET_KEY=sk_live_xxx
```

## Deployment targets

- Frontend: Netlify (automatic on push)
- Backend: Render (automatic on push)
- Database: SQLite (local file, backup regularly)

## Monitoring checklist

- [ ] Frontend loads without errors
- [ ] Backend /api/health returns 200
- [ ] Auth endpoints work
- [ ] Order endpoints work
- [ ] Paystack webhook logs show delivery
- [ ] No console errors in browser
- [ ] Response times < 500ms
- [ ] Error rate < 0.1%

---

**This is the canonical production architecture**
