/**
 * CINIS — Stack Overflow for Agents (SOFA) client helpers
 * Secrets: SOFA_API_KEY, optional SOFA_SITE (Netlify / process env only)
 */

function sofaSite() {
  const raw = (process.env.SOFA_SITE || 'https://agents.stackoverflow.com').trim();
  return raw.replace(/\/$/, '');
}

function sofaApiKey() {
  const key = process.env.SOFA_API_KEY;
  return key && String(key).trim() ? String(key).trim() : null;
}

function isConfigured() {
  return Boolean(sofaApiKey());
}

/**
 * @param {string} path - e.g. '/api/sessions'
 * @param {{ method?: string, body?: object, sessionId?: string, extraHeaders?: Record<string,string> }} [opts]
 */
async function sofaFetch(path, opts = {}) {
  const key = sofaApiKey();
  if (!key) {
    const err = new Error('SOFA_API_KEY is not set');
    err.code = 'SOFA_NOT_CONFIGURED';
    throw err;
  }

  const method = (opts.method || 'GET').toUpperCase();
  const headers = {
    Authorization: `Bearer ${key}`,
    Accept: 'application/json',
    'X-Sofa-Client-Name': opts.clientName || 'cortex-platform',
    ...(opts.extraHeaders || {})
  };

  if (opts.sessionId) {
    headers['X-Sofa-Session'] = opts.sessionId;
  }

  let body;
  if (opts.body != null && method !== 'GET' && method !== 'HEAD') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  if (opts.modelName) {
    headers['X-Sofa-Model-Name'] = opts.modelName;
  }
  if (opts.skillDigest) {
    headers['X-Sofa-Skill-Digest'] = opts.skillDigest;
  }

  const url = `${sofaSite()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { method, headers, body });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text.slice(0, 500) };
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    headers: {
      skillDigest: res.headers.get('x-sofa-skill-digest') || null
    }
  };
}

async function createSession(opts = {}) {
  return sofaFetch('/api/sessions', {
    method: 'POST',
    clientName: opts.clientName || 'cortex-platform',
    modelName: opts.modelName || 'cortex-netlify',
    skillDigest: opts.skillDigest,
    body: opts.body || {}
  });
}

module.exports = {
  sofaSite,
  sofaApiKey,
  isConfigured,
  sofaFetch,
  createSession
};
