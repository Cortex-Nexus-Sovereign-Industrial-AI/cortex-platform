# Commerce operating model — manual vs automation

**Product:** Cortex AI Nexus · CINIS NEXUS INDUSTRY OGOJA  
**Rule:** Automate infrastructure and copy. Humans stay in the loop for money, promises, and delivery quality.

---

## OPEN / AUTOMATED (no boundary on docs + site surfaces)

These are versioned in Git and free to use, copy, deploy with the site:

| Asset | Path / surface | Status |
|-------|----------------|--------|
| Low-ticket structure | docs/commerce/LOW_TICKET.md | Open |
| Mid-ticket offer stack | docs/commerce/MID_TICKET_OFFER.md | Open |
| WhatsApp sales scripts | docs/commerce/WHATSAPP_SALES_SCRIPT.md | Open |
| Ladder overview | docs/commerce/OFFER_LADDER.md | Open |
| Public offers page | offers.html | Open (static) |
| Platform shell / docs links | index.html, README, STATUS | Open |
| Paystack webhook code | netlify/functions/paystack-webhook.js | Code open; keys in env only |

**Declared working as documentation + static surfaces:** anyone cloning the repo or loading the live site can read the full offer system. No secret required to *read*.

---

## MANUAL / ETHICAL GATE (you must be involved)

Do **not** fully automate these without a human:

| Action | Why human |
|--------|-----------|
| Accepting payment for mid/high ticket | Scope, capacity, refunds |
| Sending Paystack link after YES | Prevents spam charge attempts; you control slots |
| Writing client brief → deliverable | Quality, niche fit, no false promises |
| Revision pass | Judgment |
| Refunds | Policy + bank/Paystack reality |
| Income claims | Forbidden — never automate hype |
| High-ticket sales calls | Diagnosis, fit, ethics |
| Cap on concurrent orders (e.g. 5) | Delivery integrity |

**You are the bottleneck on purpose** for anything that creates obligation to a buyer.

---

## Semi-auto (allowed when configured)

| Flow | Auto part | Manual part |
|------|-----------|-------------|
| Low ticket | Paystack checkout page | You or Zapier/email sends file |
| Mid ticket | Script + payment link template | You confirm YES, send link, build system |
| Webhook | Signature verify + log | You fulfill if product is digital file |
| Site | Netlify static deploy | You trigger green deploy if build fails |

---

## Hard ethics rules (system-wide)

1. Never promise income, followers, or sales.  
2. Promise only deliverables you control (files, calendars, calls within scope).  
3. Soft guarantee only on delivery time, not results.  
4. No secret keys in Git.  
5. If order volume exceeds capacity → stop sales, do not queue endlessly.

---

## Owner actions (immediate)

1. Create Paystack product/link for **₦22,000 — 30-Day AI Content System**.  
2. Paste real link into WhatsApp template where marked `[PASTE PAYSTACK LINK]`.  
3. Netlify: clear-cache deploy if offers.html not live yet.  
4. Keep WhatsApp as primary close channel.
