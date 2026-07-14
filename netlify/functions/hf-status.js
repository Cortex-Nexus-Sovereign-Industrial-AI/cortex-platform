// netlify/functions/hf-status.js
// Stub. Same pattern as repo-status.js: fails closed until real session
// verification and a real Hugging Face API call are wired in.

exports.handler = async (event) => {
  const sessionToken = event.headers['x-cinis-session'];

  if (!sessionToken || !isValidSession(sessionToken)) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  // TODO: replace with a real call to https://huggingface.co/api/... using
  // the session-scoped HF token looked up server-side for this session.
  return {
    statusCode: 200,
    body: JSON.stringify({
      space_status: "stub - not yet wired to live Hugging Face data",
      checked_at: new Date().toISOString()
    })
  };
};

function isValidSession(token) {
  return false;
}
