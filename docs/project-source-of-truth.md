# Project Source of Truth

## Canonical identity

- Brand: Cortex Intelligence Nexus
- Founder: Michael Ujuku Morim
- Canonical domain: cortexnexus.com
- GitHub org: Cortex-Nexus-Sovereign-Industrial-AI
- Repo: cortex-platform
- Canonical site goal: public marketing + offers + member/admin flows + metrics dashboard

## Canonical deployment model

- Public site: GitHub Pages or equivalent static host
- API backend: managed Node.js runtime
- Database: PostgreSQL
- Content and AI tasks: queued background worker
- Realtime voice: dedicated WebSocket service
- Asset storage: durable object/media storage

## Live route set

Canonical public routes:
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

Legacy or duplicate variants are archived and not part of the active route map.

## Source files and responsibilities

### Public site and marketing
- root HTML pages
- public static assets
- offers and brand pages

### Backend API
- backend/server.js
- backend/config.js
- backend/lib/*
- backend/routes/*

### Content and AI layer
- agents/
- content-layer/
- skills/
- content-output/

### Realtime voice
- skills/cortex-realtime-voice/server.js
- skills/cortex-realtime-voice/session-store.js
- skills/cortex-realtime-voice/session.js
- skills/cortex-realtime-voice/pipeline.js

### Docs and runtime planning
- docs/postgres-migration-plan.md
- docs/production-cutover-plan.md
- docs/production-deployment-split.md
- deployment/api-production.yaml
- backend/.env.production.example

## Required production env vars

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
- SOFA_API_KEY
- SOFA_SITE

## Runtime boundaries

### 1. Static boundary
- purpose: public marketing and offers
- no internal secrets
- no private runtime logic

### 2. API boundary
- purpose: auth, payments, user data, orders, grants, metrics
- DB-backed
- protected endpoints only

### 3. Worker boundary
- purpose: content generation, publishing, validation, metrics aggregation
- async queue-based
- no blocking request operations

### 4. Voice boundary
- purpose: realtime audio sessions
- dedicated WebSocket runtime
- bounded session memory and audio payloads

## Production safeguards now in place

- duplicate static variants are blocked from active route map
- request payload limits enforced
- realtime voice limits enforced
- production env validation added
- PostgreSQL-first migration document written
- deployment split doc written
- API deployment config written

## Operational rules

- Always operate from canonical live rules, not duplicate variants
- Keep production env values in secure environment storage
- Never hardcode production secrets into repo content
- Keep all long-running work in background workers
- Keep public and private runtimes separate

## Decision log

This repo is now organized around a clean production architecture rather than a monolithic static app. The operational source of truth is the docs and config files in this repo, with the live environment values supplied separately from the codebase.
