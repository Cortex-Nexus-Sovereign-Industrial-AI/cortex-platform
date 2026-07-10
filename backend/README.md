# Cortex Platform v2.1 — Backend API

Node.js + Express + SQLite backend for the Cortex Platform with LIVE Paystack integration.

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Paystack keys
```

### 3. Initialize Database
```bash
npm run migrate
```

### 4. Start Server
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Health Check
```
GET /api/health
```
Returns platform status and configuration.

### Authentication

**Register User**
```
POST /api/auth/register
Body: { name, email, password, company?, location? }
```

**Login User**
```
POST /api/auth/login
Body: { email, password }
```

### Orders

**Create Order**
```
POST /api/orders
Body: { customer_name, email, phone?, product, amount_ngn }
```

**Get All Orders**
```
GET /api/orders
```

**Get Single Order**
```
GET /api/orders/:id
```

### Payments (Paystack)

**Verify Payment**
```
POST /api/payments/verify
Body: { reference }
```

**Webhook Endpoint** (Paystack → Server)
```
POST /api/webhooks/paystack
```
Paystack will POST payment confirmations here. Must be publicly accessible.

### Statistics

**Get Platform Stats**
```
GET /api/stats
```
Returns order counts and revenue totals.

---

## Database Schema

### users
- `id` (INTEGER, PK)
- `email` (TEXT, UNIQUE)
- `password` (TEXT, hashed)
- `name` (TEXT)
- `company` (TEXT)
- `location` (TEXT)
- `is_guest` (BOOLEAN)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### orders
- `id` (INTEGER, PK)
- `user_id` (FK → users)
- `order_ref` (TEXT, UNIQUE)
- `customer_name` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `product` (TEXT)
- `amount_ngn` (REAL)
- `amount_kobo` (INTEGER)
- `currency` (TEXT)
- `status` (TEXT: pending, completed)
- `paystack_ref` (TEXT)
- `paystack_transaction_id` (INTEGER)
- `payment_channel` (TEXT)
- `created_at` (DATETIME)
- `paid_at` (DATETIME)

### transactions
- `id` (INTEGER, PK)
- `order_id` (FK → orders)
- `user_id` (FK → users)
- `reference` (TEXT, UNIQUE)
- `amount_ngn` (REAL)
- `gateway` (TEXT: paystack, flutterwave)
- `status` (TEXT: pending, verified)
- `raw_response` (TEXT, JSON)
- `created_at` (DATETIME)
- `verified_at` (DATETIME)

### webhook_logs
- `id` (INTEGER, PK)
- `event_type` (TEXT)
- `data` (TEXT, JSON)
- `signature` (TEXT)
- `verified` (BOOLEAN)
- `created_at` (DATETIME)

---

## Paystack Integration

### Setup

1. **Get API Keys** from [Paystack Dashboard](https://dashboard.paystack.com)
   - Public Key: `pk_live_...`
   - Secret Key: `sk_live_...`

2. **Configure Webhook** in Paystack Dashboard
   - URL: `https://your-domain.com/api/webhooks/paystack`
   - Events: `charge.success`

3. **Add to .env**
   ```
   PAYSTACK_MODE=live
   PAYSTACK_PUBLIC_KEY=pk_live_...
   PAYSTACK_SECRET_KEY=sk_live_...
   ```

### Payment Flow

1. **Frontend**: User submits payment form
2. **Paystack Modal**: Opens payment dialog
3. **Paystack**: Processes payment, redirects to frontend
4. **Backend Webhook**: Receives `charge.success` event
5. **Database**: Order marked as `completed`
6. **Frontend**: Displays confirmation

---

## Deployment

### Render (Free tier available)

1. Push code to GitHub
2. Create new Render Service
3. Connect repository
4. Set environment variables
5. Deploy

### Railway

1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically

### Heroku

```bash
heroku login
heroku create cortex-platform-api
heroku config:set PAYSTACK_SECRET_KEY=sk_live_...
git push heroku main
```

---

## Environment Variables

See `.env.example` for all available options.

Critical variables:
- `PAYSTACK_PUBLIC_KEY` - Frontend Paystack key
- `PAYSTACK_SECRET_KEY` - Webhook signature verification
- `JWT_SECRET` - Token signing key
- `FRONTEND_URL` - CORS allowed origin

---

## Development

Run with auto-reload:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

---

## Support

Contact: Michael Ujuku Morim
Organization: CINIS NEXUS INDUSTRY OGOJA
