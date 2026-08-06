# Netlify Readiness Checklist

**Target:** https://cortex-platforms.netlify.app

## Present
- `netlify.toml` exists
- `netlify/functions/` folder with:
  - paystack-webhook.js
  - hf-status.js / hf-token.js
  - repo-status.js
  - session helper

## Actions to Complete
- [ ] Verify site is connected to this GitHub repo (or correct branch)
- [ ] Set environment variables in Netlify UI (Paystack keys, any HF tokens, database URLs)
- [ ] Confirm build command and publish directory
- [ ] Test functions endpoints after deploy
- [ ] Add custom domain later if desired

## Recommendation
Keep the main public marketing surface on GitHub Pages for now and use Netlify for the dynamic app shell + functions. Both surfaces must link to each other and to the Command Center.
