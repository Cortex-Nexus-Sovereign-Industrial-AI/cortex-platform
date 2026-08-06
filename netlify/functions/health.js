/**
 * CINIS NEXUS — Public health endpoint for Netlify
 * Reachable as: /.netlify/functions/health  and  /api/health (via netlify.toml redirect)
 */
exports.handler = async function () {
  const body = {
    status: 'ok',
    platform: 'CINIS NEXUS / Cortex Platform',
    surface: 'netlify-functions',
    timestamp: new Date().toISOString(),
    note: 'Full JWT API runs on Express (backend/server.js or Render). This endpoint confirms the static site + functions deploy is live.'
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(body)
  };
};
