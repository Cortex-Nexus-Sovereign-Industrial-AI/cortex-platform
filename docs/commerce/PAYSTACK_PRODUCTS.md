# Paystack product list — Cortex Intelligence Nexus
**Canonical · matches IDENTITY.md · Updated 2026-10-02**

Public business name only: **Cortex Intelligence Nexus**  
Do not use CINIS SOVEREIGN for public products.  
Do not list “Custom Solution Access” or other non-IDENTITY SKUs.

---

## Products (exact titles)

| # | Exact title on Paystack | Price (NGN) | Status | Customer path |
|---|-------------------------|-------------|--------|---------------|
| 1 | **30-Day AI Content System** | **22,000** | Primary — keep | Payment page `cortex-demo` + offers.html |
| 2 | **Agro / Trader Automation — Starter System** | **15,000** | Optional fixed product | Or quote ₦15k–₦50k on WhatsApp |
| 3 | **Electronics Diagnosis Fee** | **3,000** | Optional fixed product | Full repair by agreement after diagnosis |

### Payment page (live link)

```
https://paystack.shop/pay/cortex-demo
```

→ Must stay mapped to **30-Day AI Content System · ₦22,000** only.

### Storefront (optional)

```
https://paystack.shop/cortex-intelligence-nexus
```

- While red **test** banner shows: do **not** share with customers.
- Products on storefront = table above only.
- Unpublish / delete **Custom Solution Access · NGN 500** (not in IDENTITY).

---

## Descriptions (paste into Paystack)

**30-Day AI Content System — ₦22,000**  
Structured 30-day digital content system. Deliverable only. No income or follower promises. Cortex Intelligence Nexus, Ogoja.

**Agro / Trader Automation — Starter System — ₦15,000**  
Working starter automation (e.g. WhatsApp alerts / simple tracking) with short handover. Larger systems quoted on WhatsApp (₦15,000–₦50,000).

**Electronics Diagnosis Fee — ₦3,000**  
Diagnosis for TV, boards, irons, washers and common electronics in Ogoja. Full repair price agreed only after diagnosis.

---

## Do not create

- Custom Solution Access / ₦500 placeholders  
- Income or follower packages  
- Variable full-repair as a fixed high price without diagnosis  
- Products under a different business name than Cortex Intelligence Nexus  

---

## Founder actions on Paystack dashboard

1. Business: **Cortex Intelligence Nexus** (complete compliance when prompted).  
2. Products / Payment Pages: titles and prices exactly as above.  
3. Remove non-matching products.  
4. Test mode until compliance is done; then switch live keys per `LIVE_KEY_SWITCH.md`.  
5. Webhook: `https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook`  

---

## Platform alignment

| Surface | Role |
|---------|------|
| `offers.html` | Public book / pay |
| `IDENTITY.md` | Source of truth |
| `docs/commerce/OFFER_LADDER.md` | Ladder overview |
| `docs/commerce/PAYSTACK_KEYS.md` | Keys + links |
| Google Business + WhatsApp | Lead to offers + this list |

**Related:** [PAYSTACK_KEYS.md](./PAYSTACK_KEYS.md) · [OFFER_LADDER.md](./OFFER_LADDER.md) · [MID_TICKET_OFFER.md](./MID_TICKET_OFFER.md)
