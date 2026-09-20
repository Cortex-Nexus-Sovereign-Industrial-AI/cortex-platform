# Deploy trigger

**Purpose:** Force Netlify continuous deployment to rebuild production from current `main`.

**Site:** https://cortex-platforms.netlify.app  
**Production branch:** `main`  
**Last aligned commit:** PR #36 membership full alignment

If this commit does not produce a new deploy in Netlify:

1. Open https://app.netlify.com/projects/cortex-platforms
2. Deploys → Trigger deploy → Deploy site (or Clear cache and deploy site)
3. Confirm Continuous deployment → Builds are **Active**
4. Confirm production branch is **main**

Member surface after successful deploy:
- /member/
- /member/directory.html
- /member/success.html
- /member/profile.html

Mode remains **test keys** until Director issues live-key command.
