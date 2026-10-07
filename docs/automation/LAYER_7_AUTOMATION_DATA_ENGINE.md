# Cortex Intelligence Nexus — Layer 7 Automation & Data Engine

**Status:** Layer 7 foundation active  
**Date:** 2026-10-07

## Purpose
Create a controlled operational data layer for the Layer 6 conversion flow without inventing live metrics or introducing an unverified external database.

## Event model
The canonical event vocabulary is:

- `page_view` — public page viewed
- `path_selected` — visitor selected Learn, Technical Skills, or Discuss a Project
- `enquiry_started` — visitor initiated an enquiry
- `enquiry_qualified` — enquiry has enough information for routing
- `offer_presented` — an appropriate offer was presented
- `payment_started` — validated payment flow opened
- `payment_confirmed` — payment confirmation received from an authoritative payment system
- `delivery_completed` — requested deliverable completed
- `follow_up_due` — follow-up is required

## Data minimization
Events should contain operational metadata only:
- event name
- timestamp
- source/page
- destination/path
- product or service identifier when applicable
- outcome/status
- anonymous session identifier when a real session system exists

Do not store passwords, API keys, payment secrets, unnecessary contact information, or sensitive personal data in client telemetry.

## Current authority boundaries
- Public site remains the presentation layer.
- WhatsApp remains the primary human enquiry route.
- Paystack remains the documented payment authority for the existing digital offer.
- Existing payment webhooks are not replaced by this layer.
- Google Business is not a data-write target.
- The current metrics dashboard remains an honest registry unless a real API/data source is connected.

## Automation stages
### Stage A — Instrumentation
Define stable events and conversion paths.

### Stage B — Ingress
Route validated events through a controlled server-side endpoint or existing backend service.

### Stage C — Persistence
Use an explicitly provisioned persistent store. No SQLite/local-file persistence is treated as production truth on a serverless deployment.

### Stage D — Automation
Trigger only approved follow-up actions from authoritative events.

### Stage E — Observability
Expose only verified operational metrics; never fabricate counts, conversion rates or channel connectivity.

## Security gates
- Server-side secrets only.
- Validate event names against an allowlist.
- Reject oversized or malformed payloads.
- Avoid arbitrary client-provided status changes.
- Payment confirmation must come from the payment provider/webhook path, not a browser event.
- Keep audit records separate from marketing metrics where appropriate.

## Layer 7 handoff
The next implementation step is to connect the stable event vocabulary to a real persistent backend after the production backend/storage authority is confirmed. This document deliberately does not claim that persistence is live.
