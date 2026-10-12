/**
 * Simple in-memory session store with TTL
 */

const { VoiceSession } = require('./session');

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const store = new Map();

function get(sessionId) {
  const entry = store.get(sessionId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(sessionId);
    return null;
  }
  entry.expiresAt = Date.now() + DEFAULT_TTL_MS; // sliding TTL
  return entry.session;
}

function create(sessionId = null) {
  const session = new VoiceSession(sessionId);
  store.set(session.id, {
    session,
    expiresAt: Date.now() + DEFAULT_TTL_MS
  });
  return session;
}

function getOrCreate(sessionId = null) {
  if (sessionId) {
    const existing = get(sessionId);
    if (existing) return existing;
  }
  return create(sessionId);
}

function remove(sessionId) {
  store.delete(sessionId);
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(id);
  }
}, 60 * 1000).unref();

module.exports = { get, create, getOrCreate, remove, store };
