const REQUIRED_PRODUCTION_ENV = [
  'JWT_SECRET',
  'PAYSTACK_SECRET_KEY',
  'FRONTEND_URL',
  'DATABASE_URL'
];

function buildAllowedOrigins(raw = '') {
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function assertProductionConfig() {
  const env = process.env.NODE_ENV || 'development';
  if (env !== 'production') return true;

  const missing = REQUIRED_PRODUCTION_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required production env vars: ${missing.join(', ')}`);
  }

  return true;
}

function getRuntimeConfig() {
  const env = process.env.NODE_ENV || 'development';
  const databaseUrl = process.env.DATABASE_URL || '';
  const usePostgres = Boolean(databaseUrl);

  return {
    env,
    isProduction: env === 'production',
    databaseUrl,
    databaseType: usePostgres ? 'postgres' : 'sqlite',
    allowedOrigins: buildAllowedOrigins(process.env.ALLOWED_ORIGINS || ''),
    maxJsonBytes: Number(process.env.MAX_JSON_BYTES || 1024 * 1024),
    maxUrlEncodedBytes: Number(process.env.MAX_URLENCODED_BYTES || 1024 * 1024),
    voiceSessionTtlMs: Number(process.env.VOICE_SESSION_TTL_MS || 30 * 60 * 1000),
    voiceMaxSessions: Number(process.env.VOICE_MAX_SESSIONS || 200),
    maxAudioBytesPerTurn: Number(process.env.MAX_AUDIO_BYTES_PER_TURN || 20 * 1024 * 1024),
    maxAudioChunksPerTurn: Number(process.env.MAX_AUDIO_CHUNKS_PER_TURN || 256)
  };
}

module.exports = {
  assertProductionConfig,
  getRuntimeConfig,
  REQUIRED_PRODUCTION_ENV
};
