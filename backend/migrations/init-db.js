/* ============================================
   Database Initialization Script
   Run this to set up a fresh database
   ============================================ */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'cortex.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`📁 Created directory: ${dataDir}`);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
  console.log('✅ Database connection established');
  initializeSchema();
});

function initializeSchema() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        company TEXT,
        location TEXT,
        is_guest BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('✅ Users table ready');
    });

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        order_ref TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        product TEXT NOT NULL,
        amount_ngn REAL NOT NULL,
        amount_kobo INTEGER NOT NULL,
        currency TEXT DEFAULT 'NGN',
        status TEXT DEFAULT 'pending',
        paystack_ref TEXT,
        paystack_transaction_id INTEGER,
        payment_channel TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        paid_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating orders table:', err);
      else console.log('✅ Orders table ready');
    });

    // Transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        user_id INTEGER,
        reference TEXT UNIQUE NOT NULL,
        amount_ngn REAL NOT NULL,
        gateway TEXT DEFAULT 'paystack',
        status TEXT DEFAULT 'pending',
        raw_response TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        verified_at DATETIME,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating transactions table:', err);
      else console.log('✅ Transactions table ready');
    });

    // Webhooks log table
    db.run(`
      CREATE TABLE IF NOT EXISTS webhook_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        data TEXT NOT NULL,
        signature TEXT,
        verified BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating webhook_logs table:', err);
      else console.log('✅ Webhook logs table ready');
    });
  });

  // Close database after creating tables
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
        process.exit(1);
      }
      console.log(`
        ═════════════════════════════════════════════════
        ✅ DATABASE INITIALIZATION COMPLETE
        ═════════════════════════════════════════════════
        
        📁 Database: ${dbPath}
        
        Tables created:
          • users
          • orders
          • transactions
          • webhook_logs
        
        Next steps:
        1. Configure .env file with your Paystack keys
        2. npm install
        3. npm run dev
        
        ═════════════════════════════════════════════════
      `);
      process.exit(0);
    });
  }, 1000);
}
