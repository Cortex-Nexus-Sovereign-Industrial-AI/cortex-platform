# Content syndication plan — Cortex Intelligence Nexus
**Source:** Founder multi-agent deployment brief (2026-10-02)  
**Aligned to:** IDENTITY.md · PAYSTACK_PRODUCTS.md · offers.html  
**Timezone:** Africa/Lagos  
**Status:** Spec locked — wire n8n/Make when calm (e.g. morning run)

---

## Brand rule (no drift)

| Layer | Value |
|-------|--------|
| **Public entity (all posts)** | Cortex Intelligence Nexus |
| **Local flavour** | Ogoja, Cross River State — in copy, not as a second company name |
| **Do not use as public brand** | CINIS SOVEREIGN / “CINIS Nexus Industry Ogoja” as a separate legal public entity |
| **Primary CTA** | https://cortex-platforms.netlify.app/offers.html |
| **WhatsApp** | 0901 025 1577 |
| **Sell tags** | `repair` · `agro` · `content_22k` · `thought` |

---

## Weekend automation

| Slot | Focus | Channels | Target action |
|------|--------|----------|---------------|
| **Saturday PM** | Weekly recap & case study | LinkedIn, Substack, Telegram, WhatsApp | Real wins: repair, automation, infrastructure — no fake metrics |
| **Sunday AM/PM** | Thought leadership & systems | LinkedIn, YouTube Shorts, TikTok | Practical architecture; tie back to finished work in Ogoja |

---

## Full week (Monday – Saturday)

| Day | Focus | Deliverable | Agent role |
|-----|--------|-------------|------------|
| **Monday** | Strategic systems & multi-agent ideas | Long-form (Substack/LinkedIn) + carousel (Telegram/WhatsApp) | Agent-Alpha (Architect) |
| **Tuesday** | Workflow automation & APIs (n8n, Make, webhooks) | Short clip / script + workflow diagram | Agent-Beta (Automation) |
| **Wednesday** | Local business infrastructure & growth | GBP-friendly post + client/success style note | Agent-Gamma (Operations) |
| **Thursday** | Developer tools, scripting, protocols | Code tip + Telegram discussion prompt | Agent-Delta (Systems) |
| **Friday** | Offers & growth (FinTech tone OK if honest) | Insight + **service CTA** → offers / Paystack ₦22k | Agent-Epsilon (Strategy) |
| **Saturday** | Community Q&A & weekly review | Q&A post, WhatsApp broadcast, retrospective | Agent-Zeta (Community) |

---

## Multi-agent matrix

```
                 Master Orchestrator / Scheduler
                              |
        +---------------------+---------------------+
        |                     |                     |
   Agent 1               Agent 2               Agent 3
   Generation            Syndication           Engagement
   Text/media prompts    n8n / Make hooks      Replies / bots
   Brand formatting      Multi-platform post   Lead → WhatsApp
```

| Agent | Job | Constraint |
|-------|-----|------------|
| **1 Generation** | Day topic → channel-ready copy | Public name = Cortex Intelligence Nexus; Ogoja in body only |
| **2 Syndication** | POST payload to n8n/Make | Only when endpoint verified; no silent “connected” claims |
| **3 Engagement** | Inbound from posts | Qualify → WhatsApp 0901 025 1577 or offers.html |

---

## Implementation (morning run checklist)

1. Confirm n8n/Make scenario listens on your real webhook URL (not assumed live on Netlify until you build it).  
2. Load daily templates from `docs/content/payloads/` or paste `webhook_payload.schema.json` shape.  
3. Commercial posts: CTA = offers page; digital pay = `https://paystack.shop/pay/cortex-demo` only for ₦22k Content System.  
4. Do not share Paystack **test** storefront with customers.  
5. Engagement bots: auto-reply can acknowledge; humans close repair/agro deals.

---

## Related files

- [webhook_payload.schema.json](./webhook_payload.schema.json) — standard payload  
- [SCHEDULE.md](./SCHEDULE.md) — compact calendar  
- [../commerce/PAYSTACK_PRODUCTS.md](../commerce/PAYSTACK_PRODUCTS.md)  
- [../../IDENTITY.md](../../IDENTITY.md)
