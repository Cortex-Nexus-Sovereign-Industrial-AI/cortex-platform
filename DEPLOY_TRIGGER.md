# Deploy Trigger

Triggered: 2026-10-06
Reason: Production rebuild from canonical `main` after system alignment
Requested by: Repository administrator

This commit forces connected continuous-deployment providers to rebuild and redeploy the current repository state. The canonical backend is under `backend/`; the public static site is configured through `netlify.toml`.

Deployment authority:
- GitHub repository: `Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform`
- Branch: `main`
- Primary Netlify host: `https://cortex-platforms.netlify.app`

Supporting deployment:
- `https://cortex-intelligence-nexus.netlify.app` is retained as a secondary/supporting deployment and is not the production authority.

Secrets remain provider-managed environment variables and are not committed here.
