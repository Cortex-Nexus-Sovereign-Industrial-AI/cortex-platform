/**
 * Pure JavaScript in-memory SQLite mock for Cortex Platform.
 * Fully compatible with sqlite3.Database API (run, get, all, serialize).
 * Zero native binary dependencies — boots instantly in any environment.
 */

const bcrypt = require('bcryptjs');

class MockDatabase {
  constructor(filename, callback) {
    this.tables = {
      users: [],
      orders: [],
      transactions: [],
      webhook_logs: [],
      access_grants: [],
      processed_webhooks: []
    };
    this.counters = {
      users: 0,
      orders: 0,
      transactions: 0,
      webhook_logs: 0,
      access_grants: 0,
      processed_webhooks: 0
    };

    // Seed default admin/demo user
    const defaultPassword = bcrypt.hashSync('cortex2026', 10);
    this.tables.users.push({
      id: ++this.counters.users,
      email: 'cortexnexus@proton.me',
      password: defaultPassword,
      name: 'Michael Ujuku Morim',
      company: 'Cortex Intelligence Nexus',
      location: 'Ogoja, Nigeria',
      is_guest: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Seed a completed order for telemetry metrics
    const orderId = ++this.counters.orders;
    const now = new Date().toISOString();
    this.tables.orders.push({
      id: orderId,
      user_id: 1,
      order_ref: 'CORTEX-INITIAL-001',
      customer_name: 'Michael Ujuku Morim',
      email: 'cortexnexus@proton.me',
      phone: '+2348000000000',
      product: 'Sovereign Industrial AI Core',
      amount_ngn: 250000,
      amount_kobo: 25000000,
      currency: 'NGN',
      status: 'completed',
      paystack_ref: 'PAY-INIT-001',
      paystack_transaction_id: 1001,
      payment_channel: 'paystack',
      created_at: now,
      paid_at: now
    });

    this.tables.access_grants.push({
      id: ++this.counters.access_grants,
      email: 'cortexnexus@proton.me',
      product: 'Sovereign Industrial AI Core',
      order_ref: 'CORTEX-INITIAL-001',
      transaction_reference: 'PAY-INIT-001',
      granted_at: now,
      active: 1
    });

    if (typeof callback === 'function') {
      setTimeout(() => callback(null), 0);
    }
  }

  serialize(fn) {
    if (typeof fn === 'function') fn();
  }

  run(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];

    const normalizedSql = sql.trim();
    const ctx = { lastID: 0, changes: 0 };

    try {
      if (normalizedSql.startsWith('CREATE TABLE') || normalizedSql.startsWith('CREATE UNIQUE INDEX')) {
        // Schema initialization no-op
        ctx.changes = 0;
      } else if (normalizedSql.includes('INSERT INTO users')) {
        const [name, email, password, company, location] = params;
        const exists = this.tables.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
        if (exists) {
          const err = new Error('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email');
          if (callback) return callback.call(ctx, err);
          return;
        }
        const user = {
          id: ++this.counters.users,
          name,
          email,
          password,
          company: company || null,
          location: location || null,
          is_guest: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.tables.users.push(user);
        ctx.lastID = user.id;
        ctx.changes = 1;
      } else if (normalizedSql.includes('INSERT INTO orders')) {
        const [order_ref, customer_name, email, phone, product, amount_ngn, amount_kobo, status, paystack_ref, paystack_transaction_id, payment_channel, paid_at] = params;
        const order = {
          id: ++this.counters.orders,
          order_ref,
          customer_name,
          email,
          phone: phone || null,
          product,
          amount_ngn: Number(amount_ngn) || 0,
          amount_kobo: Number(amount_kobo) || 0,
          currency: 'NGN',
          status: status || 'pending',
          paystack_ref: paystack_ref || null,
          paystack_transaction_id: paystack_transaction_id || null,
          payment_channel: payment_channel || null,
          created_at: new Date().toISOString(),
          paid_at: paid_at || (status === 'completed' ? new Date().toISOString() : null)
        };
        this.tables.orders.push(order);
        ctx.lastID = order.id;
        ctx.changes = 1;
      } else if (normalizedSql.includes('UPDATE orders SET')) {
        if (normalizedSql.includes('status = \'completed\'')) {
          const [paystack_transaction_id, id] = params;
          const order = this.tables.orders.find(o => o.id === Number(id));
          if (order) {
            order.status = 'completed';
            order.paystack_transaction_id = paystack_transaction_id || order.paystack_transaction_id;
            order.paid_at = new Date().toISOString();
            ctx.changes = 1;
          }
        }
      } else if (normalizedSql.includes('INSERT INTO transactions')) {
        const [order_id, reference, amount_ngn, raw_response] = [params[0], params[1], params[2], params[params.length - 1]];
        const tx = {
          id: ++this.counters.transactions,
          order_id,
          reference,
          amount_ngn: Number(amount_ngn) || 0,
          gateway: 'paystack',
          status: 'verified',
          raw_response: raw_response || null,
          created_at: new Date().toISOString(),
          verified_at: new Date().toISOString()
        };
        this.tables.transactions.push(tx);
        ctx.lastID = tx.id;
        ctx.changes = 1;
      } else if (normalizedSql.includes('INSERT INTO webhook_logs')) {
        const [event_type, data, signature, verified] = params;
        const log = {
          id: ++this.counters.webhook_logs,
          event_type,
          data,
          signature,
          verified: verified ? 1 : 0,
          created_at: new Date().toISOString()
        };
        this.tables.webhook_logs.push(log);
        ctx.lastID = log.id;
        ctx.changes = 1;
      } else if (normalizedSql.includes('INSERT OR IGNORE INTO access_grants')) {
        const [email, product, order_ref, transaction_reference] = params;
        const exists = this.tables.access_grants.find(
          g => g.email.toLowerCase() === String(email).toLowerCase() && g.product === product
        );
        if (!exists) {
          const grant = {
            id: ++this.counters.access_grants,
            email,
            product,
            order_ref,
            transaction_reference,
            granted_at: new Date().toISOString(),
            active: 1
          };
          this.tables.access_grants.push(grant);
          ctx.lastID = grant.id;
          ctx.changes = 1;
        } else {
          ctx.changes = 0;
        }
      } else if (normalizedSql.includes('INSERT OR IGNORE INTO processed_webhooks')) {
        const [event_type, reference, paystack_id] = params;
        const exists = this.tables.processed_webhooks.find(
          w => w.event_type === event_type && w.reference === reference
        );
        if (!exists) {
          const pw = {
            id: ++this.counters.processed_webhooks,
            event_type,
            reference,
            paystack_id,
            status: 'processing',
            created_at: new Date().toISOString()
          };
          this.tables.processed_webhooks.push(pw);
          ctx.lastID = pw.id;
          ctx.changes = 1;
        } else {
          ctx.changes = 0;
        }
      } else if (normalizedSql.includes('UPDATE processed_webhooks SET status = \'processed\'')) {
        const [event_type, reference] = params;
        const pw = this.tables.processed_webhooks.find(
          w => w.event_type === event_type && w.reference === reference
        );
        if (pw) {
          pw.status = 'processed';
          ctx.changes = 1;
        }
      }

      if (callback) callback.call(ctx, null);
    } catch (err) {
      if (callback) callback.call(ctx, err);
    }
  }

  get(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];
    const normalizedSql = sql.trim();

    try {
      let row = null;

      if (normalizedSql.includes('SELECT id FROM users WHERE email = ?')) {
        const user = this.tables.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
        row = user ? { id: user.id } : undefined;
      } else if (normalizedSql.includes('SELECT * FROM users WHERE email = ?')) {
        const user = this.tables.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
        row = user ? { ...user } : undefined;
      } else if (normalizedSql.includes('FROM users WHERE id = ?')) {
        const user = this.tables.users.find(u => u.id === Number(params[0]));
        if (user) {
          const { password, ...safeUser } = user;
          row = safeUser;
        }
      } else if (normalizedSql.includes('FROM orders WHERE id = ? OR order_ref = ?')) {
        const param = params[0];
        const order = this.tables.orders.find(o => o.id === Number(param) || o.order_ref === String(param));
        row = order ? { ...order } : undefined;
      } else if (normalizedSql.includes('FROM orders WHERE paystack_ref = ?')) {
        const order = this.tables.orders.find(o => o.paystack_ref === String(params[0]));
        row = order ? { ...order } : undefined;
      } else if (normalizedSql.includes('FROM processed_webhooks WHERE event_type = ? AND reference = ?')) {
        const [event_type, reference] = params;
        const pw = this.tables.processed_webhooks.find(
          w => w.event_type === event_type && w.reference === reference
        );
        row = pw ? { ...pw } : undefined;
      } else if (normalizedSql.includes('FROM transactions t LEFT JOIN orders o')) {
        const reference = params[0];
        const tx = this.tables.transactions.find(t => t.reference === String(reference));
        if (tx) {
          const order = this.tables.orders.find(o => o.id === tx.order_id) || {};
          row = {
            ...tx,
            order_ref: order.order_ref || null,
            product: order.product || null,
            email: order.email || null
          };
        }
      } else if (normalizedSql.includes('SELECT COUNT(*) as count FROM orders WHERE status = "completed"')) {
        const count = this.tables.orders.filter(o => o.status === 'completed').length;
        row = { count };
      } else if (normalizedSql.includes('SELECT COUNT(*) as count FROM orders WHERE status = "pending"')) {
        const count = this.tables.orders.filter(o => o.status === 'pending').length;
        row = { count };
      } else if (normalizedSql.includes('SELECT COUNT(*) as count FROM orders')) {
        row = { count: this.tables.orders.length };
      } else if (normalizedSql.includes('SELECT SUM(amount_ngn) as total FROM orders WHERE status = "completed"')) {
        const total = this.tables.orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + (Number(o.amount_ngn) || 0), 0);
        row = { total };
      } else if (normalizedSql.includes('SELECT COUNT(*) as count FROM access_grants WHERE active = 1')) {
        const count = this.tables.access_grants.filter(g => g.active === 1).length;
        row = { count };
      }

      if (callback) callback(null, row);
    } catch (err) {
      if (callback) callback(err);
    }
  }

  all(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];
    const normalizedSql = sql.trim();

    try {
      let rows = [];

      if (normalizedSql.includes('FROM orders ORDER BY created_at DESC')) {
        rows = [...this.tables.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (normalizedSql.includes('FROM access_grants WHERE email = ?')) {
        const email = String(params[0]).toLowerCase();
        rows = this.tables.access_grants
          .filter(g => g.email.toLowerCase() === email && g.active === 1)
          .sort((a, b) => new Date(b.granted_at) - new Date(a.granted_at));
      }

      if (callback) callback(null, rows);
    } catch (err) {
      if (callback) callback(err);
    }
  }
}

module.exports = {
  verbose: () => ({
    Database: MockDatabase
  }),
  Database: MockDatabase
};
