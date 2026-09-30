# Files and folders to archive before production

The following items should be moved out of the active repository or archived until they are production-ready.

## Folders to archive

These are experimental or non-core modules:

- `social-media-integration/` — Separate service, not core platform
- `agents/` — Experimental AI agents
- `edge/` — Edge computing experiments
- `api/` — Duplicate or alternate API
- `cortex.api/` — Alternate API structure
- `netlify/` — Netlify-specific config (use Netlify UI instead)
- `Node/` — Unrelated
- `dev-console/` — Development tool
- `prisma/` — ORM experiments
- `shadow-vault-schema/` — Unrelated
- `core-monolith/` — Alternate architecture
- `millions-sdk-core/` — Unrelated

## Files to archive

Experimental scripts and alternate implementations:

- `agent.py` — Experimental agent
- `cinis_orchestrator.py` — Orchestration experiment
- `webhook_trigger_engine.py` — Webhook experiment
- `ws_server.py` — WebSocket experiment
- `zero_engine.py` — Engine experiment
- `enterprise_engine.py` — Enterprise experiment
- `my_first_agent.py` — Test agent
- `my_scout_agent.py` — Test agent
- `concurrent_settlements.py` — Settlements experiment
- `app.py` — Alternate Python app
- `engine.py` — Engine experiment
- `fire-blueprint-runner.js` — Blueprint runner
- `cinis-ai-worker*.js` — Worker experiments
- `hf-oauth-handler.js` — OAuth handler
- `webhook.py` — Webhook script
- `orchestrate.js.txt` — Orchestration script

## Duplicate HTML files

Only keep the canonical versions:

Keep:
- `index.html`
- `offers.html`
- `identity.html`
- `metrics-dashboard.html`
- `member-dashboard.html`
- `support.html`
- `join.html`
- `research.html`
- `products.html`
- `projects.html`
- `documentation.html`
- `documents.html`

Archive:
- `index-9.html`
- `index-10.html`
- `index-production.html`
- `index_complete.html`
- `funnel-lane.html`
- `funnel-lane (1).html`
- `funnel-lane (2).html`
- `funnel-lane (3).html`
- `funnel-lane (4).html`
- `funnel-lane (5).html`
- `funnel-lane (7).html`
- `funnel-lane (8).html`
- `gemini-code-*.html`
- `pipe_money_loop_pipeline.html`
- `cortex-connector-hub*.html`

## Media and asset files to review

These are large and may not be needed in production:

- `cinis_x5f_studio_x5f_deployment_x5f_combined.html` (4MB)
- `cinis_printable_study_guide.html` (200KB)
- `about_blank.PDF` (2.2MB)
- `infographics_*.pdf` (1.6MB)
- `Global_Correction_Protocol_*.pdf` (1.1MB)
- Various image files from media folder

Recommendation: Move to separate media repository or CDN.

## Why archive?

- **Clarity**: Keep the live app simple and understandable
- **Maintenance**: Don't have to manage unused code
- **Deployment speed**: Smaller repo = faster deploys
- **Security**: Fewer files = smaller attack surface
- **Focus**: Team knows which files are production
- **Experiment isolation**: Experimental work stays separate

## How to archive

1. Create a separate `cortex-platform-experiments/` repo
2. Move experimental folders and files there
3. Keep reference links in this repo if needed
4. Delete from production repo
5. Commit with message: "Archive experimental modules for production focus"

## What stays

In production repo:
- `backend/` — Core API
- `public/` — Frontend pages
- `docs/` — Documentation
- `README_PRODUCTION.md` — Production guide
- `PRODUCTION_DEPLOYMENT.md` — Deployment guide
- `PRODUCTION_CHECKLIST.md` — Launch checklist
- Root config files (package.json, render.yaml, .env.example, .gitignore)

---

**Note**: Archiving does not mean deleting. Use Git branches or separate repos to preserve this work.
