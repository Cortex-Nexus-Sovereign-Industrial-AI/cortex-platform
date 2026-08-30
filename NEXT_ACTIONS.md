# NEXT ACTIONS
**Updated:** 2026-08-30

## Done in repo (agents can continue from here)

- Identity SSOT + index alignment
- Platform Pulse Phase 0
- SOFA env + Netlify helpers
- JSON-LD custom context
- Webhook durable idempotency
- HOCBF theory docs
- Mike Complex AI agent module (runner)
- netlify.toml: stop SPA rewrite swallowing static HTML
- **Paystack payment link injected** → https://paystack.shop/pay/cortex-demo (offers.html)
- **WhatsApp sales scripts updated** with live Paystack URL
- **MID_TICKET_OFFER + PAYSTACK_KEYS** aligned to live link

## Founder only (cannot be faked in git)

1. ~~Paystack payment link (₦22,000) under **Cortex Intelligence Nexus**~~ → LIVE
2. `PAYSTACK_SECRET_KEY` (+ optional public key) on Netlify
3. ~~Paste Paystack URL into WhatsApp scripts~~ → DONE
4. Confirm webhook in Paystack dashboard  
   URL: `https://cortex-platforms.netlify.app/.netlify/functions/paystack-webhook`
5. Optional: `SOFA_API_KEY`, Shopify token, store password removal

## Optional later

- Phase 1 Pulse: GitHub public API stats (no secret)
- Close or rewrite stale PRs #9, #12 after review
- Alias secondary Netlify project only if intentional
