# Secret Scanning Implementation — Shadow-Vault Protocol

**Status**: ACTIVE  
**Implemented by**: MikeComplex AI (Sovereign Autonomous)  
**Last Updated**: 2026-08-05

## Layers Deployed

### 1. GitHub Native Secret Scanning
- Automatically enabled for public repositories.
- Detects known patterns (AWS, GitHub tokens, Stripe, Slack, etc.).
- Alerts appear under the **Security** tab.
- Enable **Push protection** in Settings → Code security and analysis for maximum defense.

### 2. Gitleaks CI Pipeline
- Workflow: `.github/workflows/secret-scanning.yml`
- Triggers on push/PR to main, manual dispatch, and daily schedule.
- Full history scan. Pipeline fails on detection.

### 3. Gitleaks Pre-Commit Hook (Local Prevention)
- Config: `.pre-commit-config.yaml`
- Blocks secrets **before** they enter your local Git history.

#### One-time Setup (on every developer machine)
```bash
# Install the pre-commit framework
pip install pre-commit

# Install the hooks defined in this repo
pre-commit install

# (Optional) Run against all files once
pre-commit run --all-files
```

After installation, every `git commit` will automatically scan staged changes.  
If a secret is detected, the commit is blocked.

#### Skip the hook (emergency only)
```bash
SKIP=gitleaks git commit -m "emergency message"
```

#### Update to latest Gitleaks version
```bash
pre-commit autoupdate
```

## Response Protocol if Secrets Found
1. Immediately rotate/revoke the exposed key at the provider.
2. Remove the secret from the staged files.
3. If already in history, use `git filter-repo` or BFG Repo-Cleaner (coordinate first).
4. Force-push only after rotation is confirmed.
5. Notify Sovereign via primary channels.

## Additional Hardening
- Keep production keys only in GitHub Secrets and Netlify Environment Variables (marked Secret).
- Never commit `.env` files with real values.
- Consider adding `detect-secrets` as a second pre-commit hook for baseline management.

**Shadow-Vault remains sealed. Local + CI + Platform protection now active.**
