# Secure Automation Blueprint: X & Shopify Activity Tracker

**Product:** Cortex AI Nexus · CINIS NEXUS INDUSTRY OGOJA  
**Target Account:** @MikeComplexAie  
**Enterprise Entity:** Cortex Intelligence Nexus Intel Solution  
**Operator:** Michael Ujuku Morim (Mike Complex)  
**Access Scope:** Encrypted private loop — strictly restricted to owner activity  
**Status:** Implementation slice live in repo — dry-run default  
**Related:** `docs/operations/SHOPIFY_INTEGRATION.md`, `social-media-integration/`, `scripts/register-shopify-webhooks.js`, `netlify/functions/shopify-webhook.js`

---

## 1. Core Configuration

| Parameter | Value |
|-----------|--------|
| X handle | @MikeComplexAie |
| Shopify store | cortex-intelligence-nexus.myshopify.com |
| Operator | Michael Ujuku Morim |
| Governance | Absolute founder authority (GOVERNANCE.md) |
| Loop type | Private / encrypted / owner-only |
| Audit trail | Proprietary encrypted logs mapped to internal dashboard metrics |
| Receiver | `/.netlify/functions/shopify-webhook` and `/api/webhooks/shopify` |
| Publish gate | `ACTIVITY_TRACKER_LIVE=true` plus X user-context credentials |

**Non-negotiable rules**
- Secrets (`X_API_*`, `SHOPIFY_ADMIN_TOKEN`, webhook secrets) live only in environment variables (Netlify / Render / local `.env`). Never committed.
- All published content carries the internal tracking tags: `#MikeComplexAI` `#CINIS` `#Shopify`.
- Engagement data, link clicks, and post performance are aggregated in a cross-sectional log that runs beneath every automation section.
- No public dashboard exposure of raw automation state; owner views via member dashboard or encrypted log export only.

---

## 2. Integrated Automation Actions

### 2.1 Direct Post Initiation
Automatically draft and (when live) publish updates on X when Shopify emits relevant events:

| Shopify Trigger | X Action |
|-----------------|----------|
| `products/create` or active `products/update` | New-release announcement with title, short description, store link |
| `inventory_levels/update` at or below threshold (default 3) | Inventory signal |
| `orders/create` | Logged always; public post only if `ACTIVITY_POST_ORDERS=true` |
| Manual / scheduled content push | Owner-initiated drafts via social-media-integration queue |

Implementation path (now in repo):
1. `scripts/register-shopify-webhooks.js` registers `ORDERS_*`, `INVENTORY_LEVELS_UPDATE`, `PRODUCTS_CREATE`, `PRODUCTS_UPDATE`.
2. `netlify/functions/shopify-webhook.js` validates HMAC, normalizes payload, applies policy, and enqueues or publishes.
3. `netlify/functions/lib/activity-tracker.js` builds text, appends the three mandatory hashtags, optionally posts via Twitter API v2 (OAuth 1.0a), and seals the activity record.

### 2.2 Cross-Sectional Tracking
Monitored logs run beneath all active automation sections and aggregate:
- Engagement (likes, reposts, replies, quotes) — snapshot fields reserved; fill on a later metrics poll
- Link clicks (UTM or X analytics if available)
- Post performance vs. prior baseline
- Mapping of every X post ID back to the originating Shopify event ID / product ID / order ID

Storage:
- Append-only sealed activity record (AES-256-GCM when `ACTIVITY_LOG_ENCRYPTION_KEY` is set).
- Warm-isolate idempotency by Shopify webhook id.
- Optional later mirror into `social-media-integration/database/schema.sql` analytics tables.

### 2.3 Hashtag & Metric Tagging
Every automated post **must** end with (or contain):
```
#MikeComplexAI #CINIS #Shopify
```

### 2.4 Proprietary Record Logging
For every successful (or failed) post:
```json
{
  "ts": "ISO-8601",
  "shopify_event": { "topic": "...", "id": "...", "product_id": "..." },
  "x_post": { "id": "...", "text_preview": "...", "url": "..." },
  "tags": ["#MikeComplexAI", "#CINIS", "#Shopify"],
  "metrics_snapshot": { "likes": 0, "reposts": 0 },
  "status": "posted|failed|queued",
  "operator": "Mike Complex"
}
```

---

## 3. Architecture Sketch

```
Shopify Admin API / Webhooks
        |
        v
[ /api/webhooks/shopify ]  ← HMAC validation, idempotency
        |
        v
[ Activity Tracker Service ]
  - normalize event
  - decide whether to post (policy rules)
  - draft content + mandatory hashtags
  - call X API only if ACTIVITY_TRACKER_LIVE=true
  - write sealed log entry
        |
        +----→ X API (@MikeComplexAie)
        |
        +----→ Proprietary sealed log / internal dashboard metrics
```

---

## 4. Environment Variables (never commit)

```bash
# Shopify
SHOPIFY_STORE_DOMAIN=cortex-intelligence-nexus.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_...
SHOPIFY_WEBHOOK_SECRET=...          # for HMAC validation

# X / Twitter (user context for @MikeComplexAie)
X_API_KEY=...
X_API_SECRET=...
X_ACCESS_TOKEN=...
X_ACCESS_TOKEN_SECRET=...

# Gates
ACTIVITY_TRACKER_LIVE=false         # set true only after dry-run verified
ACTIVITY_POST_ORDERS=false
ACTIVITY_INVENTORY_THRESHOLD=3
ACTIVITY_LOG_ENCRYPTION_KEY=...
WEBHOOK_CALLBACK_URL=https://cortex-platforms.netlify.app/api/webhooks/shopify
```

---

## 5. Implementation Sequence (Founder-gated)

1. **Credentials** — X API write access for @MikeComplexAie; Shopify token with `write_webhooks`, `read_products`, `read_orders`, `read_inventory`.
2. **Register webhooks** — run `scripts/register-shopify-webhooks.js` with env vars.
3. **Netlify env** — set `SHOPIFY_WEBHOOK_SECRET`; keep `ACTIVITY_TRACKER_LIVE=false` for dry-run.
4. **Verify** — create/update a product and confirm function logs show `mode: dry-run` and tagged copy.
5. **Go live** — set X credentials + `ACTIVITY_TRACKER_LIVE=true` and redeploy.
6. **Document** — keep STATUS.md / HANDOFF.md current.

---

## 6. Security & Governance Alignment

- Follows GOVERNANCE.md absolute founder authority model.
- Secrets never enter Git (Gitleaks-aware).
- Private loop: no public exposure of automation internals.
- Humans remain in the loop for money, promises, and delivery quality; this automation covers infrastructure and copy only.
- Default is dry-run so a missing credential cannot spray unreviewed posts.

---

## 7. Success Criteria

- [x] Webhook receiver + composer + sealed logger exist in repo.
- [x] Product and inventory topics added to registration script.
- [ ] Shopify product publish or inventory event produces a correctly tagged X post from @MikeComplexAie (requires founder credentials + live gate).
- [ ] Every post is mapped in the proprietary sealed log to its Shopify source event.
- [ ] Engagement metrics are aggregated under the cross-sectional tracker.
- [x] No secrets appear in repository history.
- [x] STATUS.md reflects the implementation slice.

---

**Authority:** Michael Ujuku Morim, Founder & CEO  
**Document location:** `docs/operations/X_SHOPIFY_ACTIVITY_TRACKER.md`  
**Next concrete step:** Founder sets Shopify webhook secret + X credentials, runs registration script, then flips `ACTIVITY_TRACKER_LIVE` after a dry-run.
