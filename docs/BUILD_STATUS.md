# Build Status — Director Session
**Updated:** 2026-09-21 ~00:40 WAT

## Mode
**Test keys** — live switch only on Director command.

## GitHub `main`
✅ Aligned

- PR #35 + PR #36 merged
- Deploy trigger commit: `docs/DEPLOY_TRIGGER.md`
- Member: dashboard, directory, success, profile, `_nav.js`
- Webhook grant logging on main
- Docs: PLATFORM_STRUCTURE, ACCESS_FLOW, LIVE_KEY_SWITCH, NEXT_ACTIONS

## Netlify production
❌ **Lagging**

| Item | Value |
|------|--------|
| Site | cortex-platforms |
| Current published deploy | Older production (not latest main) |
| Live `/member/` | Old SPA shell — not new Member Dashboard yet |
| Auto-deploy from Git push to main | **Not observed** |

### Required Founder action (≈1 min)

1. Open https://app.netlify.com/projects/cortex-platforms  
2. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**  
3. Confirm Continuous deployment → Builds = **Active**  
4. Confirm production branch = **main**  

After success, verify titles show **Member Dashboard | Cortex Intelligence Nexus**:
- https://cortex-platforms.netlify.app/member/  
- https://cortex-platforms.netlify.app/member/directory.html  
- https://cortex-platforms.netlify.app/member/success.html  

## Still progressive (coding)
- Durable access-grant store
- Full auth
- Real directory data

## Live key
Do **not** switch until Director explicit command. See `docs/commerce/LIVE_KEY_SWITCH.md`.
