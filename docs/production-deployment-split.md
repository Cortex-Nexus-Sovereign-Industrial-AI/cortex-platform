# Production Deployment Split Blueprint

## Objective

Split the platform into clear runtime boundaries so marketing, API services, worker automation, and realtime voice are independent and scalable.

## Target topology

### 1. Static public site

Host: GitHub Pages or equivalent static host

Responsibilities:
- public marketing pages
- offers pages
- support pages
- public lead capture pages
- public documentation pages

Rules:
- only canonical pages remain in the live route map
- no duplicate HTML variants in the root active site
- cache static assets aggressively
- use hashed filenames for bundles and media assets

Canonical live route set:
- /
- /index.html
- /offers.html
- /member-dashboard.html
- /admin-dashboard.html
- /metrics-dashboard.html
- /identity.html
- /support.html
- /governance.html
- /join.html

### 2. API backend

Host: managed Node.js backend service

Responsibilities:
- auth
- orders
- transactions
- payment verification
- webhook handling
- access grants
- member payload API
- metrics pulse API

Database:
- PostgreSQL
- single source of truth for transactional records

Constraints:
- strong env validation in production
- explicit CORS allowlist
- authenticated routes only for protected endpoints
- request limits enforced
- external calls wrapped in timeouts/retries

### 3. AI/content worker

Host: background worker service

Responsibilities:
- content generation jobs
- validation jobs
- publish routing
- metrics aggregation jobs
- report generation

Constraints:
- async only
- no synchronous generation inside request handlers
- output validation gate before publishing

### 4. Realtime voice worker

Host: dedicated WebSocket service

Responsibilities:
- live audio sessions
- STT → LLM → TTS flow
- session lifecycle
- turn management
- connected client sessions

Constraints:
- chunk and size caps
- TTL limits
- max active session count
- separate process from main API

### 5. Asset and media layer

Storage: durable object storage or managed file storage

Responsibilities:
- uploaded media
- generated podcast assets
- graph/report exports
- secure downloads

Rules:
- no large binaries in the app repo root
- file URLs generated from storage rather than repo paths

## Deployment boundaries

### Public site boundary

- static host only
- no app runtime logic
- no secrets in page code
- no direct access to internal APIs except via public endpoints

### Backend boundary

- all user auth and transactional logic
- verified payment stack
- protected member/admin APIs
- DB access only through backend service

### Worker boundary

- asynchronous, queued tasks only
- no UI dependency
- idempotent job processing

### Voice boundary

- realtime service on separate port/service
- no direct DB write path in the request loop
- session cleanup and memory protection enabled

## Operational rules

- production config must fail fast if required env vars are missing
- use explicit `ALLOWED_ORIGINS`
- set `JWT_SECRET` and payment credentials in env, never in code
- add queue workers for long-running jobs
- add structured logs and metrics for all services
- set service health checks and uptime monitoring

## Recommended runtime mapping

| Service | Runtime | Database | Notes |
|---|---|---|---|
| Public site | static host | none | canonical pages only |
| API backend | Node.js | PostgreSQL | auth, orders, payments |
| Content worker | Node.js worker | PostgreSQL + storage | async jobs |
| Voice worker | Node.js WebSocket | optional session cache | live audio processing |
| Media storage | object storage | none | uploaded/generated files |

## Production checklist

- [ ] canonical public routes only
- [ ] duplicate pages archived or removed
- [ ] API service isolated from static host
- [ ] PostgreSQL configured and connected
- [ ] required env vars enforced
- [ ] CORS allowlist configured
- [ ] webhook idempotency in place
- [ ] queue workers enabled
- [ ] voice worker isolated
- [ ] monitoring and health checks enabled
