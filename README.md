# Cortex-Platform  
**Sovereign Industrial AI • Enterprise SDK & Governance Framework**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)  
[![Netlify Status](https://api.netlify.com/api/v1/badges/<YOUR_NETLIFY_SITE_ID>/deploy-status)](https://app.netlify.com/sites/<YOUR_SITE>/deploys)  
![CI](https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform/actions/workflows/ci.yml/badge.svg)

> Build once, run anywhere—on-prem, edge, or sovereign cloud—under your governance, not Big-Tech’s.

---

## 60-second Quick Start

```bash
git clone https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform.git
cd cortex-platform
docker compose up          # spins up local dev cluster + API
curl http://localhost:8080/health
```

SDK smoke-test (Python ≥3.9):

```bash
pip install -e ./millions-sdk-core
python - <<'PY'
from cortex.millions import Agent
print(Agent("demo").run("ping"))
PY
```

---

## Why Cortex-Platform?

| Pain | Our Answer |
|---|---|
| Vendor lock-in & data exfil | Air-gapped containers, signed images, policy-as-code |
| Fragmented OT/IT stacks | One control-plane for agents, pipelines, edge inference |
| Compliance overhead | SBOM, provenance, immutable audit logs out-of-the-box |

---

## Architecture (one picture)

```
┌─────────────┐      gRPC        ┌──────────────┐
│   Agents    │◄───────────────►│  Core API    │
└─────────────┘                 └──────┬───────┘
                                       │HTTPS
                               ┌───────▼───────┐
                               │  Edge Nodes   │
                               └───────────────┘
```

Full diagram & ADRs → [`ARCHITECTURE.md`](ARCHITECTURE.md)

---

## Repository Layout

```
agents/               – pluggable autonomous workers
api/                  – FastAPI gateway + OpenAPI specs
backend/              – Go/Python micro-services
docs/                 – MkDocs sources → Netlify
edge/                 – ONNX/TensorRT runtimes for NVIDIA Jetson, etc.
frontend/             – React dev-console
millions-sdk-core/    – Python SDK (`pip install cortex-millions`)
prisma/               – schema & migrations
```

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).  
We follow Conventional Commits + signed DCO.

---

## Enterprise & Security

- **License**: Apache 2.0 (commercial-friendly)  
- **Security policy**: [`SECURITY.md`](SECURITY.md)  
- **Contact sales / pilot**: <info@cortex-platforms.netlify.app>

© 2025 Cortex Intelligence Nexus – EU sovereign stack.
```

────────────────
2. One-liner to push the new README

```bash
# Run from the repo root on your laptop or Codespace
curl -s https://raw.githubusercontent.com/<your-username>/cortex-platform/main/README.md \
  > README.md.new \
&& mv README.md.new README.md \
&& git add README.md \
&& git commit -m "docs: enterprise-grade README + badges" \
&& git push origin main
```

────────────────
3. GitHub Action – auto-deploy docs to Netlify  

`.github/workflows/deploy-netlify.yml`

```yaml
name: Deploy Docs to Netlify

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'README.md'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm i -g netlify-cli
      - name: Deploy
        run: netlify deploy --prod --dir=site --message "docs update ${{ github.sha }}"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

Add the two secrets in **Settings → Secrets and variables → Actions**.
