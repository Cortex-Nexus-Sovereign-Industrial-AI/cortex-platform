# Contributing

Thanks for helping improve the Cortex Platform.

Basic workflow:
1. Fork the repository.
2. Create a feature branch:
   git checkout -b feat/your-change
3. Make changes, run local tests, and commit.
4. Push and open a pull request against `main` (or the default branch).

Local webhook development:
- Use `webhook_trigger_engine.py`. Install Flask (and stripe if needed).
- Set secrets in a local `.env` from `.env.example`.
- Run the webhook listener locally and expose it with a secure tunnel (e.g., ngrok) to test provider callbacks.

Testing webhooks:
- For Paystack:
  - Start the listener: `python webhook_trigger_engine.py`
  - Expose with ngrok: `ngrok http 8080`
  - Set the Paystack webhook URL to `https://<ngrok-id>.ngrok.io/webhooks/paystack`
  - Use Paystack test tools to trigger `charge.success` events.
- For Stripe (if you enable later), prefer the Stripe CLI and `stripe listen`.

Security:
- Never commit secrets. If a secret was committed, rotate it immediately.
- Add `.env` to `.gitignore`.
- Use repo Actions secrets (Settings → Secrets & variables → Actions) for CI usage.

CI / Deploy notes:
- The repo contains a GitHub Actions workflow to deploy to GitHub Pages and optionally sync to Shopify if secrets are present.
- Before enabling Shopify sync, set these secrets:
  - SHOPIFY_APP_TOKEN (admin-level app automation token)
  - SHOPIFY_STORE_DOMAIN (your-store.myshopify.com)
  - THEME_ID (optional, if uploading theme assets)
