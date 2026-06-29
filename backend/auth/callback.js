import express from "express";
import crypto from "crypto";

const router = express.Router();

const {
  OAUTH_TOKEN_URL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI,
  SESSION_SECRET
} = process.env;

function requireEnv(name, value) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
}

requireEnv("OAUTH_TOKEN_URL", OAUTH_TOKEN_URL);
requireEnv("OAUTH_CLIENT_ID", OAUTH_CLIENT_ID);
requireEnv("OAUTH_CLIENT_SECRET", OAUTH_CLIENT_SECRET);
requireEnv("OAUTH_REDIRECT_URI", OAUTH_REDIRECT_URI);
requireEnv("SESSION_SECRET", SESSION_SECRET);

function safeEquals(a, b) {
  const ab = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

router.get("/callback", async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: "oauth_error",
          message: String(error_description || error)
        }
      });
    }

    if (!code || !state) {
      return res.status(400).json({
        success: false,
        error: {
          code: "missing_parameters",
          message: "Authorization code and state are required."
        }
      });
    }

    const expectedState = req.session?.oauth_state;
    const expectedVerifier = req.session?.code_verifier;

    if (!expectedState || !safeEquals(state, expectedState)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "invalid_state",
          message: "State validation failed."
        }
      });
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: String(code),
      redirect_uri: OAUTH_REDIRECT_URI,
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET
    });

    if (expectedVerifier) {
      body.set("code_verifier", expectedVerifier);
    }

    const tokenResponse = await fetch(OAUTH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({
        success: false,
        error: {
          code: "token_exchange_failed",
          message: tokenData?.error_description || tokenData?.error || "Token exchange failed."
        }
      });
    }

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

    return res.status(200).json({
      success: true,
      data: {
        message: "Authorization completed.",
        authenticated: true
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: "callback_failure",
        message: err.message || "Unexpected callback failure."
      }
    });
  }
});

export default router;
