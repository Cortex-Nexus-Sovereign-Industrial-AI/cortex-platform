# Cortex Intelligence Nexus — Paystack & Order Readiness Audit

**Audit date:** 11 October 2026  
**Canonical source:** `Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform`, branch `main`  
**Canonical website:** https://cortex-platforms.netlify.app/  
**Checkout page:** https://paystack.shop/pay/cortex-demo  
**Scope:** Technical readiness only. No keys changed, no live payment initiated, and no financial account settings changed.

## Executive status

**Status: TEST RECEIPT CONFIRMED; END-TO-END ORDER FULFILMENT NOT YET VERIFIED.**

The owner supplied a Paystack email receipt with:
- Mode: `[TEST MODE]`
- Amount: NGN 22,000.00
- Business: Cortex Intelligence Nexus
- Page: Cortex Intelligence Nexus - Paid Demo
- Reference: `T320090041547668`
- Receipt statement: “This is a test payment. No real money was sent to you.”

This confirms the receipt text and a test-mode payment receipt. It does not by itself prove that the Netlify webhook received the event, the backend persisted the transaction, or access was granted correctly.

## Verified from repository source

1. `netlify.toml` defines `netlify/functions` and redirects `/api/paystack-webhook` to the Paystack function.
2. The Netlify Paystack function validates `x-paystack-signature` using HMAC-SHA512 and `PAYSTACK_SECRET_KEY`.
3. The Netlify function's duplicate-event map is in-memory only. It is not durable across cold starts or multiple instances.
4. If `API_BASE_URL` is missing, the Netlify function logs the verified event but does not persist an order or grant access.
5. `backend/server.js` contains an Express webhook route and SQLite-backed tables for orders, transactions, webhook logs, processed events, and access grants.
6. The backend webhook currently creates a completed order and access grant for a signed `charge.success` event even when no matching pre-existing order exists. It does not enforce the expected amount/currency/product before granting access. This must be corrected before automated fulfilment is treated as production-safe.
7. The backend warns that a default JWT secret is used if `JWT_SECRET` is missing. A production deployment must set a strong secret in the backend's private environment and must not rely on the default.
8. Root `package.json` does not declare `sqlite3`, although the backend tries to load it. The backend also falls back to `backend/lib/sqliteMock` if native SQLite cannot be loaded; that fallback must never be mistaken for durable production storage.
9. `docs/commerce/LIVE_KEY_SWITCH.md` says payment mode is Test and refers to `PAYSTACK_KEYS.md`; that referenced file was not found at the repository root on this audit.
10. The earlier Netlify deploy record for 11 October reported **“No functions deployed.”** The canonical GitHub Actions workflow has now been updated to include function/config paths and use the Netlify CLI for the primary site's production deployment. Its actual run and function deployment still need a successful run/deploy record to verify.

## Change made during this audit

Updated `.github/workflows/cinis-dashboard-ssot-deploy.yml` in commit `af6cab441515b13558bf83eff089be269ca88d33` to:
- Trigger on changes to `netlify.toml`, `netlify/functions/**`, backend code, package manifests, identity files, and commerce/launch documentation.
- Fail clearly if the Netlify auth/site secrets are missing, without printing their values.
- Deploy to the canonical Netlify site using Netlify CLI with the configured functions directory.
- Stop this workflow from publishing a separate GitHub Pages dashboard shell; this workflow now targets only the canonical Netlify site.
- Leave all Paystack keys, environment values, and payment-mode settings unchanged.

## Required technical closure — safe work, no owner financial action needed

- [ ] Confirm the workflow run for the commit above succeeds.
- [ ] Confirm the production deploy lists the expected functions: `health`, `paystack-webhook`, and any other function files present.
- [ ] Confirm `/api/health` and `/.netlify/functions/health` return the expected JSON.
- [ ] Confirm Paystack webhook URL configured in the Paystack dashboard matches the deployed endpoint; dashboard state is not visible from this repository.
- [ ] Confirm the backend's actual deployment URL and set `API_BASE_URL` privately only after the endpoint is verified.
- [ ] Add the required `sqlite3` dependency and validate the backend deployment/runtime, or explicitly configure a supported durable database. Do not treat the in-memory mock as durable.
- [ ] Remove the production fallback JWT secret; fail startup if `JWT_SECRET` is absent in production.
- [ ] Make webhook fulfilment verify the event's successful status, NGN currency, expected amount and matching product/order before recording a completed order or granting access.
- [ ] Use durable idempotency and persist transaction/fulfilment status. Never rely on a warm-instance map as the sole duplicate protection.
- [ ] Add tests for valid/invalid signatures, wrong amount/currency, missing reference, duplicate/replayed event, failed/pending events, backend outage, and successful expected-price test-mode fulfilment.
- [ ] Confirm the customer-facing receipt/confirmation and fulfilment instructions match what Cortex can actually deliver.
- [ ] Check the merchant's actual mode and compliance status in the Paystack dashboard; repository notes are not proof of account status.

## Human-only financial confirmation gate

These actions remain reserved for the owner:
- Changing `PAYSTACK_SECRET_KEY` or public checkout configuration from test to live.
- Confirming merchant compliance/account access where the dashboard requires the account owner.
- Authorizing any real-money test, refund, charge, or other financial transaction.

Never put secrets in Git, HTML, client-side code, chat, logs, or this document. Enter credentials only in the relevant provider's private environment-variable settings. Do not paste keys into this audit.

## Decision

**Continue technical setup and test-mode validation. Do not advertise automated paid access as production-ready and do not switch to live mode until the technical checks above pass and the owner explicitly authorizes the financial step.**
