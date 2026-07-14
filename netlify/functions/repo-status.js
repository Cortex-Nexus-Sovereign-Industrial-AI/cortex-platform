// netlify/functions/repo-status.js
// Requires a valid encrypted session (proof the user completed HF sign-in)
// before returning anything. The actual GitHub read uses a separate,
// narrowly-scoped token stored server-side — GITHUB_STATUS_TOKEN — never
// the owner's personal PAT, and never sent to the browser.

const { decryptSession } = require('./lib/session');

exports.handler = async (event) => {
  const sessionToken = event.headers['x-cinis-session'];
  const session = decryptSession(sessionToken);

  if (!session) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized or expired session" }) };
  }

  if (!process.env.GITHUB_STATUS_TOKEN) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        repo: "Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform",
        status: "not_configured",
        note: "Session valid, but GITHUB_STATUS_TOKEN is not set in Netlify env yet."
      })
    };
  }

  try {
    const resp = await fetch(
      "https://api.github.com/repos/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform",
      { headers: { Authorization: `Bearer ${process.env.GITHUB_STATUS_TOKEN}`, "User-Agent": "cinis-dev-console" } }
    );
    const data = await resp.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        repo: data.full_name,
        default_branch: data.default_branch,
        open_issues: data.open_issues_count,
        pushed_at: data.pushed_at,
        checked_at: new Date().toISOString()
      })
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "GitHub API call failed", detail: String(err) }) };
  }
};
