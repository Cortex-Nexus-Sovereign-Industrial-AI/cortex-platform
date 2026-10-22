# Cortex Platform — Production Readiness Plan

**Date:** 2026-10-22  
**Canonical repository:** `Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform`, branch `main`  
**Canonical public host:** https://cortex-platforms.netlify.app  
**Public business name:** Cortex Intelligence Nexus  
**Owner:** Michael Ujuku Morim (Mikecomplex AI)

## Purpose

Convert the existing front-end into a credible, maintainable commercial workflow: one paid offer can be discovered, paid for, recorded, confirmed, delivered, and reconciled. This is a plan and acceptance specification, not evidence that the live deployment, authentication, payments, or webhooks have passed tests.

## Baseline from the 2026-10-22 guest-access review

Observed: sign-in/guest gate, application shell and navigation, AI Workspace UI, Content Studio forms, dashboard cards, activity log, and settings UI render.

Reported as incomplete or contradictory in that review: AI responses are canned; some Business Hub actions are toast-only; Help & Docs links use `#`; Shopify is not connected; Payments shows zero balances and test placeholders; some badges claim connections that are not verified; notifications/messages do not show a working panel; sovereignty and agent-activity claims are not backed by measured live evidence.

Treat these as review findings to re-verify against the current branch and deployment before changing production behavior.

## Operating rules

- One source of truth: this repository and the existing Cortex production host; do not create a second production project or duplicate repository.
- Public business name: Cortex Intelligence Nexus.
- Never describe a service as connected, live, or active unless a current test proves it.
- No income, follower, or outcome guarantees.
- Secrets only in provider/platform secret settings; never commit keys or paste them into issues, documentation, or chat.
- A screenshot, promise, or client-side redirect is not proof of payment.
- Delivery starts only after server-side verification of the payment provider event.

## Workstream 0 — credibility and UX audit

For each public claim, badge, navigation item, and action, classify it as **Keep (evidenced)**, **Fix**, or **Remove/Park**.

1. Change connection badges to truthful states: Connected (verified), Test mode, Pending, or Not connected.
2. Remove or qualify unmeasured claims such as “100% data sovereignty” and “AI agents active.”
3. Make notifications/messages open a real panel or remove misleading count badges.
4. Replace dead Help & Docs `#` links with real content or remove them.
5. Publish support channel, response target, delivery terms, revision/correction policy, and refund policy before payment.
6. Confirm every homepage claim can be traced to evidence within two clicks.

**Acceptance:** public-facing claims and actions are truthful, reachable, and evidence-backed.

## Workstream 1 — first paid journey

Recommended first offer: **30-Day AI Content System — ₦22,000**, digital and fixed-price.

Journey: offer page → Paystack checkout → verified server-side event → order created/updated → customer confirmation → delivery checklist → delivered → closed.

Use the existing platform sections: Payments, Orders, Business Hub, Settings, and Content Studio. Do not expand Shopify or Social Nexus until this journey passes its acceptance tests.

### Order lifecycle

Primary states: `Pending payment → Paid (settlement verified) → In production → Delivered → Closed`

Side states: `Failed payment`, `Refunded`, `On hold`.

Every paid order must carry a provider settlement reference. Every settlement must map to an order or be flagged for owner review.

## Workstream 2 — Paystack settlement verification

Before implementation, inspect and reuse the existing Paystack webhook/order code where suitable; avoid parallel duplicate endpoints.

On each webhook:
1. Verify `x-paystack-signature` using HMAC-SHA512 and the server-side Paystack secret.
2. Accept only the expected successful charge event and a payment status of `success`.
3. Require exact expected amount **2,200,000 kobo** and currency **NGN** for this offer.
4. Enforce reference-based idempotency; duplicate events must not create duplicate orders or delivery runs.
5. Match the provider reference to the order and validate customer email/phone where available.
6. Persist only necessary settlement metadata: reference, timestamp, offer, amount, currency, customer contact, order ID, and status. Never store card details.
7. Reject and log invalid signatures or malformed events without triggering delivery.
8. Flag verified payments without a matching order for owner review.
9. Handle refunds/reversals by moving the order to `Refunded`, stopping pending delivery, and recording the case.

A missed webhook may be recovered by checking the payment reference directly in the Paystack dashboard, then recording the same verified settlement evidence. Screenshots alone do not settle an order.

## Workstream 3 — delivery and support

Create a delivery checklist for the 30-Day AI Content System. Define the delivery timeframe, revision/correction rule, and refund rule before live sales. Use WhatsApp **0901 025 1577** for published support/booking and **cortexnexus@proton.me** for written records, after confirming these contact details remain current.

The Orders area should preserve issue, date, resolution, delivery status, and settlement reference. Send WhatsApp/email confirmation only through configured and tested providers; do not show “sent” unless the provider confirms success.

## Roadmap and gates

- **Phase 0 — credibility:** audit claims, badges, broken actions, support information, and offer terms.
- **Phase 1 — test mode:** complete the workflow using Paystack test credentials; prove signature verification, idempotency, order lifecycle, and failure handling.
- **Phase 2 — live settlement:** only after test acceptance, configure live credentials securely, enable 2FA, conduct one small live transaction, and reconcile Paystack ↔ Payments ↔ Orders ↔ bank/OPay/Moniepoint receipt.
- **Phase 3 — delivery:** connect one real AI generation path to paid fulfilment; test delivery checklist and support logging.
- **Phase 4 — scale:** consider Shopify, Social Nexus distribution, Business Hub reporting, agro/trader automation, and repair booking only after Phases 0–3 pass.

## Acceptance criteria

- Every public claim is evidence-backed.
- A test-mode payment becomes exactly one paid order, is confirmed, and enters delivery without manual database repair.
- Zero deliveries occur without a verified settlement reference.
- Duplicate webhook delivery is idempotent.
- Failed, abandoned, refunded, and unmatched payments follow documented paths.
- Payments, Orders, provider settlements, and receipts reconcile without unexplained differences.
- Weekly 30-minute review: open orders, settlement/order matching, due deliveries, closed work, support issues.
- Monthly reconciliation is documented.

## Security and release constraints

- Never commit payment secrets, access tokens, customer credentials, or production data.
- Keep live credentials out of public documents, issues, and code.
- Use test mode before live mode; do not promote the offer publicly until a real end-to-end acceptance test passes.
- A GitHub commit or workflow run does not by itself prove that the canonical Netlify site has deployed successfully; verify the deployment separately.

## Initial execution checklist

- [ ] Re-verify the current branch and live site against the baseline.
- [ ] Inspect existing Paystack function, order persistence, and deployment configuration before modifying code.
- [ ] Produce the claim/badge inventory: Keep, Fix, Remove/Park.
- [ ] Write the offer delivery checklist and publish the terms.
- [ ] Run the full Paystack test-mode acceptance suite.
- [ ] Verify the resulting deployment and record evidence before live activation.
