# Production Readiness Hold Checklist

## Goal

Keep the platform stable, production-safe, and fully prepared for activation without forcing a risky external deployment before the runtime environment is ready.

## Hold status

The platform is in a safe hold state while the following are verified:

- canonical public pages are the only live site routes
- duplicate/legacy page variants are archived or blocked from active routing
- payload limits are enforced on API requests
- voice session limits are enforced
- production env validation is active
- PostgreSQL-first migration path is ready
- deployment split is documented and prepared
- no external deployment is triggered before the final environment is valid

## Safe hold rules

1. Do not deploy externally until runtime env values are confirmed.
2. Do not activate public site changes beyond the canonical route set.
3. Do not open new public-facing services until backend health checks pass.
4. Do not turn on new worker processes until DB and API are stable.
5. Do not expose new public endpoints before security validation is complete.

## Required environment values before activation

The following must be set in the production runtime environment before live activation:

- NODE_ENV=production
- PORT=3000
- JWT_SECRET
- FRONTEND_URL
- ALLOWED_ORIGINS
- DATABASE_URL
- PAYSTACK_SECRET_KEY
- PAYSTACK_PUBLIC_KEY
- MAX_JSON_BYTES
- MAX_URLENCODED_BYTES
- VOICE_SESSION_TTL_MS
- VOICE_MAX_SESSIONS
- MAX_AUDIO_BYTES_PER_TURN
- MAX_AUDIO_CHUNKS_PER_TURN
- SOFA_API_KEY (if enabled)
- SOFA_SITE (if enabled)

## Production safety checks before activation

### 1. Canonical site check

- only the canonical public site routes remain active
- duplicate/inactive HTML variants are archived and not linked
- no route ambiguity remains between live and legacy pages

### 2. API security check

- CORS allowlist is configured
- JWT secret is not a development fallback
- payload limits are enforced
- webhook validation is active and idempotent
- protected routes require valid auth

### 3. Voice safety check

- max session count is capped
- max audio bytes per turn is capped
- chunk count is capped
- stale sessions are cleaned up
- session TTL is enforced

### 4. Database readiness check

- PostgreSQL connection is configured
- schema is ready for auth, orders, access grants, transactions, webhooks
- migration path is validated
- SQLite remains dev-only until cutover is complete

### 5. Worker readiness check

- content worker is separate from API request handling
- tasks are async and queued or scheduled
- job retries/timeouts are configured
- long-running work never blocks API requests

### 6. Monitoring readiness check

- health checks are configured
- logs are structured
- errors are observable
- API latency and worker queue health are monitored

## Activation sequence when ready

1. Validate all required env values are present.
2. Validate DB connectivity and migration readiness.
3. Start API backend.
4. Verify /api/health is successful.
5. Validate auth and protected routes.
6. Validate payment and webhook flows.
7. Start background worker(s).
8. Start realtime voice service.
9. Validate static public site loads correctly.
10. Validate public and protected endpoints end-to-end.
11. Only then proceed with live release or external deployment.

## Operational decision

This should remain in a hold state until the environment and production values are fully verified. The system is intentionally kept stable and resilient rather than pushed prematurely.

## Final note

The repository and architecture are already aligned for a clean production split. The remaining risk is not code structure; it is premature live activation without final runtime values and environment validation.
