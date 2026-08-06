# Authentication Setup — CINIS NEXUS

## What Exists
- PKCE OAuth login flow (`backend/auth/login.js` + wired in `backend/routes/auth.js`)
- OAuth callback with state + code_verifier validation
- Session status endpoint: `GET /auth/status`
- Logout: `POST /auth/logout`
- Guard middleware: `backend/middleware/requireAuth.js`

## Required Environment Variables
```
OAUTH_AUTHORIZE_URL=
OAUTH_TOKEN_URL=
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_REDIRECT_URI=
OAUTH_SCOPE=openid profile email
SESSION_SECRET=
```

## Routes
| Method | Path | Purpose |
|--------|------|--------|
| GET | /auth/login | Start OAuth PKCE flow |
| GET | /auth/callback | Exchange code for tokens |
| GET | /auth/status | Check if session is authenticated |
| POST | /auth/logout | Destroy session |

## Protecting Member Routes
```js
const requireAuth = require('../middleware/requireAuth');
router.get('/member/dashboard', requireAuth, handler);
```

## Notes
- Frontend currently has a cosmetic auth overlay; real protection must remain server-side.
- Until OAuth provider credentials are configured, `/auth/login` returns a clear config_missing error instead of failing silently.
