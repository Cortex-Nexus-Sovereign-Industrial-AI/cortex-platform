/* ============================================
   CORTEX PLATFORM v2.3 — Backend API Server (durable idempotent webhooks)
   Node.js + Express + SQLite
   CINIS NEXUS INDUSTRY OGOJA
   ============================================ */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
let sqlite3;
try {
  sqlite3 = require('sqlite3').verbose();
} catch (err) {
  console.log('[AI Studio] SQLite native package not found — using in-memory SQLite mock');
  sqlite3 = require('./lib/sqliteMock').verbose();
}
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  verifyPaystackRaw,
  claimWebhookEvent,
  markWebhookProcessed
} = require('./lib/webhookIdempotency');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_JSON_BYTES = Number(process.env.MAX_JSON_BYTES || 1024 * 1024);
const MAX_URLENCODED_BYTES = Number(process.env.MAX_URLENCODED_BYTES || 1024 * 1024);
const JWT_SECRET = process.env.JWT_SECRET || 'cortex-secret-key-2026';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production.');
}
if (!process.env.JWT_SECRET) {
  console.warn('[security] JWT_SECRET not set — using development default. Set in production.');
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));

// Capture raw body for Paystack HMAC; parse JSON for all routes
app.use(
  express.json({
    limit: `${MAX_JSON_BYTES}bytes`,
    verify: (req, res, buf) => {
      req.rawBody = buf ? buf.toString('utf8') : '';
    }
  })
);
app.use(express.urlencoded({ extended: true, limit: `${MAX_URLENCODED_BYTES}bytes` }));
