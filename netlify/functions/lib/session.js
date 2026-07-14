// netlify/functions/lib/session.js
// Stateless, encrypted session tokens. No external DB required.
//
// Requires SESSION_SECRET in Netlify env — 32+ random bytes, e.g.:
//   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
//
// A session token is: base64url(iv) + "." + base64url(authTag) + "." + base64url(ciphertext)
// The plaintext payload is JSON: { hf_access_token, exp }  (exp = ms since epoch)

const crypto = require('crypto');

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET not configured');
  // Derive a 32-byte key from whatever length secret is configured.
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptSession(payload) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString('base64url'),
    authTag.toString('base64url'),
    ciphertext.toString('base64url')
  ].join('.');
}

function decryptSession(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const key = getKey();
    const [ivB64, tagB64, ctB64] = parts;
    const iv = Buffer.from(ivB64, 'base64url');
    const authTag = Buffer.from(tagB64, 'base64url');
    const ciphertext = Buffer.from(ctB64, 'base64url');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const payload = JSON.parse(plaintext.toString('utf8'));

    if (!payload.exp || Date.now() > payload.exp) {
      return null; // expired
    }
    return payload;
  } catch (err) {
    // Tampered, wrong key, or malformed — treat as invalid, fail closed.
    return null;
  }
}

module.exports = { encryptSession, decryptSession };
