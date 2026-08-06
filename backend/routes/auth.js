/**
 * CINIS NEXUS — Auth Routes
 * Wires existing PKCE OAuth login + callback modules.
 */

const express = require('express');
const router = express.Router();

// Dynamic import of ESM auth modules is avoided for CommonJS compatibility.
// These handlers mirror the logic in backend/auth/login.js and callback.js
// so the route file is self-contained and deployable.

const crypto = require('crypto');

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function generatePkce() {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

function safeEquals(a, b) {
  const ab = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// GET /auth/login — start OAuth PKCE flow
router.get('/login', (req, res) => {
  const {
    OAUTH_AUTHORIZE_URL,
    OAUTH_CLIENT_ID,
    OAUTH_REDIRECT_URI,
    OAUTH_SCOPE = 'openid profile email'
  } = process.env;

  if (!OAUTH_AUTHORIZE_URL || !OAUTH_CLIENT_ID || !OAUTH_REDIRECT_URI) {
    return res.status(500).json({
      success: false,
      error: { code: 'config_missing', message: 'OAuth environment variables not configured.' }
    });
  }

  const { verifier, challenge } = generatePkce();
  const state = crypto.randomBytes(16).toString('hex');

  if (req.session) {
    req.session.oauth_state = state;
    req.session.code_verifier = verifier;
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URI,
    scope: OAUTH_SCOPE,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  });

  return res.redirect(`${OAUTH_AUTHORIZE_URL}?${params.toString()}`);
});

// GET /auth/callback — exchange code for tokens
router.get('/callback', async (req, res) => {
  try {
    const {
      OAUTH_TOKEN_URL,
      OAUTH_CLIENT_ID,
      OAUTH_CLIENT_SECRET,
      OAUTH_REDIRECT_URI
    } = process.env;

    const { code, state, error, error_description } = req.query;

    if (error) {
      return res.status(400).json({
        success: false,
        error: { code: 'oauth_error', message: String(error_description || error) }
      });
    }

    if (!code || !state) {
      return res.status(400).json({
        success: false,
        error: { code: 'missing_parameters', message: 'Authorization code and state are required.' }
      });
    }

    const expectedState = req.session?.oauth_state;
    const expectedVerifier = req.session?.code_verifier;

    if (!expectedState || !safeEquals(state, expectedState)) {
      return res.status(400).json({
        success: false,
        error: { code: 'invalid_state', message: 'State validation failed.' }
      });
    }

    if (!OAUTH_TOKEN_URL || !OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_REDIRECT_URI) {
      return res.status(500).json({
        success: false,
        error: { code: 'config_missing', message: 'OAuth token environment variables not configured.' }
      });
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: String(code),
      redirect_uri: OAUTH_REDIRECT_URI,
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET
    });

    if (expectedVerifier) body.set('code_verifier', expectedVerifier);

    const tokenResponse = await fetch(OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({
        success: false,
        error: {
          code: 'token_exchange_failed',
          message: tokenData?.error_description || tokenData?.error || 'Token exchange failed.'
        }
      });
    }

    if (req.session) {
      req.session.tokens = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        id_token: tokenData.id_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        obtained_at: Date.now()
      };
      delete req.session.oauth_state;
      delete req.session.code_verifier;
    }

    return res.status(200).json({
      success: true,
      data: { message: 'Authorization completed.', authenticated: true }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'callback_failure', message: err.message || 'Unexpected callback failure.' }
    });
  }
});

// GET /auth/status — simple session check
router.get('/status', (req, res) => {
  const authenticated = Boolean(req.session?.tokens?.access_token);
  return res.json({ success: true, data: { authenticated } });
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {});
  }
  return res.json({ success: true, data: { message: 'Logged out.' } });
});

module.exports = router;
