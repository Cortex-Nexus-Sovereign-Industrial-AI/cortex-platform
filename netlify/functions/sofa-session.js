/**
 * Create a SOFA session using server-side SOFA_API_KEY
 * POST /.netlify/functions/sofa-session  or  /api/sofa-session
 *
 * Optional JSON body: { "modelName": "...", "clientName": "...", "skillDigest": "..." }
 * Never returns the API key.
 */

const { isConfigured, createSession } = require('./lib/sofa');

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  if (!isConfigured()) {
    return json(503, {
      error: 'SOFA not configured',
      code: 'SOFA_NOT_CONFIGURED',
      hint: 'Set SOFA_API_KEY in Netlify environment variables, then redeploy.'
    });
  }

  let payload = {};
  try {
    const raw =
      event.isBase64Encoded && event.body
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body || '{}';
    payload = typeof raw === 'string' ? JSON.parse(raw || '{}') : raw || {};
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  try {
    const result = await createSession({
      clientName: payload.clientName || 'cortex-platform',
      modelName: payload.modelName || 'cortex-netlify',
      skillDigest: payload.skillDigest
    });

    if (!result.ok) {
      return json(result.status >= 400 ? result.status : 502, {
        error: 'SOFA session failed',
        status: result.status,
        detail: result.data
      });
    }

    return json(201, {
      ok: true,
      session_id: result.data && result.data.session_id,
      expires_at: result.data && result.data.expires_at,
      guidance: result.data && result.data.guidance,
      skill_digest_observed: result.headers.skillDigest,
      source: 'netlify/functions/sofa-session'
    });
  } catch (err) {
    console.error('[sofa-session]', err.message);
    return json(500, {
      error: 'SOFA request failed',
      message: err.message
    });
  }
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors() },
    body: JSON.stringify(body)
  };
}
