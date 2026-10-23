# Deployment Integration Map

## System map

- Public Site -> GitHub Pages / static host
- API Backend -> Node.js service
- Database -> PostgreSQL
- Content Worker -> async job worker
- Realtime Voice -> WebSocket worker
- Media Storage -> object/media storage

## Connection map

### Public site to API
- public site requests only public endpoints
- protected endpoints require auth token
- FRONTEND_URL and ALLOWED_ORIGINS restrict cross-origin access

### API to database
- API service uses DATABASE_URL
- PostgreSQL stores auth, orders, transactions, grants, webhooks, metrics

### API to payment stack
- Paystack webhook verification and transaction handling
- payment verification endpoints use payment reference data

### API to content system
- API queries content metadata and member access
- worker writes generated content into content-output storage

### API to voice service
- voice service runs independently
- WebSocket sessions are separate from core request traffic

### Worker to storage
- content and upload outputs are written to durable storage
- static pages reference published outputs only when valid

## Runtime dependencies

- static site depends on public assets and canonical HTML routes
- API depends on DB, auth secrets, payment credentials, allowed origins
- content worker depends on storage and runtime config
- voice worker depends on session caps and provider env values

## Governance notes

- product identity and route map are controlled by repo docs
- deployment config is separate from code logic
- no production secrets are committed to repo documents
- external live changes should be validated against the repo source of truth before release

## Operational sequence

1. Validate env values
2. Start database
3. Start API backend
4. Start worker services
5. Start voice worker
6. validate health endpoints
7. validate public site load
8. validate protected API flows

## Decision summary

This architecture keeps the marketing and API responsibilities separate, keeps long-running work off request paths, and makes the platform easier to operate and scale.
