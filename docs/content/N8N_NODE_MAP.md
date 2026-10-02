# n8n node map — syndication (spec only)

**Important:** This is a **design document**. It does not deploy workflows, change Netlify, or call Paystack.  
Nothing here runs until you build it in n8n/Make in your own workspace.

---

## Goal

```
Schedule (cron) → Build payload → (optional) Generate polish → Post to channels → Log result
```

Optional later: engagement branch for inbound replies → WhatsApp link only.

---

## Recommended node chain

| Step | n8n node type | Config notes |
|------|----------------|--------------|
| 1 | **Schedule Trigger** | Cron in `Africa/Lagos` — e.g. weekdays 08:00, Sat 16:00, Sun 10:00 |
| 2 | **Set** (or Code) | Load day template from DRAFTS_WEEK.md fields: headline, body_text, cta_link, channels, offer_tag |
| 3 | **IF** | `status === Active` and day matches; else stop |
| 4 | **HTTP Request** (optional) | Only if you add your own “generate” API — not required |
| 5 | **Split** by channel | One branch per platform you actually connected |
| 6a | LinkedIn node / HTTP | Official LinkedIn credentials — founder account |
| 6b | Telegram node | Bot token to your channel/group |
| 6c | WhatsApp | Usually **manual** or official Cloud API — do not spam |
| 6d | Substack / YouTube | Often manual; automate only with real APIs |
| 7 | **Set** log | Store day, reference, success/fail — spreadsheet or DB |
| 8 | **Error Trigger** | Notify you on Telegram if a post fails |

---

## Payload shape (from repo)

Use `docs/content/webhook_payload.schema.json` and `example_monday_payload.json`.

Minimum fields to Set node:

- `brand.entity_name` = `Cortex Intelligence Nexus`  
- `post_payload.headline`  
- `post_payload.body_text`  
- `post_payload.cta_link`  
- `post_payload.channels`  

---

## What not to wire into this flow

| Avoid | Why |
|--------|-----|
| Paystack **secret** key | Unrelated to social posts; stays on Netlify webhook only |
| Paystack test storefront public share | Test banner — customers should use offers.html |
| Claiming “all channels connected” | Only mark connected after a real successful node run |
| Second public brand name | IDENTITY = Cortex Intelligence Nexus only |

---

## Make.com equivalent

Same logic: **Scheduler** → **Tools > Set variables** → **Router** (per network) → **LinkedIn/Telegram modules** → **Google Sheet log**.

---

## Safe rollout order

1. Schedule + Set + **Telegram only** (one channel).  
2. Add LinkedIn when OAuth works.  
3. Keep WhatsApp sales human.  
4. Never block or modify `paystack-webhook` or site functions from this workflow.

---

## Relation to platform

| System | Coupled? |
|--------|----------|
| cortex-platforms.netlify.app static pages | No |
| `paystack-webhook` function | No |
| `realtime-client-secret` | No |
| docs/content/* | Yes — source of copy only |

**Bottom line:** Adding these docs cannot slow or break existing settings. Live automation starts only when you create the scenario in n8n.
