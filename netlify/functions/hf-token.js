// netlify/functions/hf-token.js
// Server-side OAuth code-for-token exchange for Hugging Face.
// The HF client secret lives ONLY in Netlify environment variables
// (HF_CLIENT_ID, HF_CLIENT_SECRET) — never in any file shipped to the browser.
//
// Recommended pattern: don't hand the raw HF access_token back to the browser.
// Store it server-side keyed by an opaque session id, and return only that
// session id. Every later privileged call goes browser -> this backend -> HF.
// This build returns the token directly to unblock initial wiring; swap in
// the session-store version before going live with real users.

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
    return {
      statusCode: 200,
      body: JSON.stringify({ access_token: data.access_token, expires_in: data.expires_in })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Unexpected error", detail: String(err) }) };
  }
};
