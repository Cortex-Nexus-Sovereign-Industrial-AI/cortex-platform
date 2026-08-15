# Commerce operating model — manual vs automation

**Product:** Cortex AI Nexus · CINIS NEXUS INDUSTRY OGOJA  
**Rule:** Automate infrastructure and copy. Humans stay in the loop for money, promises, and delivery quality.

---

## OPEN / AUTOMATED

| Asset | Path / surface |
|-------|----------------|
| Low / mid offers, WhatsApp scripts | docs/commerce/* |
| Public offers page | offers.html |
| Paystack public key (test) | docs/commerce/PAYSTACK_KEYS.md |
| Webhook function | netlify/functions/paystack-webhook.js |

## MANUAL / ETHICAL GATE

| Action | Owner |
|--------|--------|
| Secret key in Netlify only | You |
| Paystack payment links / products | You |
| WhatsApp YES → send link | You |
| Fulfill mid-ticket after brief | You |
| Refunds, order caps | You |

## Paystack (test)

- Public: see PAYSTACK_KEYS.md  
- Webhook: `https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook`  
- Business name: aligned with Google Business (owner-confirmed)

## Ethics

No income promises. Delivery-time guarantees only. No secrets in Git.
