/**
 * Simple in-memory session store with TTL
 */

const { VoiceSession } = require('./session');

const DEFAULT_TTL_MS = Number(process.env.VOICE_SESSION_TTL_MS || 30 * 60 * 1000);
const MAX_SESSIONS = Number(process.env.VOICE_MAX_SESSIONS || 200);
const store = new Map();

function get(sessionId) {
  const entry = store.get(sessionId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(sessionId);
    return null;
  }
  entry.expiresAt = Date.now() + DEFAULT_TTL_MS;
  return entry.session;
}

function create(sessionId = null) {
  if (store.size >= MAX_SESSIONS) {
    const oldestKey = [...store.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt)[0]?.[0];
    if (oldestKey) store.delete(oldestKey);
  }

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

setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(id);
  }
}, 60 * 1000).unref();

module.exports = { get, create, getOrCreate, remove, store };
