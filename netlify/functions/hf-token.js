// netlify/functions/hf-token.js
// Server-side OAuth code-for-token exchange for Hugging Face.
// The HF client secret lives ONLY in Netlify env (HF_CLIENT_ID, HF_CLIENT_SECRET).
//
// On success, the raw HF access token is NOT returned to the browser.
// Instead it's encrypted (see lib/session.js) into an opaque session blob
// that the browser stores and sends back on later calls, but cannot read
// or forge. This is what repo-status.js / hf-status.js verify.

const { encryptSession } = require('./lib/session');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let code;
  try {
    ({ code } = JSON.parse(event.body || "{}"));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (!code) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing code" }) };
  }

  if (!process.env.HF_CLIENT_ID || !process.env.HF_CLIENT_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server not configured: missing HF_CLIENT_ID/HF_CLIENT_SECRET" }) };
  }
  if (!process.env.SESSION_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server not configured: missing SESSION_SECRET" }) };
  }

  try {
    const resp = await fetch("https://huggingface.co/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.HF_CLIENT_ID,
        client_secret: process.env.HF_CLIENT_SECRET,
        redirect_uri: "https://cortex-platforms.netlify.app/"
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return { statusCode: 502, body: JSON.stringify({ error: "HF token exchange failed", detail: errText }) };
    }

    const data = await resp.json();
    const expiresInMs = (data.expires_in || 3600) * 1000;

    const session = encryptSession({
      hf_access_token: data.access_token,
      exp: Date.now() + expiresInMs
    });

    // Browser gets an opaque, encrypted blob — never the raw HF token.
    return {
      statusCode: 200,
      body: JSON.stringify({ session, expires_in: data.expires_in })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Unexpected error", detail: String(err) }) };
  }
};
