// netlify/functions/hf-status.js
// Simplified: uses a server-side fine-grained HF token (HF_API_TOKEN) set
// directly in Netlify env, rather than a token embedded in the user's OAuth
// session. This is a single-owner admin console, not a multi-user login
// flow, so a static server-side token is the right level of complexity —
// no OAuth app, no client secret, no redirect URI to register.
//
// Still requires a valid encrypted session (proof someone went through the
// owner-verification flow) before it will do anything — see lib/session.js.

const { decryptSession } = require('./lib/session');

exports.handler = async (event) => {
  const sessionToken = event.headers['x-cinis-session'];
  const session = decryptSession(sessionToken);

  if (!session) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized or expired session" }) };
  }

  if (!process.env.HF_API_TOKEN) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "not_configured",
        note: "Session valid, but HF_API_TOKEN is not set in Netlify env yet."
      })
    };
  }

  try {
    const resp = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` }
    });

    if (!resp.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: "HF API call failed", status: resp.status }) };
    }

    const data = await resp.json();
    return {
      statusCode: 200,
      body: JSON.stringify({
        hf_user: data.name,
        hf_type: data.type,
        checked_at: new Date().toISOString()
      })
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "Unexpected error", detail: String(err) }) };
  }
};
