# Deploy Trigger

Triggered: 2026-09-25
Reason: Redeploy connected production services from `main`
Requested by: Repository administrator

This commit forces connected continuous-deployment providers to rebuild and redeploy the current repository state. The canonical backend is under `backend/`; the public static site is configured through `netlify.toml`.

Deployment targets:
- Netlify: `https://cortex-platforms.netlify.app`
- Render: service defined by `render.yaml`, rooted at `backend/`

Secrets remain provider-managed environment variables and are not committed here.
