# Dev console integration

This panel is not wired into `index.html` automatically — splicing it into a
604-line live SPA without review risked breaking the page, so it's staged
here for you to review first.

## To integrate

1. Copy the contents of `dev-console.html` in just before `</body>` in `index.html`.
2. Add `<script src="dev-console/dev-console.js"></script>` after it.
3. Add matching CSS for `.dev-console`, `.dev-console.hidden { display: none; }`
   etc. to `styles.css` — none included here since it should match your
   existing gold/dark design system rather than introduce a new one.
4. The panel calls `/api/repo-status` and `/api/hf-status` — these don't exist
   yet. They're stubs showing the intended pattern (backend re-checks a real
   credential, not just "the panel is visible so allow it"). Build those next,
   or tell Claude to, once `/api/hf-token` is live and tested.

## Still needed before this is live

- `HF_CLIENT_ID` / `HF_CLIENT_SECRET` set in Netlify env (not in any repo file)
- HF OAuth app's redirect URI registered as `https://cortex-platforms.netlify.app/`
- `/api/repo-status` and `/api/hf-status` backend endpoints (not yet built)
- Real CSS for the panel matching the site's design system
