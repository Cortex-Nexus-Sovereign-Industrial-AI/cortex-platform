# Cortex Intelligence Nexus — LIVE STATUS
**Updated:** 2026-08-30  
**Brand (public only):** Cortex Intelligence Nexus  
**Founder:** Michael Ujuku Morim · GitHub mikecomplexai-7  
**Runner agent (not public brand):** Mike Complex AI

---

## Single Source of Truth (LOCKED)

| Layer | Canonical |
|-------|-----------|
| **Repository** | https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform |
| **GitHub Pages shell** | https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform/ |
| **Primary live platform** | https://cortex-platforms.netlify.app |
| **Identity SSOT** | IDENTITY.md + SSOT.md + /identity.html |
| **Command entry** | COMMAND_CENTER.md |

All public surfaces, Google Business, social CTAs, and agent outputs resolve to the above. No competing domains as SSOT.

---

## Section activation map

| Section | State | Exploit now |
|---------|--------|-------------|
| **Identity / GBP** | Verified; IDENTITY.md SSOT; identity.html + aligned index | Use Maps + review links only under company name |
| **GitHub Pages** | Marketing index aligned (Cortex Intelligence Nexus) | https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform/ |
| **Netlify primary** | cortex-platforms.netlify.app — functions + static | publish = "." (root HTML files live) |
| **Platform Pulse** | Phase 0 on main (`metrics-dashboard.html`) | Honest registry; no fake live APIs |
| **JSON-LD / ns** | Custom context merged | Agents: `/ns/context.jsonld`; SEO: Schema.org only |
| **SOFA** | Env placeholders + Netlify helpers | Set `SOFA_API_KEY` on Netlify if using |
| **Paystack payment link** | **LIVE** — https://paystack.shop/pay/cortex-demo | offers.html CTA + WhatsApp scripts |
| **Paystack webhooks** | Code + durable idempotency merged | **Founder:** secret key + webhook URL |
| **Shopify** | Store + seed scripts; password on | Optional seed; remove password when live |
| **Commerce docs** | Offer ladder + WhatsApp scripts aligned | Ready for sales |
| **Member / admin HTML** | Present as static files | Open by path |
| **Edge CBF / HOCBF** | Theory docs merged | Engineering reference; not a public product page |
| **Activity tracker** | Dry-run default | Secrets + X creds before live |
| **Social module** | Spec-heavy under social-media-integration/ | Do not claim all APIs connected |
| **Open PRs cleaned** | Merged #22, #25, #20, #18 | Stale #9/#12 left open (review before merge) |

---

## Host truth (important)

| Host | Role |
|------|------|
| **https://cortex-platforms.netlify.app** | Primary dynamic + static (IDENTITY website field) |
| **https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform/** | Public shell / marketing |
| **https://cortex-intelligence-nexus.netlify.app** | Separate Netlify project in account — do not treat as SSOT unless you deliberately alias |

---

## Commerce (payment-ready infrastructure)

| Asset | State |
|-------|--------|
| Merchant profile | Unified under **Cortex Intelligence Nexus** |
| Shopify | cortex-intelligence-nexus.myshopify.com (password protected) |
| Offer ladder | docs/commerce/ |
| Mid-ticket | ₦22,000 — 30-Day AI Content System |
| Payment link | https://paystack.shop/pay/cortex-demo (**LIVE**) |
| Webhook function | `/.netlify/functions/paystack-webhook` |

**Founder-only blockers for first naira in:**

1. ~~Create Paystack payment link~~ → LIVE
2. ~~Paste into WhatsApp scripts~~ → DONE
3. Set `PAYSTACK_SECRET_KEY` on Netlify (Project configuration → Environment variables) → redeploy
4. Confirm Paystack webhook URL:  
   `https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook`
5. Optional Shopify seed + remove store password

---

## Platform components

| Component | State |
|-----------|--------|
| Edge CBF | edge/cbf/ + HOCBF docs |
| Member dashboard | /member-dashboard.html |
| Offers | /offers.html (live Paystack CTA) |
| Identity | /identity.html |
| Pulse | /metrics-dashboard.html |
| SOFA helpers | /api/sofa-status, /api/sofa-session |

---

## Policy

- Public name: **Cortex Intelligence Nexus** only
- Mike Complex AI = internal runner only
- Secrets = environment variables only
- No fake “all APIs connected” metrics
- **SSOT locked; commerce link live 2026-08-30** via MikeComplex AI runner under Michael Ujuku Morim authority
