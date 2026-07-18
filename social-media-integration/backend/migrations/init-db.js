"use strict";

const db = require('../utils/database');
const logger = require('../utils/logger');

const schema = `
-- Social Accounts Table
CREATE TABLE IF NOT EXISTS social_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL CHECK(platform IN ('twitter', 'linkedin', 'tiktok', 'instagram', 'youtube', 'medium', 'telegram', 'whatsapp')),
  account_name TEXT NOT NULL,
  credentials JSON NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(platform, account_name)
);

-- Post Queue Table
CREATE TABLE IF NOT EXISTS post_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  media_urls JSON,
  scheduled_at DATETIME,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'posted', 'failed')),
  posted_at DATETIME,
  platform_post_id TEXT,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(account_id) REFERENCES social_accounts(id) ON DELETE CASCADE
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  platform_post_id TEXT,
  content_preview TEXT,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0,
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(account_id) REFERENCES social_accounts(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_post_queue_status ON post_queue(status);
CREATE INDEX IF NOT EXISTS idx_post_queue_scheduled ON post_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_analytics_account ON analytics(account_id);
`;

try {
  const statements = schema.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    db.exec(statement);
  }
  
  logger.info('✅ Database schema initialized successfully');
} catch (error) {
  logger.error(`❌ Database initialization failed: ${error.message}`);
  process.exit(1);
}
