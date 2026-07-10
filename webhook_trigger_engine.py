#!/usr/bin/env python3
"""
Cortex Platform — Webhook Trigger Engine
CINIS NEXUS INDUSTRY OGOJA
Paystack-first webhook listener with Flask

SECURITY NOTE:
- Never commit real secrets to this file
- Use environment variables or a secrets manager
- Configure webhook endpoints with HTTPS only
- Validate all signatures before processing

Usage:
    export FLASK_APP=webhook_trigger_engine.py
    flask run --port=8080
    # OR
    python webhook_trigger_engine.py
"""

import os
import hashlib
import hmac
import json
import logging
from datetime import datetime
from functools import wraps

from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ============================================
# CONFIGURATION
# ============================================
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('webhook_logs.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('cortex_webhook')

# Secrets — load from environment variables
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY', '')
PAYSTACK_WEBHOOK_SECRET = os.getenv('PAYSTACK_WEBHOOK_SECRET', '')
FLUTTERWAVE_SECRET_KEY = os.getenv('FLUTTERWAVE_SECRET_KEY', '')
FLUTTERWAVE_WEBHOOK_SECRET = os.getenv('FLUTTERWAVE_WEBHOOK_SECRET', '')
SHOPIFY_API_KEY = os.getenv('SHOPIFY_API_KEY', '')
SHOPIFY_API_SECRET = os.getenv('SHOPIFY_API_SECRET', '')
SHOPIFY_STORE_URL = os.getenv('SHOPIFY_STORE_URL', '')

# In-memory transaction store (replace with database in production)
transactions = {
    'paystack': [],
    'flutterwave': [],
    'shopify': []
}


# ============================================
# UTILITIES
# ============================================
def verify_paystack_signature(body: bytes, signature: str) -> bool:
    """Verify Paystack webhook signature using HMAC-SHA512."""
    if not PAYSTACK_WEBHOOK_SECRET:
        logger.warning("PAYSTACK_WEBHOOK_SECRET not set — skipping signature verification")
        return True  # In dev, allow through if secret not set

    expected = hmac.new(
        PAYSTACK_WEBHOOK_SECRET.encode('utf-8'),
        body,
        hashlib.sha512
    ).hexdigest()

    return hmac.compare_digest(expected, signature)


def verify_flutterwave_signature(body: bytes, signature: str) -> bool:
    """Verify Flutterwave webhook signature using HMAC-SHA256."""
    if not FLUTTERWAVE_WEBHOOK_SECRET:
        logger.warning("FLUTTERWAVE_WEBHOOK_SECRET not set — skipping signature verification")
        return True

    expected = hmac.new(
        FLUTTERWAVE_WEBHOOK_SECRET.encode('utf-8'),
        body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)


def log_transaction(provider: str, event_type: str, data: dict):
    """Log a transaction to the in-memory store."""
    entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'provider': provider,
        'event': event_type,
        'data': data
    }
    transactions[provider].append(entry)
    logger.info(f"[{provider.upper()}] {event_type}: {json.dumps(data, default=str)[:200]}")


