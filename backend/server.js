/* ============================================
   CORTEX PLATFORM v2.1 — Backend API Server
   Node.js + Express + SQLite
   ============================================ */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE INITIALIZATION
// ============================================
const dbPath = path.join(__dirname, 'data', 'cortex.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  }
  console.log('✅ SQLite database connected');
  initializeDatabase();
});

// Run database query with promises
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// ============================================
// DATABASE SCHEMA
// ============================================
function initializeDatabase() {
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
    `);

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
    `);

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
    `);

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
    `);

    console.log('✅ Database schema initialized');
  });
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cortex-secret-key-2026');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============================================
// API ENDPOINTS: HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Cortex Platform v2.1',
    timestamp: new Date().toISOString(),
    database: 'SQLite3',
    paystack_mode: process.env.PAYSTACK_MODE || 'LIVE'
  });
});

// ============================================
// API ENDPOINTS: AUTHENTICATION
// ============================================

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, company, location } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await dbRun(
      `INSERT INTO users (name, email, password, company, location) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, company || null, location || null]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: result.id, email, name },
      process.env.JWT_SECRET || 'cortex-secret-key-2026',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: result.id, name, email },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'cortex-secret-key-2026',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============================================
// API ENDPOINTS: ORDERS
// ============================================

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer_name, email, phone, product, amount_ngn } = req.body;
    
    if (!customer_name || !email || !product || !amount_ngn) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate minimum amount (₦100)
    if (amount_ngn < 100) {
      return res.status(400).json({ error: 'Minimum amount is ₦100' });
    }

    // Generate order reference
    const order_ref = `CORTEX-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const amount_kobo = Math.round(amount_ngn * 100);

    // Create order
    const result = await dbRun(
      `INSERT INTO orders (order_ref, customer_name, email, phone, product, amount_ngn, amount_kobo, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [order_ref, customer_name, email, phone || null, product, amount_ngn, amount_kobo]
    );

    res.status(201).json({
      message: 'Order created',
      order: {
        id: result.id,
        order_ref,
        customer_name,
        email,
        product,
        amount_ngn,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await dbAll('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await dbGet('SELECT * FROM orders WHERE id = ? OR order_ref = ?', 
      [req.params.id, req.params.id]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ============================================
// API ENDPOINTS: PAYSTACK INTEGRATION
// ============================================
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_live_your_secret_key';
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'pk_live_d7f59d46d24abebfb35ae3ae5b397f8ba4e919fc';

// Verify Paystack signature
const verifyPaystackSignature = (req, secret) => {
  const hash = require('crypto')
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  return hash === req.headers['x-paystack-signature'];
};

// Paystack webhook endpoint
app.post('/api/webhooks/paystack', async (req, res) => {
  try {
    // Verify signature
    const isValid = verifyPaystackSignature(req, PAYSTACK_SECRET_KEY);
    
    // Log webhook
    await dbRun(
      `INSERT INTO webhook_logs (event_type, data, signature, verified)
       VALUES (?, ?, ?, ?)`,
      [
        req.body.event || 'unknown',
        JSON.stringify(req.body),
        req.headers['x-paystack-signature'] || '',
        isValid ? 1 : 0
      ]
    );

    if (!isValid) {
      console.warn('❌ Invalid Paystack signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, data } = req.body;

    if (event === 'charge.success') {
      const { reference, amount, customer, metadata } = data;
      const amount_ngn = amount / 100; // Convert from kobo

      // Find order by metadata or create new one
      let order = await dbGet(
        'SELECT * FROM orders WHERE paystack_ref = ?',
        [reference]
      );

      if (!order) {
        // Create order from webhook data
        const order_ref = `CORTEX-WEBHOOK-${Date.now()}`;
        const result = await dbRun(
          `INSERT INTO orders (order_ref, customer_name, email, phone, product, amount_ngn, amount_kobo, status, paystack_ref, paystack_transaction_id, payment_channel, paid_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?, 'paystack', CURRENT_TIMESTAMP)`,
          [
            order_ref,
            metadata?.customer_name || customer?.email || 'Unknown',
            customer?.email || 'unknown@cortex.local',
            metadata?.phone || null,
            metadata?.product || 'Cortex Platform',
            amount_ngn,
            amount,
            reference,
            data.id
          ]
        );
        order = { id: result.id, order_ref };
      } else {
        // Update existing order
        await dbRun(
          `UPDATE orders SET status = 'completed', paystack_transaction_id = ?, paid_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [data.id, order.id]
        );
      }

      // Create transaction record
      await dbRun(
        `INSERT INTO transactions (order_id, reference, amount_ngn, gateway, status, verified_at, raw_response)
         VALUES (?, ?, ?, 'paystack', 'verified', CURRENT_TIMESTAMP, ?)`,
        [order.id, reference, amount_ngn, JSON.stringify(data)]
      );

      console.log(`✅ Payment verified: ${reference} (₦${amount_ngn})`);
      return res.json({ success: true, message: 'Payment verified' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Verify payment (for frontend verification)
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    
    if (!reference) {
      return res.status(400).json({ error: 'Reference required' });
    }

    // Check if transaction exists
    const transaction = await dbGet(
      'SELECT t.*, o.* FROM transactions t JOIN orders o ON t.order_id = o.id WHERE t.reference = ?',
      [reference]
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
      verified: transaction.status === 'verified',
      transaction: {
        reference,
        amount_ngn: transaction.amount_ngn,
        status: transaction.status,
        verified_at: transaction.verified_at
      }
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// ============================================
// API ENDPOINTS: STATISTICS
// ============================================

// Get platform statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalOrders = await dbGet('SELECT COUNT(*) as count FROM orders');
    const completedOrders = await dbGet('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
    const totalRevenue = await dbGet('SELECT SUM(amount_ngn) as total FROM orders WHERE status = "completed"');
    const pendingOrders = await dbGet('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');

    res.json({
      total_orders: totalOrders.count || 0,
      completed_orders: completedOrders.count || 0,
      pending_orders: pendingOrders.count || 0,
      total_revenue_ngn: totalRevenue.total || 0,
      platform: 'Cortex v2.1',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
  ═══════════════════════════════════════════════════════════
  ⚡ CORTEX PLATFORM v2.1 — Backend API
  ═══════════════════════════════════════════════════════════
  
  🚀 Server started on PORT ${PORT}
  📍 Environment: ${process.env.NODE_ENV || 'development'}
  💾 Database: SQLite3 (${dbPath})
  🏠 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
  
  📚 API ENDPOINTS:
  ─────────────────────────────────────────────────────────
  Health Check:
    GET  /api/health
  
  Authentication:
    POST /api/auth/register
    POST /api/auth/login
  
  Orders:
    GET  /api/orders
    GET  /api/orders/:id
    POST /api/orders
  
  Payments (Paystack):
    POST /api/payments/verify
    POST /api/webhooks/paystack (Paystack webhook)
  
  Statistics:
    GET  /api/stats
  
  ═══════════════════════════════════════════════════════════
  CINIS NEXUS INDUSTRY OGOJA
  ═══════════════════════════════════════════════════════════
  `);
});

module.exports = app;
