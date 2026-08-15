────────────────
A. `CONTRIBUTING.md`

```markdown
# Contributing to Cortex-Platform

Thank you for investing your time to improve Cortex-Platform!  
All contributions are governed by the Apache-2.0 license and our [Code of Conduct](CODE_OF_CONDUCT.md).

## Quick links
- [Open issues](https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform/issues)
- [Discussions](https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform/discussions)
- Security reports → security@cortex-platforms.netlify.app (PGP key on request)

## Development setup
1. `git clone …`
2. `make dev` (or `docker compose up`)
3. Run tests: `make test`

## Pull-request checklist
- [ ] Signed DCO (`git commit -s`)
- [ ] Conventional commit message (`feat:`, `fix:`, `docs:`, `chore:`)
- [ ] New or changed code must have tests
- [ ] `make lint` passes
- [ ] Documentation updated (`docs/` or README)

## Governance
Minor fixes & docs → direct merge by maintainers.  
New features → RFC in Discussions → two approvals + security review.

First-time contributors: look for issues tagged `good first issue`.
```

────────────────
B. `.github/workflows/deploy-netlify.yml`

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths: ['docs/**', 'README.md', 'CONTRIBUTING.md']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm i -g netlify-cli
      - run: netlify deploy --prod --dir=site
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

────────────────
C. `.github/ISSUE_TEMPLATE/config.yml` (optional but signals maturity)

```yaml
blank_issues_enabled: false
contact_links:
  - name: Security Vulnerability
    url: https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform/security/advisories/new
    about: Please report security issues here.
```

Reply **“3”** after you push these three files.
