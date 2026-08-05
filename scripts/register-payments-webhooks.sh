#!/usr/bin/env bash
# Test Paystack webhook (replace signature with real HMAC-SHA512 of body using PAYSTACK_WEBHOOK_SECRET)
PAYSTACK_URL="https://cortex-platforms.netlify.app/api/webhooks/paystack"
FLUTTERWAVE_URL="https://cortex-platforms.netlify.app/api/webhooks/flutterwave"

# Sample Paystack payload
read -r -d '' PAYSTACK_BODY <<'JSON'
{
  "event":"charge.success",
  "data": {
    "reference":"test_ref_123",
    "amount":2900,
    "customer": { "email":"test@example.com" },
    "metadata": { "subscription_id": 1 }
  }
}
JSON

# Replace with real signature for production. For local tests, your handler can skip verification in dev.
echo "Sending Paystack test webhook..."
curl -v -X POST "${PAYSTACK_URL}" \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: TEST_SIGNATURE_REPLACE_ME" \
  -d "${PAYSTACK_BODY}"

# Sample Flutterwave payload
read -r -d '' FLW_BODY <<'JSON'
{
  "event":"charge.completed",
  "data": {
    "flw_ref":"test_flw_123",
    "amount":29,
    "currency":"NGN",
    "status":"successful",
    "customer": { "email":"test@example.com" }
  }
}
JSON

echo "Sending Flutterwave test webhook..."
curl -v -X POST "${FLUTTERWAVE_URL}" \
  -H "Content-Type: application/json" \
  -H "verif-hash: TEST_VERIF_HASH_REPLACE_ME" \
  -d "${FLW_BODY}"

echo "Done. Check your Netlify function logs for delivery details."