// netlify/functions/hf-status.js
// Requires a valid encrypted session. Uses the HF token embedded in that
// session (decrypted server-side only) to call the HF API on the user's
// behalf — the browser never sees this token.

const { decryptSession } = require('./lib/session');

exports.handler = async (event) => {
  const sessionToken = event.headers['x-cinis-session'];
  const session = decryptSession(sessionToken);

  if (!session || !session.hf_access_token) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized or expired session" }) };
  }

  try {
    const resp = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: { Authorization: `Bearer ${session.hf_access_token}` }
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
