#!/usr/bin/env python3
"""
Paystack-first webhook listener for Cortex Platform.

Key points:
- Prioritizes Paystack webhook handling (regionally appropriate).
- Verifies Paystack signature using HMAC-SHA512.
- Provides idempotency protection via a tiny local processed-event store (JSON).
- Loads secrets from environment variables (.env or GitHub Actions secrets).
- No secrets are hardcoded.
- Dispatch function is a safe placeholder (replace with your secure delivery logic).

Usage:
  - Set PAYSTACK_SECRET_KEY in environment (.env)
  - Run: python webhook_trigger_engine.py
  - Expose locally (ngrok) and configure Paystack webhook to point to: https://<your-tunnel>.ngrok.io/webhooks/paystack
"""

import os
import json
import hmac
import hashlib
import logging
from typing import Optional
from pathlib import Path
from flask import Flask, request, jsonify, abort

app = Flask(__name__)
logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))

# Configuration via environment variables
PAYSTACK_SECRET_KEY = os.environ.get("PAYSTACK_SECRET_KEY")  # REQUIRED
SHOPIFY_APP_TOKEN = os.environ.get("SHOPIFY_APP_TOKEN")      # optional
SHOPIFY_STORE_DOMAIN = os.environ.get("SHOPIFY_STORE_DOMAIN")# optional

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", 8080))

# Idempotency store file (very small scale; for production use DB)
PROCESSED_STORE_PATH = Path(os.environ.get("PROCESSED_STORE", "processed_events.json"))

def load_processed_ids():
    try:
        if PROCESSED_STORE_PATH.exists():
            return set(json.loads(PROCESSED_STORE_PATH.read_text()))
    except Exception:
        logging.exception("Failed to load processed events store.")
    return set()

def save_processed_ids(ids_set):
    try:
        PROCESSED_STORE_PATH.write_text(json.dumps(list(ids_set)))
    except Exception:
        logging.exception("Failed to save processed events store.")

PROCESSED_IDS = load_processed_ids()

def is_already_processed(event_id: str) -> bool:
    return event_id in PROCESSED_IDS

def mark_processed(event_id: str):
    PROCESSED_IDS.add(event_id)
    save_processed_ids(PROCESSED_IDS)

def verify_paystack_signature(payload_bytes: bytes, sig_header: Optional[str]) -> bool:
    """
    Paystack HMAC verification (SHA512).
    - Paystack typically sets header 'X-Paystack-Signature' with HMAC-SHA512(payload, secret).
    - Confirm with your Paystack account docs if using a different scheme.
    """
    if not sig_header:
        logging.warning("Missing X-Paystack-Signature header.")
        return False
    if not PAYSTACK_SECRET_KEY:
        logging.warning("Missing PAYSTACK_SECRET_KEY environment variable.")
        return False
    try:
        computed = hmac.new(PAYSTACK_SECRET_KEY.encode(), payload_bytes, hashlib.sha512).hexdigest()
        verified = hmac.compare_digest(computed, sig_header)
        if not verified:
            logging.warning("Paystack signature mismatch.")
        return verified
    except Exception:
        logging.exception("Error verifying Paystack signature.")
        return False

def dispatch_fulfilment(email: str, product_id: str, amount: float, currency: str, provider_event_id: str) -> bool:
    """
    Replace with your secure asset/license generation + delivery logic.
    Keep this idempotent (use provider_event_id to avoid duplicate sends).
    """
    logging.info("Fulfilment requested: email=%s product=%s amount=%s %s event=%s", email, product_id, amount, currency, provider_event_id)
    # Example placeholder:
    # - enqueue to local queue
    # - generate license file in secure vault
    # - email customer via transactional email provider
    return True

@app.route('/webhooks/paystack', methods=['POST'])
def paystack_webhook():
    payload = request.data or b""
    sig_header = request.headers.get('X-Paystack-Signature') or request.headers.get('x-paystack-signature')

    # Verify signature first
    if not verify_paystack_signature(payload, sig_header):
        return jsonify({"error": "invalid signature"}), 400

    try:
        event = json.loads(payload.decode('utf-8'))
    except Exception:
        logging.exception("Invalid JSON payload from Paystack")
        return jsonify({"error": "invalid payload"}), 400

    event_id = event.get('event_id') or event.get('data', {}).get('reference') or event.get('data', {}).get('id') or event.get('data', {}).get('transaction') or None
    provider_event_identifier = event_id or f"paystack-{hashlib.sha256(payload).hexdigest()[:12]}"

    if is_already_processed(provider_event_identifier):
        logging.info("Event %s already processed — skipping", provider_event_identifier)
        return jsonify({"status": "ignored", "reason": "duplicate"}), 200

    logging.info("Paystack event received: %s id=%s", event.get('event'), provider_event_identifier)

    # Example: handle charge.success (common successful payment event)
    try:
        if event.get('event') == 'charge.success':
            data = event.get('data', {}) or {}
            # Paystack amounts are in kobo (NGN) or cents; unify to float units
            amount = float(data.get('amount', 0)) / 100.0
            currency = (data.get('currency') or 'NGN').upper()
            metadata = data.get('metadata') or {}
            product_id = metadata.get('product_id') or metadata.get('product') or 'LOCAL_ENGINE_INDEX'
            # Paystack customer might be an object or email field
            customer = data.get('customer') or {}
            email = customer.get('email') or data.get('customer_email') or metadata.get('email')
            success = dispatch_fulfilment(email, product_id, amount, currency, provider_event_identifier)
            if success:
                mark_processed(provider_event_identifier)
        else:
            # Add other Paystack event handlers as needed
            logging.info("Unhandled Paystack event type: %s", event.get('event'))
            mark_processed(provider_event_identifier)
    except Exception:
        logging.exception("Error processing Paystack event")
        return jsonify({"error": "processing error"}), 500

    return jsonify({"status": "success"}), 200


# Optional: keep a lightweight Stripe endpoint for webhook parity but disabled by default.
@app.route('/webhooks/stripe', methods=['POST'])
def stripe_webhook():
    # If you ever enable Stripe for any region, implement validation here (disabled in Paystack-first flow).
    return jsonify({"status": "disabled", "reason": "Stripe endpoint disabled (Paystack-first)"}), 501


if __name__ == '__main__':
    logging.info("Starting Paystack webhook listener on %s:%d", HOST, PORT)
    app.run(host=HOST, port=PORT, debug=False)
