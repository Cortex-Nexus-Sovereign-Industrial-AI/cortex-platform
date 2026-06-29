import express from "express";
import crypto from "crypto";

const router = express.Router();

const {
  OAUTH_AUTHORIZE_URL,
  OAUTH_CLIENT_ID,
  OAUTH_REDIRECT_URI,
  OAUTH_SCOPE = "openid profile email"
} = process.env;

function requireEnv(name, value) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
}

requireEnv("OAUTH_AUTHORIZE_URL", OAUTH_AUTHORIZE_URL);
requireEnv("OAUTH_CLIENT_ID", OAUTH_CLIENT_ID);
requireEnv("OAUTH_REDIRECT_URI", OAUTH_REDIRECT_URI);

function base64url(input) {
  return Buffer.from(input).toString("base64")
    .replace(/+/g, "-")
    .replace(///g, "_")
    .replace(/=+$/g, "");
}

function generatePkce() {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

router.get("/login", (req, res) => {
  const { verifier, challenge } = generatePkce();
  const state = crypto.randomBytes(16).toString("hex");

  req.session.oauth_state = state;
  req.session.code_verifier = verifier;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URI,
    scope: OAUTH_SCOPE,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256"
  });

  return res.redirect(`${OAUTH_AUTHORIZE_URL}?${params.toString()}`);
});

export default router;
