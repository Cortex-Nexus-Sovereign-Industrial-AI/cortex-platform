/**
 * SOFA configuration status (does not expose the API key)
 * GET /.netlify/functions/sofa-status  or  /api/sofa-status
 */

const { isConfigured, sofaSite } = require('./lib/sofa');

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors(), body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const configured = isConfigured();
  return json(200, {
    service: 'sofa',
    configured,
    site: sofaSite(),
    endpoints: {
      status: '/api/sofa-status',
      session: '/api/sofa-session'
    },
    note: configured
      ? 'SOFA_API_KEY is set in this environment. POST /api/sofa-session to open a session.'
      : 'Set SOFA_API_KEY in Netlify (or local) environment variables.',
    timestamp: new Date().toISOString()
  });
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors() },
    body: JSON.stringify(body)
  };
}