# ============================================
# ROUTES
# ============================================
@app.route('/')
def index():
    """Health check endpoint."""
    return jsonify({
        'status': 'online',
        'platform': 'Cortex Platform — Sovereign Industrial AI Core',
        'organization': 'CINIS NEXUS INDUSTRY OGOJA',
        'version': '2.0.0-sovereign',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/api/health')
def health():
    """Detailed health check."""
    return jsonify({
        'status': 'healthy',
        'services': {
            'paystack_webhook': bool(PAYSTACK_WEBHOOK_SECRET),
            'flutterwave_webhook': bool(FLUTTERWAVE_WEBHOOK_SECRET),
            'shopify_api': bool(SHOPIFY_API_KEY)
        },
        'transaction_counts': {
            'paystack': len(transactions['paystack']),
            'flutterwave': len(transactions['flutterwave']),
            'shopify': len(transactions['shopify'])
        }
    })


# --------------------------------------------
# PAYSTACK WEBHOOK
# --------------------------------------------
@app.route('/api/webhooks/paystack', methods=['POST'])
def paystack_webhook():
    """
    Receive and process Paystack webhook events.

    Expected events:
    - charge.success
    - charge.failed
    - transfer.success
    - transfer.failed
    - subscription.create
    - subscription.disable
    - invoice.create
    - paymentrequest.success
    """
    signature = request.headers.get('x-paystack-signature', '')
    body = request.get_data()

    if not verify_paystack_signature(body, signature):
        logger.warning("Paystack signature verification failed")
        return jsonify({'error': 'Invalid signature'}), 401

    try:
        event = request.json
        event_type = event.get('event', 'unknown')
        data = event.get('data', {})

        log_transaction('paystack', event_type, data)

        # Handle specific events
        if event_type == 'charge.success':
            amount = data.get('amount', 0) / 100  # Paystack amounts are in kobo
            reference = data.get('reference', '')
            customer_email = data.get('customer', {}).get('email', '')
            logger.info(f"Payment success: ₦{amount:,.2f} from {customer_email} (ref: {reference})")

            # TODO: Update order status, send confirmation email, etc.

        elif event_type == 'charge.failed':
            reference = data.get('reference', '')
            logger.warning(f"Payment failed for reference: {reference}")

        elif event_type == 'transfer.success':
            amount = data.get('amount', 0) / 100
            recipient = data.get('recipient', {}).get('name', '')
            logger.info(f"Transfer success: ₦{amount:,.2f} to {recipient}")

        elif event_type == 'subscription.create':
            plan = data.get('plan', {}).get('name', '')
            customer = data.get('customer', {}).get('email', '')
            logger.info(f"New subscription: {plan} by {customer}")

        return jsonify({'status': 'processed', 'event': event_type}), 200

    except Exception as e:
        logger.error(f"Error processing Paystack webhook: {str(e)}")
        return jsonify({'error': 'Processing error'}), 500


# --------------------------------------------
# FLUTTERWAVE WEBHOOK
# --------------------------------------------
@app.route('/api/webhooks/flutterwave', methods=['POST'])
def flutterwave_webhook():
    """
    Receive and process Flutterwave webhook events.

    Expected events:
    - charge.completed
    - transfer.completed
    - subscription.cancelled
    """
    signature = request.headers.get('verif-hash', '')
    body = request.get_data()

    if not verify_flutterwave_signature(body, signature):
        logger.warning("Flutterwave signature verification failed")
        return jsonify({'error': 'Invalid signature'}), 401

    try:
        event = request.json
        event_type = event.get('event', 'unknown')
        data = event.get('data', {})

        log_transaction('flutterwave', event_type, data)

        if event_type == 'charge.completed':
            status = data.get('status', '')
            amount = data.get('amount', 0)
            currency = data.get('currency', 'NGN')
            tx_ref = data.get('tx_ref', '')

            if status == 'successful':
                logger.info(f"Flutterwave payment success: {currency} {amount:,.2f} (ref: {tx_ref})")
            else:
                logger.warning(f"Flutterwave payment {status}: {tx_ref}")

        elif event_type == 'transfer.completed':
            status = data.get('status', '')
            amount = data.get('amount', 0)
            logger.info(f"Flutterwave transfer {status}: ₦{amount:,.2f}")

        return jsonify({'status': 'processed', 'event': event_type}), 200

    except Exception as e:
        logger.error(f"Error processing Flutterwave webhook: {str(e)}")
        return jsonify({'error': 'Processing error'}), 500


# --------------------------------------------
# SHOPIFY WEBHOOK (Optional)
# --------------------------------------------
@app.route('/api/webhooks/shopify', methods=['POST'])
def shopify_webhook():
    """
    Receive Shopify webhook events.
    Verify using HMAC-SHA256 of the request body.
    """
    hmac_header = request.headers.get('X-Shopify-Hmac-Sha256', '')
    body = request.get_data()

    if SHOPIFY_API_SECRET:
        expected = hmac.new(
            SHOPIFY_API_SECRET.encode('utf-8'),
            body,
            hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected, hmac_header):
            return jsonify({'error': 'Invalid signature'}), 401

    try:
        topic = request.headers.get('X-Shopify-Topic', 'unknown')
        data = request.json

        log_transaction('shopify', topic, data)

        if topic == 'orders/create':
            order_id = data.get('id', '')
            total = data.get('total_price', '0')
            logger.info(f"New Shopify order: #{order_id} — ₦{total}")

        elif topic == 'products/create':
            product_id = data.get('id', '')
            title = data.get('title', '')
            logger.info(f"New Shopify product: {title} (ID: {product_id})")

        return jsonify({'status': 'processed', 'topic': topic}), 200

    except Exception as e:
        logger.error(f"Error processing Shopify webhook: {str(e)}")
        return jsonify({'error': 'Processing error'}), 500


# --------------------------------------------
# TRANSACTION API (for frontend polling)
# --------------------------------------------
@app.route('/api/transactions/<provider>', methods=['GET'])
def get_transactions(provider):
    """Get logged transactions for a provider."""
    if provider not in transactions:
        return jsonify({'error': 'Unknown provider'}), 400

    limit = request.args.get('limit', 50, type=int)
    return jsonify({
        'provider': provider,
        'count': len(transactions[provider]),
        'transactions': transactions[provider][-limit:]
    })


@app.route('/api/transactions/summary', methods=['GET'])
def transaction_summary():
    """Get transaction summary across all providers."""
    summary = {}
    for provider, txns in transactions.items():
        summary[provider] = {
            'total': len(txns),
            'successful': len([t for t in txns if 'success' in t.get('event', '')]),
            'failed': len([t for t in txns if 'fail' in t.get('event', '')])
        }
    return jsonify(summary)


# ============================================
# ERROR HANDLERS
# ============================================
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found', 'path': request.path}), 404


@app.errorhandler(500)
def server_error(e):
    logger.error(f"Server error: {str(e)}")
    return jsonify({'error': 'Internal server error'}), 500


# ============================================
# MAIN
# ============================================
if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'

    logger.info("=" * 50)
    logger.info("CORTEX PLATFORM — Webhook Trigger Engine")
    logger.info("CINIS NEXUS INDUSTRY OGOJA")
    logger.info("=" * 50)
    logger.info(f"Starting server on port {port}")
    logger.info(f"Debug mode: {debug}")
    logger.info("Endpoints:")
    logger.info("  GET  /                    — Health check")
    logger.info("  GET  /api/health          — Detailed health")
    logger.info("  POST /api/webhooks/paystack     — Paystack webhook")
    logger.info("  POST /api/webhooks/flutterwave  — Flutterwave webhook")
    logger.info("  POST /api/webhooks/shopify      — Shopify webhook")
    logger.info("  GET  /api/transactions/<provider> — Transaction logs")
    logger.info("=" * 50)

    app.run(host='0.0.0.0', port=port, debug=debug)
