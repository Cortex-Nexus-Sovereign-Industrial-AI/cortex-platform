# Secret Scanning Implementation — Shadow-Vault Protocol

**Status**: ACTIVE  
**Implemented by**: MikeComplex AI (Sovereign Autonomous)  
**Last Updated**: 2026-08-05

## Layers Deployed

### 1. GitHub Native Secret Scanning
- Automatically enabled for public repositories.
- Detects known patterns. Alerts under the **Security** tab.
- Enable **Push protection** in Settings → Code security and analysis.

### 2. Gitleaks CI Pipeline
- Workflow: `.github/workflows/secret-scanning.yml`
- Full history + daily scans. Pipeline fails on detection.

### 3. Gitleaks Pre-Commit Hook + Custom Rules
- Config files:
  - `.pre-commit-config.yaml`
  - `.gitleaks.toml` (custom CINIS rules)

#### Custom Rules Included
- CINIS / Cortex / VEXENOS internal API keys
- Paystack secret keys
- Flutterwave secret keys
- Shopify access tokens
- Hugging Face tokens
- Netlify tokens
- Generic high-entropy secrets

Plus full default Gitleaks rule set (`useDefault = true`).

#### One-time Setup
```bash
pip install pre-commit
pre-commit install
```

Every `git commit` now uses the customized rules.

#### Skip (emergency only)
```bash
SKIP=gitleaks git commit -m "message"
```

#### Update Gitleaks version
```bash
pre-commit autoupdate
```

## Response Protocol if Secrets Found
1. Rotate/revoke the key immediately at the provider.
2. Remove from staged files.
3. Purge from history if necessary (`git filter-repo` / BFG).
4. Notify Sovereign.

**Shadow-Vault is now protected at local, CI, and platform levels with CINIS-specific rules.**
