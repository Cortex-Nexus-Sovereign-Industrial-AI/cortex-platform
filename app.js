/* ============================================
   CORTEX PLATFORM v2.2 — Application Logic
   JWT API auth + LIVE Paystack Integration
   CINIS NEXUS INDUSTRY OGOJA
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const PAYSTACK_PUBLIC_KEY_LIVE = 'pk_live_d7f59d46d24abebfb35ae3ae5b397f8ba4e919fc';
const PAYSTACK_PUBLIC_KEY_TEST = 'pk_test_cfeb04b79e16c6c813c17f654766bfd09c7ece0f';

let PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY_LIVE;
let PAYSTACK_MODE = 'live';

// API base: local backend when developing; same-origin / empty for production proxy
const API_BASE = (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:5000'
  : (window.CORTEX_API_BASE || '');

const TOKEN_KEY = 'cortex_jwt';

// ============================================
// STATE MANAGEMENT
// ============================================
const CortexState = {
  user: null,
  isAuth: false,
  token: localStorage.getItem(TOKEN_KEY) || null,
  currentTab: 'dashboard',
  currentVoice: 'cortex',
  settingsTab: 'account',
  contentType: 'email',
  messages: [],
  tasks: [],
  orders: JSON.parse(localStorage.getItem('cortex_orders') || '[]'),
  payments: { paystack: [], flutterwave: [] },
  shopifyConnected: true,
  notifications: [],
  compactSidebar: false,
  accentColor: '#6366f1',
  totalRevenue: parseFloat(localStorage.getItem('cortex_revenue') || '0'),
  paymentMode: localStorage.getItem('cortex_payment_mode') || 'live',
  socialLinks: {
    x: 'https://x.com/MikeComplexAie',
    youtube: 'https://www.youtube.com/@MikecomplexAI-i2e',
    tiktok: 'https://www.tiktok.com/@cinisnio.ai',
    linkedin: 'https://www.linkedin.com/in/michaelujukumorim',
    github: 'https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform',
    shopify: 'https://cortex-intelligence-nexus.myshopify.com',
    substack: 'https://mikecomplexai.substack.com'
  }
};

if (CortexState.paymentMode === 'test') {
  PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY_TEST;
  PAYSTACK_MODE = 'test';
}

const VOICES = {
  cortex: {
    name: 'Cortex Nexus',
    avatar: '⚡',
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    greeting: 'Sovereign industrial AI core online. How may I assist your operations today?',
    style: 'authoritative, precise',
    responses: [
      'Command acknowledged. Executing deterministic sequence.',
      'Analysis complete. Optimized workflow ready.',
      'Edge-resilient operation initiated.',
      'Orchestrating across local nodes.',
      'Industrial automation protocol activated.'
    ]
  },
  mikecomplex: {
    name: 'MikeComplex AI',
    avatar: '🧠',
    gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)',
    greeting: 'Greetings. MikeComplex AI — strategic advisor for CINIS NEXUS.',
    style: 'visionary, strategic',
    responses: [
      'Excellent strategic direction.',
      'From Ogoja to the world — scale plan ready.',
      'Market landscape analyzed.',
      'Vision and execution aligned.',
      'Growth roadmap prepared.'
    ]
  },
  builder: {
    name: 'Builder Bot',
    avatar: '🔨',
    gradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    greeting: 'Builder Bot ready. What are we building?',
    style: 'technical',
    responses: [
      'Code structure initialized.',
      'Architecture mapped.',
      'Module generation complete.',
      'Deterministic build engaged.',
      'Deploy template ready.'
    ]
  },
  scout: {
    name: 'Scout AI',
    avatar: '🔍',
    gradient: 'linear-gradient(135deg, #be185d, #ec4899)',
    greeting: 'Scout AI reporting. Intelligence and research online.',
    style: 'data-driven',
    responses: [
      'Intelligence gathered.',
      'Market reconnaissance complete.',
      'Actionable insights ready.',
      'Trend analysis complete.',
      'Competitive landscape mapped.'
    ]
  }
};

const CONTENT_TEMPLATES = {
  email: { title: 'Email Campaign Generator', placeholder: 'Enter email subject line...', tone: 'Professional', audience: 'Nigerian SMEs and industrial partners' },
  social: { title: 'Social Media Post Generator', placeholder: 'Enter post headline...', tone: 'Engaging', audience: 'Tech entrepreneurs' },
  product: { title: 'Product Description Generator', placeholder: 'Enter product name...', tone: 'Persuasive', audience: 'B2B and e-commerce' },
  blog: { title: 'Blog Article Generator', placeholder: 'Enter article title...', tone: 'Informative', audience: 'Industry professionals' },
  ad: { title: 'Ad Copy Generator', placeholder: 'Enter ad headline...', tone: 'Persuasive', audience: 'Targeted audience' },
  seo: { title: 'SEO Content Generator', placeholder: 'Enter target keyword...', tone: 'Optimized', audience: 'Search users' }
};

// ============================================
// API HELPER
// ============================================
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (CortexState.token) headers['Authorization'] = 'Bearer ' + CortexState.token;
  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data;
}

// ============================================
// AUTHENTICATION (JWT backend + offline fallback)
// ============================================
async function initAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    CortexState.token = token;
    try {
      const data = await apiFetch('/api/auth/me');
      CortexState.user = { ...data.user, grants: data.grants || [] };
      CortexState.isAuth = true;
      localStorage.setItem('cortex_user', JSON.stringify(CortexState.user));
      showApp();
      addLog('Session restored via API — ' + CortexState.user.email, 'success');
      return;
    } catch (err) {
      // Token invalid or API offline — clear token, try local guest/user
      localStorage.removeItem(TOKEN_KEY);
      CortexState.token = null;
    }
  }

  const savedUser = localStorage.getItem('cortex_user');
  if (savedUser) {
    CortexState.user = JSON.parse(savedUser);
    CortexState.isAuth = true;
    showApp();
    updateOrdersTable();
    updateRevenueDisplay();
  }
}

async function handleAuth(e) {
  e.preventDefault();
  const isSignUp = document.getElementById('auth-title').textContent === 'Create Account';
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;

  if (!email || !password) {
    alert('Email and password are required.');
    return;
  }

  // Prefer real backend API
  try {
    if (isSignUp) {
      const name = document.getElementById('auth-name').value.trim() || email.split('@')[0];
      const confirm = document.getElementById('auth-confirm').value;
      if (password !== confirm) {
        alert('Passwords do not match!');
        return;
      }
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      CortexState.token = data.token;
      CortexState.user = data.user;
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem('cortex_user', JSON.stringify(data.user));
      CortexState.isAuth = true;
      showApp();
      addLog('Registered via API — ' + email, 'success');
      return;
    }

    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    CortexState.token = data.token;
    CortexState.user = data.user;
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem('cortex_user', JSON.stringify(data.user));
    CortexState.isAuth = true;
    showApp();
    addLog('Logged in via API — ' + email, 'success');
    return;
  } catch (err) {
    // Offline / API not running — local demo mode
    addLog('API unavailable (' + err.message + ') — local session mode', 'warn');
    if (isSignUp) {
      const name = document.getElementById('auth-name').value.trim() || email.split('@')[0];
      const confirm = document.getElementById('auth-confirm').value;
      if (password !== confirm) {
        alert('Passwords do not match!');
        return;
      }
      CortexState.user = { name, email, created: new Date().toISOString(), localOnly: true };
    } else {
      CortexState.user = {
        name: email.split('@')[0] || 'User',
        email,
        created: new Date().toISOString(),
        localOnly: true
      };
    }
    localStorage.setItem('cortex_user', JSON.stringify(CortexState.user));
    CortexState.isAuth = true;
    showApp();
    addLog('Local session — start backend for full JWT auth', 'warn');
  }
}

function toggleAuthMode() {
  const isSignUp = document.getElementById('auth-title').textContent !== 'Create Account';
  document.getElementById('auth-title').textContent = isSignUp ? 'Create Account' : 'Welcome to Cortex';
  document.getElementById('auth-btn').textContent = isSignUp ? 'Create Account' : 'Sign In';
  document.getElementById('auth-toggle-text').textContent = isSignUp ? 'Already have an account?' : 'No account?';
  document.getElementById('auth-toggle-btn').textContent = isSignUp ? 'Sign in' : 'Create one';
  document.getElementById('name-field').style.display = isSignUp ? 'block' : 'none';
  document.getElementById('confirm-field').style.display = isSignUp ? 'block' : 'none';
}

function guestAccess() {
  CortexState.user = { name: 'Guest', email: 'guest@cortex.local', isGuest: true };
  CortexState.isAuth = true;
  showApp();
  addLog('Guest access granted — limited features', 'warn');
}

function showApp() {
  document.getElementById('auth-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  if (CortexState.user) {
    const name = CortexState.user.name || 'User';
    document.getElementById('user-name').textContent = name.split(' ')[0];
    document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
  }
  addLog('Platform session — Paystack ' + (PAYSTACK_MODE === 'live' ? 'LIVE' : 'TEST'), 'success');
  updateOrdersTable();
  updateRevenueDisplay();
  renderSocialLinks();
}

function signOut() {
  localStorage.removeItem('cortex_user');
  localStorage.removeItem(TOKEN_KEY);
  CortexState.user = null;
  CortexState.token = null;
  CortexState.isAuth = false;
  location.reload();
}

// ============================================
// SOCIAL MEDIA LINKS
// ============================================
function renderSocialLinks() {
  const footerSocial = document.getElementById('footer-social-links');
  if (footerSocial) {
    footerSocial.innerHTML = Object.entries(CortexState.socialLinks).map(([platform, url]) =>
      '<a href="' + url + '" target="_blank" rel="noopener noreferrer" title="' +
      platform + '" class="social-link">' + getSocialIcon(platform) + '</a>'
    ).join('');
  }
}

function getSocialIcon(platform) {
  const icons = {
    x: '𝕏', youtube: '▶', tiktok: '♪', linkedin: '🔗',
    github: '⚙', shopify: '🛒', substack: '📬'
  };
  return icons[platform] || '🔗';
}

// ============================================
// NAVIGATION
// ============================================
function switchTab(tabId) {
  CortexState.currentTab = tabId;
  document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const panel = document.getElementById('tab-' + tabId);
  if (panel) panel.classList.add('active');
  const navItem = document.querySelector('.nav-item[data-tab="' + tabId + '"]');
  if (navItem) navItem.classList.add('active');
  addLog('Navigated to ' + tabId, 'info');
}

function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  if (menu) menu.classList.toggle('show');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.top-bar-right')) {
    const menu = document.getElementById('user-menu');
    if (menu) menu.classList.remove('show');
  }
});

// ============================================
// PAYSTACK
// ============================================
function payWithPaystack() {
  const email = document.getElementById('paystack-email').value;
  const amountInput = document.getElementById('paystack-amount').value;
  const name = document.getElementById('paystack-name').value;
  const phone = document.getElementById('paystack-phone') ? document.getElementById('paystack-phone').value : '';
  const product = document.getElementById('paystack-product') ? document.getElementById('paystack-product').value : 'Cortex Platform';

  if (!email || !amountInput || !name) {
    showPaymentStatus('error', 'Please fill in Email, Amount, and Name.');
    return;
  }

  const amount = parseInt(amountInput, 10) * 100;
  if (amount < 10000) {
    showPaymentStatus('error', 'Minimum amount is ₦100.');
    return;
  }

  const reference = 'CORTEX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  showPaymentStatus('processing', 'Initializing Paystack...');

  if (typeof PaystackPop === 'undefined') {
    showPaymentStatus('error', 'Paystack script not loaded.');
    return;
  }

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amount,
    currency: 'NGN',
    ref: reference,
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
        { display_name: 'Phone Number', variable_name: 'phone', value: phone },
        { display_name: 'Product', variable_name: 'product', value: product }
      ]
    },
    callback: function (response) {
      const ngnAmount = amount / 100;
      showPaymentStatus('success',
        'Payment Successful!\nReference: ' + response.reference +
        '\nAmount: ₦' + ngnAmount.toLocaleString()
      );
      recordOrder({
        id: reference,
        customer: name,
        email: email,
        amount: '₦' + ngnAmount.toLocaleString(),
        status: 'Paid',
        reference: response.reference,
        date: new Date().toLocaleString(),
        channel: 'Paystack'
      });
      CortexState.totalRevenue += ngnAmount;
      localStorage.setItem('cortex_revenue', CortexState.totalRevenue.toString());
      updateRevenueDisplay();
      addLog('Paystack SUCCESS: ₦' + ngnAmount.toLocaleString(), 'success');
    },
    onClose: function () {
      showPaymentStatus('cancelled', 'Payment window closed.');
      addLog('Paystack cancelled', 'warn');
    }
  });
  handler.openIframe();
}

function showPaymentStatus(type, message) {
  const panel = document.getElementById('payment-status-panel');
  const content = document.getElementById('payment-status-content');
  if (!panel || !content) {
    showToast(message);
    return;
  }
  panel.style.display = 'block';
  let icon = '⏳', color = '#94a3b8', title = 'Processing';
  if (type === 'success') { icon = '✅'; color = '#34d399'; title = 'Payment Successful'; }
  if (type === 'error') { icon = '❌'; color = '#f87171'; title = 'Payment Failed'; }
  if (type === 'cancelled') { icon = '⚠️'; color = '#fbbf24'; title = 'Payment Cancelled'; }
  content.innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
    '<span style="font-size:1.5rem;">' + icon + '</span><div>' +
    '<div style="font-weight:700;color:' + color + ';">' + title + '</div></div></div>' +
    '<div style="white-space:pre-line;">' + escapeHtml(message) + '</div>';
  panel.scrollIntoView({ behavior: 'smooth' });
}

function recordOrder(order) {
  CortexState.orders.unshift(order);
  localStorage.setItem('cortex_orders', JSON.stringify(CortexState.orders));
  updateOrdersTable();
}

function updateOrdersTable() {
  const tbody = document.getElementById('orders-table');
  if (!tbody) return;
  if (CortexState.orders.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No orders yet.</td></tr>';
    return;
  }
  tbody.innerHTML = CortexState.orders.map(o =>
    '<tr><td><code>' + escapeHtml(o.id) + '</code></td><td>' + escapeHtml(o.customer) +
    '</td><td>' + escapeHtml(o.email) + '</td><td><strong>' + escapeHtml(o.amount) +
    '</strong></td><td>' + escapeHtml(o.status) + '</td><td><code>' + escapeHtml(o.reference) +
    '</code></td><td>' + escapeHtml(o.date) + '</td><td></td></tr>'
  ).join('');
  const stat = document.getElementById('stat-orders');
  if (stat) stat.textContent = CortexState.orders.length;
}

function updateRevenueDisplay() {
  const total = CortexState.totalRevenue;
  const fmt = '₦' + total.toLocaleString();
  ['stat-revenue', 'paystack-total', 'total-processed'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = fmt;
  });
  ['paystack-success', 'total-success'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = CortexState.orders.length;
  });
}

function exportOrders() {
  if (!CortexState.orders.length) {
    showToast('No orders to export.');
    return;
  }
  const csv = [
    'Order ID,Customer,Email,Amount,Status,Reference,Date,Channel',
    ...CortexState.orders.map(o =>
      [o.id, o.customer, o.email, o.amount, o.status, o.reference, o.date, o.channel].join(',')
    )
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cortex-orders.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Orders exported');
}

function togglePaymentMode() {
  const modeEl = document.getElementById('payment-mode');
  if (!modeEl) return;
  const mode = modeEl.value;
  CortexState.paymentMode = mode;
  localStorage.setItem('cortex_payment_mode', mode);
  if (mode === 'live') {
    PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY_LIVE;
    PAYSTACK_MODE = 'live';
  } else {
    PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY_TEST;
    PAYSTACK_MODE = 'test';
  }
  showToast('Payment mode: ' + mode.toUpperCase());
}

// ============================================
// AI WORKSPACE (local responses)
// ============================================
function sendAiMessage() {
  const input = document.getElementById('ai-input');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;
  const chat = document.getElementById('ai-chat-messages');
  if (!chat) return;
  const voice = VOICES[CortexState.currentVoice];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  chat.insertAdjacentHTML('beforeend',
    '<div class="message user-message"><div class="message-avatar">' +
    (CortexState.user ? CortexState.user.name.charAt(0).toUpperCase() : 'U') +
    '</div><div class="message-bubble"><div class="message-sender">You</div>' +
    '<div class="message-text">' + escapeHtml(msg) + '</div>' +
    '<div class="message-time">' + now + '</div></div></div>'
  );
  input.value = '';

  setTimeout(() => {
    const response = voice.responses[Math.floor(Math.random() * voice.responses.length)] +
      '<br><br>Processed: "<em>' + escapeHtml(msg) + '</em>"';
    chat.insertAdjacentHTML('beforeend',
      '<div class="message ai-message"><div class="message-avatar">' + voice.avatar +
      '</div><div class="message-bubble"><div class="message-sender">' + voice.name +
      '</div><div class="message-text">' + response +
      '</div><div class="message-time">' + now + '</div></div></div>'
    );
    chat.scrollTop = chat.scrollHeight;
    addTask(msg, voice.name);
  }, 800);
}

function switchVoice(voiceId) {
  CortexState.currentVoice = voiceId;
  const voice = VOICES[voiceId];
  document.querySelectorAll('.voice-card').forEach(el => el.classList.remove('active'));
  const activeCard = document.querySelector('.voice-card[data-voice="' + voiceId + '"]');
  if (activeCard) activeCard.classList.add('active');
  const av = document.getElementById('ai-avatar');
  const nm = document.getElementById('ai-name');
  if (av) { av.textContent = voice.avatar; av.style.background = voice.gradient; }
  if (nm) nm.textContent = voice.name;
}

function quickTask(task) {
  const input = document.getElementById('ai-input');
  if (input) { input.value = task; sendAiMessage(); }
}

function clearAiChat() {
  const chat = document.getElementById('ai-chat-messages');
  if (!chat) return;
  const voice = VOICES[CortexState.currentVoice];
  chat.innerHTML =
    '<div class="message ai-message"><div class="message-avatar">' + voice.avatar +
    '</div><div class="message-bubble"><div class="message-sender">' + voice.name +
    '</div><div class="message-text">' + voice.greeting + '</div></div></div>';
}

function addTask(task, agent) {
  CortexState.tasks.unshift({ task, agent, time: new Date().toISOString() });
  updateTaskList();
}

function updateTaskList() {
  const list = document.getElementById('ai-task-list');
  if (!list) return;
  if (!CortexState.tasks.length) {
    list.innerHTML = '<div class="task-item empty">No tasks yet.</div>';
    return;
  }
  list.innerHTML = CortexState.tasks.slice(0, 5).map(t =>
    '<div class="task-item"><strong>' + escapeHtml(t.agent) + ':</strong> ' +
    escapeHtml(t.task.substring(0, 50)) + '...</div>'
  ).join('');
}

// ============================================
// ACTIVITY LOG / TOAST
// ============================================
function addLog(message, type) {
  const log = document.getElementById('activity-log');
  if (!log) return;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = '<span class="log-time">[' + now + ']</span> <span class="log-' +
    (type || 'info') + '">' + escapeHtml(message) + '</span>';
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function clearLog() {
  const log = document.getElementById('activity-log');
  if (log) log.innerHTML = '';
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:60px;right:20px;background:#161b22;color:#c9d1d9;' +
    'border:1px solid #30363d;border-radius:8px;padding:12px 20px;z-index:10000;';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function quickAction(action) {
  if (action.includes('Test Payment') || action.includes('Checkout')) {
    switchTab('checkout');
    return;
  }
  switchTab('ai-workspace');
  setTimeout(() => {
    const input = document.getElementById('ai-input');
    if (input) { input.value = action; sendAiMessage(); }
  }, 200);
}

function setContentType(type) {
  CortexState.contentType = type;
  const template = CONTENT_TEMPLATES[type];
  if (!template) return;
  document.querySelectorAll('.content-cat').forEach(el => el.classList.remove('active'));
  if (typeof event !== 'undefined' && event.target) event.target.classList.add('active');
  const title = document.getElementById('content-type-title');
  if (title) title.textContent = template.title;
}

function generateContent() {
  const output = document.getElementById('content-output');
  if (!output) return;
  const subject = (document.getElementById('content-subject') || {}).value || '';
  output.value = 'Generated content for: ' + (subject || 'brief') +
    '\n\n— CINIS NEXUS Content Studio';
  showToast('Content generated');
}

function setSettingsTab(tab) {
  CortexState.settingsTab = tab;
  document.querySelectorAll('.settings-nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.settings-panel').forEach(el => el.classList.remove('active'));
  if (typeof event !== 'undefined' && event.target) event.target.classList.add('active');
  const panel = document.getElementById('settings-' + tab);
  if (panel) panel.classList.add('active');
}

function saveSettings() {
  const name = (document.getElementById('settings-name') || {}).value;
  const email = (document.getElementById('settings-email') || {}).value;
  if (name) {
    CortexState.user = { ...CortexState.user, name, email };
    localStorage.setItem('cortex_user', JSON.stringify(CortexState.user));
    document.getElementById('user-name').textContent = name.split(' ')[0];
    document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
  }
  showToast('Settings saved');
}

function savePaymentConfig() { showToast('Payment configuration saved'); }
function changePassword() { showToast('Use Member Dashboard for full account security'); }
function setAccent(color) {
  CortexState.accentColor = color;
  document.documentElement.style.setProperty('--accent', color);
}
function connectShopify() {
  showToast('Shopify: cortex-intelligence-nexus.myshopify.com');
}
function viewIntegrationDocs() {
  window.open('https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform/blob/main/docs/operations/SHOPIFY_INTEGRATION.md', '_blank');
}
function testPaystack() { switchTab('checkout'); }
function testFlutterwave() { showToast('Flutterwave demo only'); }
function viewPaystackLogs() { showToast(CortexState.orders.length + ' orders recorded'); }
function viewFlutterwaveLogs() {}
function showNotifications() { showToast(CortexState.orders.length + ' orders'); }
function showMessages() { showToast('No new messages'); }
function logAction(action) { addLog(action, 'info'); showToast(action); }

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase();
        if (query.includes('ai')) switchTab('ai-workspace');
        else if (query.includes('shop')) switchTab('shopify');
        else if (query.includes('pay') || query.includes('checkout')) switchTab('checkout');
        else if (query.includes('social')) switchTab('social');
        else if (query.includes('order')) switchTab('orders');
        else if (query.includes('business')) switchTab('business');
        e.target.value = '';
      }
    });
  }
  const aiInput = document.getElementById('ai-input');
  if (aiInput) {
    aiInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAiMessage(); }
    });
  }
  initAuth();
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const search = document.getElementById('global-search');
    if (search) search.focus();
  }
  if (e.key === 'Escape') {
    const menu = document.getElementById('user-menu');
    if (menu) menu.classList.remove('show');
  }
});
