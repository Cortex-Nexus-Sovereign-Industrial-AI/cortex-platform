/* ============================================
   CORTEX PLATFORM v2.2 — Backend API Server
   Node.js + Express + SQLite
   CINIS NEXUS INDUSTRY OGOJA
   ============================================ */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cortex-secret-key-2026';
if (!process.env.JWT_SECRET) {
  console.warn('[security] JWT_SECRET not set — using development default. Set in production.');
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbPath = path.join(__dirname, 'data', 'cortex.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log('SQLite database connected');
  initializeDatabase();
});

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
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

function initializeDatabase() {
  db.serialize(() => {
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

    db.run(`
      CREATE TABLE IF NOT EXISTS access_grants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        product TEXT NOT NULL,
        order_ref TEXT,
        transaction_reference TEXT,
        granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        active INTEGER DEFAULT 1
      )
    `);

    console.log('Database schema initialized');
  });
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ---------- Health (public) ----------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Cortex Platform v2.2',
    timestamp: new Date().toISOString(),
    database: 'SQLite3',
    paystack_mode: process.env.PAYSTACK_MODE || 'LIVE'
  });
});

// ---------- Auth (public register/login) ----------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, company, location } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await dbRun(
      `INSERT INTO users (name, email, password, company, location) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, company || null, location || null]
    );
    const token = jwt.sign(
      { id: result.id, email, name },
      JWT_SECRET,
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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
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

// Member: current user profile + grants
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, email, name, company, location, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    const grants = await dbAll(
      'SELECT product, order_ref, granted_at, active FROM access_grants WHERE email = ? AND active = 1 ORDER BY granted_at DESC',
      [user.email]
    );
    res.json({ user, grants });
  } catch (err) {
    console.error('auth/me error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// ---------- Orders ----------
// Create order remains public (checkout flow)
app.post('/api/orders', async (req, res) => {
  try {
    const { customer_name, email, phone, product, amount_ngn } = req.body;
    if (!customer_name || !email || !product || !amount_ngn) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (amount_ngn < 100) {
      return res.status(400).json({ error: 'Minimum amount is ₦100' });
    }
    const order_ref = `CORTEX-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const amount_kobo = Math.round(amount_ngn * 100);
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

// List all orders — member only
app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const orders = await dbAll('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ count: orders.length, orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Single order — public by ref for receipt; sensitive fields still limited
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await dbGet(
      'SELECT id, order_ref, customer_name, email, product, amount_ngn, status, created_at, paid_at FROM orders WHERE id = ? OR order_ref = ?',
      [req.params.id, req.params.id]
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ---------- Paystack ----------
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_live_your_secret_key';

const verifyPaystackSignature = (req, secret) => {
  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  return hash === req.headers['x-paystack-signature'];
};

app.post('/api/webhooks/paystack', async (req, res) => {
  try {
    const isValid = verifyPaystackSignature(req, PAYSTACK_SECRET_KEY);
    await dbRun(
      `INSERT INTO webhook_logs (event_type, data, signature, verified) VALUES (?, ?, ?, ?)`,
      [
        req.body.event || 'unknown',
        JSON.stringify(req.body),
        req.headers['x-paystack-signature'] || '',
        isValid ? 1 : 0
      ]
    );

    if (!isValid) {
      console.warn('Invalid Paystack signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, data } = req.body;

    if (event === 'charge.success') {
      const { reference, amount, customer, metadata } = data;
      const amount_ngn = amount / 100;
      const email = customer?.email || metadata?.email || 'unknown@cortex.local';
      const product = metadata?.product || 'Cortex Platform';

      let order = await dbGet('SELECT * FROM orders WHERE paystack_ref = ?', [reference]);

      if (!order) {
        const order_ref = `CORTEX-WEBHOOK-${Date.now()}`;
        const result = await dbRun(
          `INSERT INTO orders (order_ref, customer_name, email, phone, product, amount_ngn, amount_kobo, status, paystack_ref, paystack_transaction_id, payment_channel, paid_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?, 'paystack', CURRENT_TIMESTAMP)`,
          [
            order_ref,
            metadata?.customer_name || email,
            email,
            metadata?.phone || null,
            product,
            amount_ngn,
            amount,
            reference,
            data.id
          ]
        );
        order = { id: result.id, order_ref };
      } else {
        await dbRun(
          `UPDATE orders SET status = 'completed', paystack_transaction_id = ?, paid_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [data.id, order.id]
        );
      }

      await dbRun(
        `INSERT INTO transactions (order_id, reference, amount_ngn, gateway, status, verified_at, raw_response)
         VALUES (?, ?, ?, 'paystack', 'verified', CURRENT_TIMESTAMP, ?)`,
        [order.id, reference, amount_ngn, JSON.stringify(data)]
      );

      // Grant access after successful payment
      await dbRun(
        `INSERT INTO access_grants (email, product, order_ref, transaction_reference, active)
         VALUES (?, ?, ?, ?, 1)`,
        [email, product, order.order_ref || null, reference]
      );

      console.log(`Payment verified + access granted: ${reference} (₦${amount_ngn}) → ${email}`);
      return res.json({ success: true, message: 'Payment verified and access granted' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

app.post('/api/payments/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ error: 'Reference required' });
    const transaction = await dbGet(
      'SELECT t.*, o.order_ref, o.product, o.email FROM transactions t LEFT JOIN orders o ON t.order_id = o.id WHERE t.reference = ?',
      [reference]
    );
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({
      verified: transaction.status === 'verified',
      transaction: {
        reference,
        amount_ngn: transaction.amount_ngn,
        status: transaction.status,
        verified_at: transaction.verified_at,
        product: transaction.product,
        email: transaction.email
      }
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Stats — member only (contains revenue)
app.get('/api/stats', verifyToken, async (req, res) => {
  try {
    const totalOrders = await dbGet('SELECT COUNT(*) as count FROM orders');
    const completedOrders = await dbGet('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
    const totalRevenue = await dbGet('SELECT SUM(amount_ngn) as total FROM orders WHERE status = "completed"');
    const pendingOrders = await dbGet('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
    const grants = await dbGet('SELECT COUNT(*) as count FROM access_grants WHERE active = 1');
    res.json({
      total_orders: totalOrders.count || 0,
      completed_orders: completedOrders.count || 0,
      pending_orders: pendingOrders.count || 0,
      total_revenue_ngn: totalRevenue.total || 0,
      active_access_grants: grants.count || 0,
      platform: 'Cortex v2.2',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`
  ═══════════════════════════════════════════════════════════
  CORTEX PLATFORM v2.2 — Backend API
  ═══════════════════════════════════════════════════════════
  Port: ${PORT}
  Env: ${process.env.NODE_ENV || 'development'}
  DB: SQLite3 (${dbPath})

  Public:
    GET  /api/health
    POST /api/auth/register
    POST /api/auth/login
    POST /api/orders
    GET  /api/orders/:id
    POST /api/payments/verify
    POST /api/webhooks/paystack

  Protected (Bearer JWT):
    GET  /api/auth/me
    GET  /api/orders
    GET  /api/stats
  ═══════════════════════════════════════════════════════════
  `);
});

module.exports = app;
