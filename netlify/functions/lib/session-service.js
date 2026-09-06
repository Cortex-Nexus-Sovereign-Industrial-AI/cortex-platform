// netlify/functions/lib/session-service.js
// Anonymous session creation and management

import crypto from 'crypto';

export async function createAnonymousSession() {
  try {
    const sessionId = `sess_${crypto.randomBytes(16).toString('hex')}`;
    console.log(`[SESSION-SERVICE] Anonymous session created: ${sessionId}`);
    return sessionId;
  } catch (error) {
    console.error('[SESSION-SERVICE] createAnonymousSession error:', error);
    throw error;
  }
}

export async function validateSession(sessionId) {
  try {
    // Phase 1: Simple validation
    // Phase 2: Store and validate against database
    const isValid = sessionId && sessionId.startsWith('sess_') && sessionId.length > 10;
    return isValid;
  } catch (error) {
    console.error('[SESSION-SERVICE] validateSession error:', error);
    throw error;
  }
}

export function generateSessionCookie(sessionId, maxAgeSeconds = 3600) {
  return `cinis_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}
