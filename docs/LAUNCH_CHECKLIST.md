# Cortex Intelligence Nexus — Launch QA Checklist

**Launch thesis:** Reveal human hidden potential through AI.  
**Primary lead channel:** WhatsApp direct chat  
**Primary payment channel:** Paystack  
**Website:** https://cortex-platforms.netlify.app/  
**Offers:** https://cortex-platforms.netlify.app/offers.html

## 1. Public-site smoke test
- [ ] Open the homepage on mobile and desktop; check navigation, spacing, and text wrapping.
- [ ] Confirm the hero clearly communicates the brand thesis and the two distinct actions.
- [ ] Open every homepage navigation link and verify it resolves to the intended page.
- [ ] Confirm offers page prices and service scope match the actual service being delivered.
- [ ] Check page title, meta description, and basic accessibility (heading order, link purpose, keyboard focus).
- [ ] Confirm email signup and voice-support controls report errors honestly if their Netlify Functions or required secrets are unavailable.

## 2. Conversion links
- [ ] Test the homepage service CTA to `/offers.html`.
- [ ] Test each service-specific WhatsApp CTA on a phone with WhatsApp installed.
- [ ] Confirm the message text is prefilled correctly and does not promise unconfirmed delivery dates.
- [ ] Test the WhatsApp Channel link separately; it is for updates, not individual support.
- [ ] Open the Paystack product page and verify the product name, amount (₦22,000), currency (NGN), merchant identity, and terms before promoting it.
- [ ] Complete a controlled low-risk test transaction if supported; verify the actual customer receipt and merchant transaction record. Do not treat a successful redirect alone as proof of payment.

## 3. Payment and access safety
- [ ] Confirm the checkout uses only a Paystack **public** key in browser code, if a key is used there. Never expose the Paystack secret key in HTML, JavaScript, Git history, or public environment variables.
- [ ] Verify Paystack webhook signature using the raw request body and the secret key stored as a Netlify environment variable.
- [ ] Process only verified successful charge events; validate the expected amount, currency, product/reference, and transaction status.
- [ ] Make webhook handling idempotent so retries cannot issue duplicate access.
- [ ] Record transaction reference and minimal fulfilment status; do not log card details, secrets, or unnecessary personal data.
- [ ] Grant access only on the server after verified payment. Do not rely on localStorage as an authorization mechanism.
- [ ] Test failed, abandoned, pending, duplicate, and replayed webhook events.
- [ ] Ensure the customer gets clear next steps if delivery is manual or automation is not yet active.

## 4. Leads and metrics
- [ ] Use a simple lead tracker with date, source, service, status, next action, and outcome.
- [ ] Record only information needed to respond and fulfil the request; restrict sheet access.
- [ ] Track homepage visits, offers visits, service CTA clicks, WhatsApp enquiries, checkout visits, successful purchases, and content source.
- [ ] Establish a baseline before interpreting conversion rates; avoid inventing performance claims.
- [ ] Review lead status daily during the first 48 hours, then weekly.

## 5. Publishing
- [ ] Publish Day 1 content only after the live pages and contact links pass checks.
- [ ] Use one main CTA per post.
- [ ] Keep claims factual: no guaranteed income, reach, follower growth, or unsupported urgency.
- [ ] Reply to enquiries with confirmed scope, price, timing, and next step.
- [ ] Recheck live URLs after every deployment.

## Go / no-go decision
**GO** when core pages load, booking/payment destinations are correct, service prices are consistent, and customer expectations are accurate.  
**NO-GO for automated access claims** until webhook verification, idempotency, and server-side authorization have been tested end-to-end.
