import json
import hmac
import hashlib
from flask import Flask, request, jsonify

app = App(__name__)

# --- CONFIGURATION (Load these from your offline local vault) ---
STRIPE_WEBHOOK_SECRET = b"whsec_your_stripe_local_secret"
PAYSTACK_SECRET_KEY = b"sk_live_your_paystack_secret_key"

def verify_stripe_signature(payload, sig_header):
    """Verifies that the incoming webhook genuinely came from Stripe."""
    If not sig_header:
        Return False
    # Split timestamp and signature
    Parts = dict(x.split('=') for x in sig_header.split(','))
    Timestamp = parts.get('t')
    Signature = parts.get('v1')
    
    If not timestamp or not signature:
        Return False
        
    Signed_payload = f"{timestamp}.{payload.decode('utf-8')}".encode('utf-8')
    Expected_sig = hmac.new(STRIPE_WEBHOOK_SECRET, signed_payload, hashlib.sha256).hexdigest()
    Return hmac.compare_digest(expected_sig, signature)

def verify_paystack_signature(payload, sig_header):
    """Verifies that the incoming webhook genuinely came from Paystack."""
    If not sig_header:
        Return False
    Computed_sig = hmac.new(PAYSTACK_SECRET_KEY, payload, hashlib.sha256).hexdigest()
    Return hmac.compare_digest(computed_sig, sig_header)

def execute_linkso_loophole(email, product_id, amount, currency):
    """
    The High-Velocity Trigger.
    Deploys the digital asset to the buyer and queues the revenue 
    for the Path B FIRE engine allocation pipeline.
    """
    Print(f"\n[⚡ TRIGGER ACTIVATED] Real-time Settlement Captured!")
    Print(f"└── Buyer: {email}")
    Print(f"└── Asset: ID_{product_id}")
    Print(f"└── Value: {amount} {currency}")
    Print(f"└── Action: Dispatching payload via Shadow-Vault secure relay...")
    # Add your local file/license generation script attachment call here
    Return True

@app.route('/webhooks/stripe', methods=['POST'])
def stripe_webhook():
    Payload = request.data
    Sig_header = request.headers.get('Stripe-Signature')

    If not verify_stripe_signature(payload, sig_header):
        Return jsonify({"error": "Invalid signature"}), 400

    Event = json.loads(payload.decode('utf-8'))
    
    # Handle the successful checkout session
    If event.get('type') == 'checkout.session.completed':
        Session = event['data']['object']
        Email = session.get('customer_details', {}).get('email')
        Amount = session.get('amount_total', 0) / 100
        Currency = session.get('currency', 'usd').upper()
        # Custom metadata set up in your Shopify / Stripe link
        Product_id = session.get('metadata', {}).get('product_id', 'GLOBAL_AI_CORE')
        
        Execute_linkso_loophole(email, product_id, amount, currency)

    Return jsonify({"status": "success"}), 200

@app.route('/webhooks/paystack', methods=['POST'])
def paystack_webhook():
    Payload = request.data
    Sig_header = request.headers.get('X-Paystack-Signature')

    If not verify_paystack_signature(payload, sig_header):
        Return jsonify({"error": "Invalid signature"}), 400

    Event = json.loads(payload.decode('utf-8'))
    
    # Handle successful charge
    If event.get('event') == 'charge.success':
        Data = event['data']
        Email = data.get('customer', {}).get('email')
        Amount = data.get('amount', 0) / 100  # Paystack transmits in kobo/cents
        Currency = data.get('currency', 'NGN').upper()
        Product_id = data.get('metadata', {}).get('product_id', 'LOCAL_ENGINE_INDEX')
        
        Execute_linkso_loophole(email, product_id, amount, currency)

    Return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    # Running locally on your edge system; reverse-proxy via SSH tunnel or local gateway
    App.run(port=8080, debug=False)
