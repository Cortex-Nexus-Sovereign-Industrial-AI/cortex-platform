# Deploy alignment — current build

## Expected after `main` deploy

| Path | Expected |
|------|----------|
| `/` | Marketing homepage (`index.html`) — Cortex Intelligence Nexus |
| `/identity.html` | Identity & verification |
| `/metrics-dashboard.html` | Platform Pulse Phase 0 |
| `/offers.html` | Offers |
| `/ns/context.jsonld` | Agent JSON-LD context |
| `/api/health` | Function health |

## If Netlify still shows the old login SPA on every path

1. Confirm site **cortex-platforms** is linked to org repo `Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform` branch `main`.
2. Trigger **Clear cache and deploy site** in Netlify.
3. Confirm `netlify.toml` on the published deploy has **no** `/* → /index.html` SPA rule.
4. Do not confuse secondary project `cortex-intelligence-nexus` with the SSOT host.

## Settings checklist

| Setting | Value |
|---------|--------|
| Public brand | Cortex Intelligence Nexus |
| Website (GBP) | https://cortex-platforms.netlify.app/ |
| Secrets | Netlify env only |
| SPA rewrite | Disabled (static files honest) |
