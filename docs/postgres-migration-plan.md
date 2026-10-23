# PostgreSQL Migration Plan

## Goal

Move the platform’s transactional data from SQLite to PostgreSQL so auth, orders, access grants, webhooks, and metrics are stable under production traffic and concurrent operations.

## Why move now

SQLite is acceptable for small-scale or single-process local use, but it is a poor fit for:
- concurrent API requests
- webhook retries
- multi-worker job processing
- production data integrity checks
- future growth and reporting

## Target database model

Use PostgreSQL as the primary transactional database. Keep SQLite only for local dev or ephemeral experimentation if needed.

## Recommended schema

### users

- id: SERIAL PRIMARY KEY
- email: VARCHAR(255) UNIQUE NOT NULL
- password: TEXT NOT NULL
- name: VARCHAR(255) NOT NULL
- company: VARCHAR(255)
- location: VARCHAR(255)
- is_guest: BOOLEAN DEFAULT false
- created_at: TIMESTAMPTZ DEFAULT NOW()
- updated_at: TIMESTAMPTZ DEFAULT NOW()

### orders

- id: SERIAL PRIMARY KEY
- user_id: INTEGER REFERENCES users(id)
- order_ref: VARCHAR(255) UNIQUE NOT NULL
- customer_name: VARCHAR(255) NOT NULL
- email: VARCHAR(255) NOT NULL
- phone: VARCHAR(50)
- product: VARCHAR(255) NOT NULL
- amount_ngn: NUMERIC(12,2) NOT NULL
- amount_kobo: INTEGER NOT NULL
- currency: VARCHAR(10) DEFAULT 'NGN'
- status: VARCHAR(50) DEFAULT 'pending'
- paystack_ref: VARCHAR(255)
- paystack_transaction_id: BIGINT
- payment_channel: VARCHAR(100)
- created_at: TIMESTAMPTZ DEFAULT NOW()
- paid_at: TIMESTAMPTZ

### transactions

- id: SERIAL PRIMARY KEY
- order_id: INTEGER REFERENCES orders(id)
- user_id: INTEGER REFERENCES users(id)
- reference: VARCHAR(255) UNIQUE NOT NULL
- amount_ngn: NUMERIC(12,2) NOT NULL
- gateway: VARCHAR(50) DEFAULT 'paystack'
- status: VARCHAR(50) DEFAULT 'pending'
- raw_response: JSONB
- created_at: TIMESTAMPTZ DEFAULT NOW()
- verified_at: TIMESTAMPTZ

### webhook_logs

- id: SERIAL PRIMARY KEY
- event_type: VARCHAR(120) NOT NULL
- data: JSONB NOT NULL
- signature: TEXT
- verified: BOOLEAN DEFAULT false
- created_at: TIMESTAMPTZ DEFAULT NOW()

### access_grants

- id: SERIAL PRIMARY KEY
- email: VARCHAR(255) NOT NULL
- product: VARCHAR(255) NOT NULL
- order_ref: VARCHAR(255)
- transaction_reference: VARCHAR(255)
- granted_at: TIMESTAMPTZ DEFAULT NOW()
- active: BOOLEAN DEFAULT true

### processed_webhooks

- id: SERIAL PRIMARY KEY
- event_type: VARCHAR(120) NOT NULL
- reference: VARCHAR(255) NOT NULL
- paystack_id: VARCHAR(255)
- status: VARCHAR(50) DEFAULT 'processed'
- created_at: TIMESTAMPTZ DEFAULT NOW()
- UNIQUE(event_type, reference)

## Indexes

- orders(paystack_ref)
- access_grants(transaction_reference)
- transactions(reference)
- orders(email)
- orders(status)
- users(email)
- processed_webhooks(reference)

## Required config

Set env vars:
- DATABASE_URL
- JWT_SECRET
- PAYSTACK_SECRET_KEY
- PAYSTACK_PUBLIC_KEY
- FRONTEND_URL
- ALLOWED_ORIGINS

## Migration approach

### Phase 1: configuration layer

- add `DATABASE_URL` to required production config
- add `backend/config.js` validation for production failure on missing required values
- keep runtime compatibility with sqlite fallback only for local/dev use

### Phase 2: schema parity

- create PostgreSQL tables matching the current SQLite schema
- add indexes and uniqueness constraints
- migrate order and transaction status logic

### Phase 3: data transfer

- export SQLite rows to CSV/JSON
- map column types to PostgreSQL-safe equivalents
- insert in a controlled order:
  1. users
  2. orders
  3. transactions
  4. access_grants
  5. webhook_logs
  6. processed_webhooks

### Phase 4: validation

- verify row counts
- verify unique constraints
- verify order status and payment references
- verify access grant generation after successful payment events

### Phase 5: cutover

- switch backend to PostgreSQL connection string
- disable SQLite writes in production
- run smoke tests for auth, orders, payment verification, and webhook replay

## SQL examples

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  location VARCHAR(255),
  is_guest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  order_ref VARCHAR(255) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  product VARCHAR(255) NOT NULL,
  amount_ngn NUMERIC(12,2) NOT NULL,
  amount_kobo INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'NGN',
  status VARCHAR(50) DEFAULT 'pending',
  paystack_ref VARCHAR(255),
  paystack_transaction_id BIGINT,
  payment_channel VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);
```

## Operational notes

- use transactions for payment processing and webhook idempotency
- add DB connection pooling for API service
- add read/write monitoring for database latency
- monitor lock contention and query time under webhook bursts

## Final target

The production deployment should be PostgreSQL-backed, queue-driven, and service-isolated, with the static site remaining public-facing and lightweight.
