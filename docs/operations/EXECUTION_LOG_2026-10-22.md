# Cortex Platform — Execution Log
**Updated:** 2026-10-24  
**Canonical repository:** `Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform` (`main`)  
**Canonical public site:** https://cortex-platforms.netlify.app

## Changes committed

1. Hardened `netlify/functions/paystack-webhook.js`:
   - verifies Paystack HMAC-SHA512;
   - checks the primary offer's successful charge status, NGN currency, and exact 2,200,000-kobo amount before forwarding;
   - only suppresses duplicate events after the durable API accepts them;
   - returns retryable errors if the durable processor is unavailable;
   - blocks mismatched amounts/currencies from the primary fulfilment path.
2. Added `netlify/functions/paystack-webhook.test.js` for invalid signatures, mismatched amounts, unavailable API, and retry/idempotency behavior.
3. Updated `.github/workflows/cinis-dashboard-ssot-deploy.yml` to run the webhook safety tests before checking deployment credentials.
4. Restored the complete `backend/server.js` after the current branch version was found truncated at the middleware setup. The restored version retains the current request-size limits and CORS allowlist configuration.
5. Hardened `/api/webhooks/paystack`: it no longer creates an order or grants access from webhook metadata alone. Automated fulfilment now requires a pre-existing order matching the expected product, amount, currency, order reference, payment reference, and customer email. Unmatched charges are flagged for manual reconciliation.
6. Extracted payment/order validation into `backend/lib/paystackOrderMatch.js`; nine unit cases cover exact match, missing order, amount, currency, product, customer, reference, payment status, and ineligible order status.
7. Fixed durable webhook idempotency so a stale `processing` claim can be reclaimed after two minutes; duplicate in-progress events receive a retryable response instead of being falsely acknowledged as complete.
8. Updated the health endpoint's payment-mode indicator so it no longer defaults to claiming LIVE when no live secret is configured.

## Relevant commits

- Webhook ingress hardening: `6fdeb2e2dcb333e1e027bab1000bdc13c2d38eec`
- Regression tests: `474b665dfe3894a4ebb4d58b56d61da3f6c0684a`
- CI test gate: `008af3187f36a256d42d8d576aa3664420bec274`
- Restore backend and require matching order: `23d6fdeb36f5fd465318566465b41a8b9fcb9935`
- Extract and test order matcher: `be0a0c96d0be262d703e47dd73dcf46309159453`, `a79e076b52e6f101e92f28ec9f0269e6768f9063`, `79c5fb8174344ddd6c756d1bc8cf7524b74869d2`
- Add backend matcher test to CI: `82a017eaa391337294461ce3dcb9823a86cc1fb7`
- Recover stale webhook claims: `64327d0422dd8623156e0902e5211f393c93e717`
- Add retry/idempotency tests: `f3271c06e8a86fc56138f70fe20feafb4b0273c1`
- Add idempotency test to CI: `8d71018f565030df17eda9a43a27ccbaa72c66e3`

## Release blockers still open

- The connected Netlify account currently returns no matching `cortex-platforms` project. The published deploy, linked repository, and deployment state therefore remain unverified through the available connection.
- The GitHub deployment workflow requires the owner to configure `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` as Actions secrets. Do not commit or paste these secret values into chat.
- The public offer page still links to a static Paystack payment page. It does not yet establish a matching pending order before checkout. Until a server-side checkout/order-correlation flow exists, successful charges without a matching order will be recorded for manual reconciliation and will not automatically grant access.
- The CI workflow now runs the Netlify webhook tests, nine order-matcher unit tests, and five idempotency tests. A local Node test run of the 14 backend matcher/idempotency cases passed; GitHub Actions results are not yet confirmed. The full Express/SQLite webhook route still needs integration tests before live commerce is approved.
- No production deployment, live payment, or end-to-end delivery test has been confirmed.

## Release decision

**Code repaired and committed; production remains on hold.** Do not switch Paystack to live mode or describe automated order fulfilment as active. Next sequence: add a server-created checkout/order-reference flow, test the Express webhook and order lifecycle, verify GitHub Actions, restore canonical Netlify access, then deploy and test the published endpoints.
