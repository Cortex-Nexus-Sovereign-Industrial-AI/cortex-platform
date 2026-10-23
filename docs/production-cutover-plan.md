# Production Deployment Cutover Plan

## Objective

Transition the platform from a mixed static + in-process app setup to a production-safe architecture with isolated runtime boundaries and durable services.

## Current state

The codebase has already been stabilized in these ways:
- duplicate legacy page variants were blocked from the live route map
- request body size limits were enforced
- audio session limits were enforced
- production env validation was added
- Postgres-first migration guidance was created
- deployment separation guidance was created

## Final target architecture

### 1. Public static site

- served from GitHub Pages or a managed static host
- contains only canonical public routes
- no secrets or internal runtime logic
- caches static assets aggressively

### 2. API backend

- Node.js + Express service
- PostgreSQL database
- all auth, orders, payment, member, and metrics endpoints run here
- idempotent webhook processing
- no inline long-running work in request handlers

### 3. Content worker

- background task service for AI generation and validation
- jobs include content publishing, metrics aggregation, and export tasks
- strong validation gate before content reaches live surfaces

### 4. Realtime voice worker

- dedicated WebSocket service
- session TTL and memory caps enforced
- does not sit inside the core app runtime path

### 5. Storage layer

- object/file storage for assets and generated content
- not stored directly in the repo root for active runtime use

## Cutover sequence

### Step 1: isolate static site

- keep only canonical public routes
- remove or archive legacy page variants from active routing
- ensure all public links point to canonical files only

### Step 2: enforce production config at startup

Required environment variables:
- JWT_SECRET
- PAYSTACK_SECRET_KEY
- FRONTEND_URL
- DATABASE_URL
- ALLOWED_ORIGINS

Rules:
- fail fast in production if required values are missing
- never rely on hardcoded secrets in production

### Step 3: move transactional DB to PostgreSQL

- create PostgreSQL schema matching the current platform domain model
- replace SQLite write path in production
- validate order, transaction, and grant integrity before cutover

### Step 4: split worker services

- run content generation asynchronously
- run webhook processing with strict idempotency and durable job handling
- run voice sessions in a dedicated process

### Step 5: add operational guardrails

- health checks
- structured logs
- external call retries/timeouts
- monitoring for API latency, webhook failures, and worker queue depth

### Step 6: verify production readiness

Test cases:
- user login and registration
- order creation and payment verification
- webhook replay idempotency
- access grant assignment
- metrics endpoint generation
- public site loads without internal runtime dependency
- voice websocket accepts and limits sessions safely

## Production readiness checklist

- [ ] canonical site route set only
- [ ] no legacy duplicates in active root navigation
- [ ] request body caps enforced
- [ ] voice audio caps enforced
- [ ] env validation enforced
- [ ] PostgreSQL configured
- [ ] webhook replay safety enabled
- [ ] worker services isolated
- [ ] queueing active for async work
- [ ] monitoring and health checks active

## Final outcome

The platform becomes:
- lightweight and public-facing on the static layer
- robust and transactional on the API layer
- asynchronous and resilient on the worker layer
- realtime-safe on the voice layer
- production-ready for operations and scale
