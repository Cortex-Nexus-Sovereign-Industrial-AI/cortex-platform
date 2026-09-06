// netlify/functions/lib/db.js
// Database connection pool (PostgreSQL)

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('[DB-POOL] Unexpected error on idle client:', err);
});

pool.on('connect', () => {
  console.log('[DB-POOL] New connection established');
});

pool.on('remove', () => {
  console.log('[DB-POOL] Connection removed from pool');
});

export { pool };
