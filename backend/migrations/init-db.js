#!/usr/bin/env node

/**
 * CORTEX PLATFORM v2.1 — Database Migration Runner
 * Phase 3: Initialize SQLite database with production schema
 * 
 * Usage:
 *   node migrations/init-db.js
 * 
 * This script:
 * 1. Creates SQLite database (if not exists)
 * 2. Initializes all tables (users, orders, payments, webhooks)
 * 3. Sets up indexes for performance
 * 4. Creates backup of existing database
 * 5. Logs all operations
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const DB_PATH = process.env.DATABASE_PATH || './data/cortex.db';
const DB_BACKUP_PATH = process.env.DATABASE_BACKUP_PATH || './backups';
const ENV = process.env.NODE_ENV || 'development';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

// ============================================
// UTILITIES
// ============================================

function log(type, message) {
  const timestamp = new Date().toISOString();
  const prefix = {
    'INFO': `${colors.blue}[INFO]${colors.reset}`,
    'SUCCESS': `${colors.green}[SUCCESS]${colors.reset}`,
    'WARN': `${colors.yellow}[WARN]${colors.reset}`,
    'ERROR': `${colors.red}[ERROR]${colors.reset}`
  }[type] || type;

  console.log(`${prefix} [${timestamp}] ${message}`);
}

function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log('INFO', `Created directory: ${dirPath}`);
  }
}

function backupDatabase() {
  createDirIfNotExists(DB_BACKUP_PATH);

  if (fs.existsSync(DB_PATH)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupFile = path.join(DB_BACKUP_PATH, `cortex-${timestamp}-${Date.now()}.db.backup`);
    fs.copyFileSync(DB_PATH, backupFile);
    log('SUCCESS', `Database backed up: ${backupFile}`);
    return backupFile;
  }
  return null;
}

// ============================================
// SCHEMA DEFINITIONS
// ============================================

const SCHEMA = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      subscription_tier TEXT DEFAULT 'free',
      subscription_status TEXT DEFAULT 'active',
      verified BOOLEAN DEFAULT 0,
      verification_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_tier);
    CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);
  `,

  orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      order_number TEXT UNIQUE NOT NULL,
      description TEXT,
      amount_naira INTEGER NOT NULL,
      currency TEXT DEFAULT 'NGN',
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      paystack_reference TEXT UNIQUE,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_paystack_ref ON orders(paystack_reference);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
  `,

  payments: `
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount_naira INTEGER NOT NULL,
      amount_kobo INTEGER NOT NULL,
      currency TEXT DEFAULT 'NGN',
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      paystack_reference TEXT UNIQUE,
      paystack_authorization_url TEXT,
      paystack_access_code TEXT,
      payer_email TEXT,
      payer_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_payments_paystack_ref ON payments(paystack_reference);
    CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);
  `,

  webhooks: `
    CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      provider TEXT NOT NULL,
      payload TEXT NOT NULL,
      paystack_reference TEXT,
      order_id TEXT,
      status TEXT DEFAULT 'received',
      processed_at DATETIME,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
    CREATE INDEX IF NOT EXISTS idx_webhooks_provider ON webhooks(provider);
    CREATE INDEX IF NOT EXISTS idx_webhooks_event ON webhooks(event_type);
    CREATE INDEX IF NOT EXISTS idx_webhooks_status ON webhooks(status);
    CREATE INDEX IF NOT EXISTS idx_webhooks_paystack_ref ON webhooks(paystack_reference);
    CREATE INDEX IF NOT EXISTS idx_webhooks_created ON webhooks(created_at);
  `,

  email_logs: `
    CREATE TABLE IF NOT EXISTS email_logs (
      id TEXT PRIMARY KEY,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      template TEXT,
      status TEXT DEFAULT 'pending',
      order_id TEXT,
      user_id TEXT,
      sent_at DATETIME,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
    CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
    CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at);
  `,

  audit_logs: `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      resource_type TEXT,
      resource_id TEXT,
      user_id TEXT,
      old_value TEXT,
      new_value TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
  `
};

// ============================================
// DATABASE INITIALIZATION
// ============================================

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Create data directory
    createDirIfNotExists(path.dirname(DB_PATH));

    // Backup existing database
    if (fs.existsSync(DB_PATH) && ENV === 'production') {
      backupDatabase();
    }

    // Open/create database
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        log('ERROR', `Failed to open database: ${err.message}`);
        reject(err);
        return;
      }

      log('SUCCESS', `Connected to database: ${DB_PATH}`);

      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          log('WARN', `Could not enable foreign keys: ${err.message}`);
        }
      });

      // Create all tables
      const tableNames = Object.keys(SCHEMA);
      let tablesCreated = 0;

      tableNames.forEach((tableName) => {
        db.exec(SCHEMA[tableName], (err) => {
          if (err) {
            log('ERROR', `Failed to create table ${tableName}: ${err.message}`);
            reject(err);
            return;
          }

          log('SUCCESS', `Created/verified table: ${tableName}`);
          tablesCreated++;

          // All tables created
          if (tablesCreated === tableNames.length) {
            resolve(db);
          }
        });
      });
    });
  });
}

// ============================================
// VERIFICATION & REPORTING
// ============================================

function verifyDatabase(db) {
  return new Promise((resolve, reject) => {
    log('INFO', 'Verifying database integrity...');

    db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `, (err, tables) => {
      if (err) {
        log('ERROR', `Verification failed: ${err.message}`);
        reject(err);
        return;
      }

      log('SUCCESS', `Database verification passed`);
      console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
      console.log(`${colors.green}MIGRATION COMPLETE${colors.reset}`);
      console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
      console.log(`\n📊 Tables Created: ${tables.length}`);
      tables.forEach((table) => {
        console.log(`   ✓ ${table.name}`);
      });
      console.log(`\n📁 Database Path: ${DB_PATH}`);
      console.log(`🔐 Environment: ${ENV}`);
      console.log(`⏰ Completed: ${new Date().toISOString()}`);
      console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

      resolve();
    });
  });
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  try {
    log('INFO', `Starting database migration (${ENV} environment)...`);

    const db = await initializeDatabase();
    await verifyDatabase(db);

    db.close((err) => {
      if (err) {
        log('WARN', `Database close warning: ${err.message}`);
      }
      process.exit(0);
    });
  } catch (error) {
    log('ERROR', `Migration failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  main();
}

module.exports = { initializeDatabase };