# Secure Automation Blueprint: X & Shopify Activity Tracker

**Product:** Cortex AI Nexus · CINIS NEXUS INDUSTRY OGOJA  
**Target Account:** @MikeComplexAie  
**Enterprise Entity:** Cortex Intelligence Nexus Intel Solution  
**Operator:** Michael Ujuku Morim (Mike Complex)  
**Access Scope:** Encrypted private loop — strictly restricted to owner activity  
**Status:** Design specification (ready for implementation)  
**Related:** `docs/operations/SHOPIFY_INTEGRATION.md`, `social-media-integration/`, `scripts/register-shopify-webhooks.js`

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

**Non-negotiable rules**
- Secrets (`X_API_*`, `SHOPIFY_ADMIN_TOKEN`, webhook secrets) live only in environment variables (Netlify / Render / local `.env`). Never committed.
- All published content carries the internal tracking tags: `#MikeComplexAI` `#CINIS` `#Shopify`.
- Engagement data, link clicks, and post performance are aggregated in a cross-sectional log that runs beneath every automation section.
- No public dashboard exposure of raw automation state; owner views via member dashboard or encrypted log export only.

---

## 2. Integrated Automation Actions

### 2.1 Direct Post Initiation
Automatically draft and publish updates on X when Shopify emits relevant events:

| Shopify Trigger | Suggested X Action |
|-----------------|--------------------|
| `products/create` or product published | New-release announcement with product title, short description, store link |
| `inventory_levels/update` (threshold or restock) | Inventory / availability signal |
| Key metric / order milestone (via `orders/create` or custom metric) | Milestone or performance note (owner-gated) |
| Manual / scheduled content push | Owner-initiated drafts via social-media-integration queue |

Implementation path:
1. Extend existing Shopify webhook registration (`scripts/register-shopify-webhooks.js`) to include `PRODUCTS_CREATE`, `PRODUCTS_UPDATE` (or `PRODUCTS_PUBLISH` equivalent) in addition to the current `ORDERS_*` + `INVENTORY_LEVELS_UPDATE`.
2. Webhook receiver (Netlify function or backend route at `/api/webhooks/shopify`) validates HMAC, normalizes payload, and enqueues a post job.
3. Post composer (reuse / extend `social-media-integration` Twitter controller) builds the text, appends the three mandatory hashtags, and publishes via Twitter API v2 (OAuth 1.0a user context or app + user token for @MikeComplexAie).

### 2.2 Cross-Sectional Tracking
Monitored logs run beneath all active automation sections and aggregate:
- Engagement (likes, reposts, replies, quotes)
- Link clicks (UTM or X analytics if available)
- Post performance vs. prior baseline
- Mapping of every X post ID back to the originating Shopify event ID / product ID / order ID

Storage recommendation:
- Append-only encrypted activity log (local file or Prisma model under owner-only access).
- Optional mirror into existing `analytics` table pattern from `social-media-integration/database/schema.sql`.

### 2.3 Hashtag & Metric Tagging
Every automated post **must** end with (or contain):
```
#MikeComplexAI #CINIS #Shopify
```
This creates a reliable internal audit trail that can be searched on X and matched against the proprietary log.

### 2.4 Proprietary Record Logging
For every successful (or failed) post:
```json
{
  "ts": "ISO-8601",
  "shopify_event": { "topic": "...", "id": "...", "product_id": "..." },
  "x_post": { "id": "...", "text_preview": "...", "url": "..." },
  "tags": ["#MikeComplexAI", "#CINIS", "#Shopify"],
  "metrics_snapshot": { "likes": 0, "reposts": 0, ... },
  "status": "posted|failed|queued",
  "operator": "Mike Complex"
}
```
Logs are encrypted at rest (or stored in a private, access-controlled location). Only the founder can retrieve the full mapping.

---

## 3. Architecture Sketch

```
Shopify Admin API / Webhooks
        |
        v
[ /api/webhooks/shopify ]  ← HMAC validation, idempotency (see IDEMPOTENCY.md)
        |
        v
[ Activity Tracker Service ]
  - normalize event
  - decide whether to post (policy rules)
  - draft content + mandatory hashtags
  - call Twitter controller
  - write encrypted log entry
        |
        +----→ X API (@MikeComplexAie)
        |
        +----→ Proprietary encrypted log / internal dashboard metrics
```

Reuse existing pieces where possible:
- `scripts/register-shopify-webhooks.js` — extend topic list
- `social-media-integration/backend/controllers/twitterController.js` — post path
- `social-media-integration` analytics / PostQueue models
- Netlify function or `backend` Express route for the webhook endpoint (mirror Paystack pattern)

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
# or TWITTER_BEARER_TOKEN + user auth as preferred by twitter-api-v2

# Optional
WEBHOOK_CALLBACK_URL=https://cortex-platforms.netlify.app/api/webhooks/shopify
ACTIVITY_LOG_ENCRYPTION_KEY=...     # for proprietary log encryption
```

---

## 5. Implementation Sequence (Founder-gated)

1. **Credentials** — Obtain / rotate X API credentials with write access for @MikeComplexAie; confirm Shopify Admin token has `write_webhooks`, `read_products`, `read_orders`, `read_inventory`.
2. **Extend webhook registration** — Add product-related topics to `scripts/register-shopify-webhooks.js` and re-run with env vars.
3. **Webhook handler** — Implement or extend `/api/webhooks/shopify` (Netlify function preferred for parity with Paystack) with HMAC check + idempotency.
4. **Post composer + logger** — Thin service that drafts, tags, posts via existing Twitter controller, and writes the encrypted activity record.
5. **Policy gate** — Start with a simple allow-list (new product published → post; inventory below threshold → optional alert post). Owner can expand later.
6. **Verify** — Dry-run mode that only logs without publishing; then enable live publishing.
7. **Document** — Update `STATUS.md` and `HANDOFF.md` when the loop is live.

---

## 6. Security & Governance Alignment

- Follows GOVERNANCE.md absolute founder authority model.
- Secrets never enter Git (Gitleaks-aware).
- Private loop: no public exposure of automation internals.
- Cross-reference with `docs/commerce/OPERATING_MODEL.md` — humans remain in the loop for money, promises, and delivery quality; this automation covers infrastructure and copy only.
- Rate limits and error handling inherit from the social-media-integration rate limiter and errorHandler middleware.

---

## 7. Success Criteria

- [ ] Shopify product publish or inventory event produces a correctly tagged X post from @MikeComplexAie within the configured latency window.
- [ ] Every post is mapped in the proprietary encrypted log to its Shopify source event.
- [ ] Engagement metrics are aggregated under the cross-sectional tracker.
- [ ] No secrets appear in repository history or logs.
- [ ] STATUS.md reflects the live state of the tracker.

---

**Authority:** Michael Ujuku Morim, Founder & CEO  
**Document location:** `docs/operations/X_SHOPIFY_ACTIVITY_TRACKER.md`  
**Next concrete step:** Founder supplies or confirms X API credentials + decides initial policy rules (which Shopify events auto-post).