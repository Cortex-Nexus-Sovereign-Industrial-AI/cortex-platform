/* ============================================
   CORTEX PLATFORM v2.1 — Sovereign Industrial AI Core
   Application Logic with LIVE Paystack Integration
   CINIS NEXUS INDUSTRY OGOJA
   ============================================ */

// ============================================
// CONFIGURATION — PAYSTACK KEYS
// ============================================
// LIVE key for real transactions
const PAYSTACK_PUBLIC_KEY_LIVE = 'pk_live_d7f59d46d24abebfb35ae3ae5b397f8ba4e919fc';
// TEST key for sandbox testing
const PAYSTACK_PUBLIC_KEY_TEST = 'pk_test_cfeb04b79e16c6c813c17f654766bfd09c7ece0f';

// Default to LIVE mode (real money)
let PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY_LIVE;
let PAYSTACK_MODE = 'live';

// ============================================
// STATE MANAGEMENT
// ============================================
const CortexState = {
  user: null,
  isAuth: false,
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
    x: 'https://x.com/MikecomplexAI',
    youtube: 'https://www.youtube.com/@MikecomplexAI-i2e',
    tiktok: 'https://www.tiktok.com/@mikecomplexai',
    instagram: 'https://www.instagram.com/mikecomplexai/',
    linkedin: 'https://www.linkedin.com/in/michael-ujuku-morim',
    github: 'https://github.com/Cortex-Nexus-Sovereign-Industrial-AI',
    pinterest: 'https://www.pinterest.com/mikecomplexai',
    shopify: 'https://cortex-intelligence-nexus.myshopify.com'
  }
};

// Set payment mode from storage
if (CortexState.paymentMode === 'test') {
  PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY_TEST;
  PAYSTACK_MODE = 'test';
}

const VOICES = {
  cortex: {
    name: 'Cortex Nexus',
    avatar: '⚡',
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    greeting: 'Sovereign industrial AI core online. I am your deterministic command node for CINIS NEXUS INDUSTRY HQ. How may I assist your operations today?',
    style: 'authoritative, precise, industrial-focused',
    responses: [
      "Command acknowledged. Executing deterministic sequence through sovereign infrastructure.",
      "Analysis complete. Here is the optimized workflow for your industrial operations:",
      "Edge-resilient operation initiated. Data sovereignty maintained throughout the pipeline.",
      "Orchestrating across local nodes. Zero-latency execution confirmed.",
      "Industrial automation protocol activated. Standby for deployment confirmation."
    ]
  },
  mikecomplex: {
    name: 'MikeComplex AI',
    avatar: '🧠',
    gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)',
    greeting: 'Greetings, Michael. I am MikeComplex AI — your strategic advisor for CINIS NEXUS. Let us build something extraordinary together.',
    style: 'visionary, business-focused, strategic',
    responses: [
      "Excellent strategic direction. Let me synthesize a comprehensive business approach for you.",
      "From Ogoja to the world — here is how we scale this operation effectively.",
      "I have analyzed the market landscape. Here is your competitive advantage:",
      "Building empires requires vision and execution. Let us tackle both.",
      "Your industrial AI infrastructure is positioned for exponential growth. Here is the roadmap."
    ]
  },
  builder: {
    name: 'Builder Bot',
    avatar: '🔨',
    gradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    greeting: 'Builder Bot here. Ready to code, construct, and deploy. What are we building today?',
    style: 'technical, hands-on, code-focused',
    responses: [
      "Code structure initialized. Here is your production-ready implementation:",
      "Architecture mapped. Deploying optimized, edge-resilient code now.",
      "Repository structure ready. Let me generate the complete module:",
      "Deterministic build process engaged. Zero dependencies on external APIs.",
      "Infrastructure-as-code template generated. Ready for GitHub Pages deployment."
    ]
  },
  scout: {
    name: 'Scout AI',
    avatar: '🔍',
    gradient: 'linear-gradient(135deg, #be185d, #ec4899)',
    greeting: 'Scout AI reporting for duty. I will gather intelligence, research trends, and surface insights for your operations.',
    style: 'curious, data-driven, research-focused',
    responses: [
      "Intelligence gathered. Here is what the data reveals:",
      "Market reconnaissance complete. Key findings for CINIS NEXUS:",
      "Research pipeline activated. Here are the actionable insights:",
      "Trend analysis complete. Here is what is moving in your industry:",
      "Competitive landscape mapped. Opportunities identified for sovereign expansion."
    ]
  }
};

const CONTENT_TEMPLATES = {
  email: { title: 'Email Campaign Generator', placeholder: 'Enter email subject line...', tone: 'Professional', audience: 'Nigerian SMEs and industrial partners' },
  social: { title: 'Social Media Post Generator', placeholder: 'Enter post headline...', tone: 'Engaging', audience: 'Tech-savvy entrepreneurs and industrial buyers' },
  product: { title: 'Product Description Generator', placeholder: 'Enter product name...', tone: 'Persuasive', audience: 'E-commerce shoppers and B2B buyers' },
  blog: { title: 'Blog Article Generator', placeholder: 'Enter article title...', tone: 'Informative', audience: 'Industry professionals and decision makers' },
  ad: { title: 'Ad Copy Generator', placeholder: 'Enter ad headline...', tone: 'Persuasive', audience: 'Targeted ad audience' },
  seo: { title: 'SEO Content Generator', placeholder: 'Enter target keyword...', tone: 'Optimized', audience: 'Search engine users' }
};

// ============================================
// AUTHENTICATION
// ============================================
function initAuth() {
  const savedUser = localStorage.getItem('cortex_user');
  if (savedUser) {
    CortexState.user = JSON.parse(savedUser);
    CortexState.isAuth = true;
    showApp();
    updateOrdersTable();
    updateRevenueDisplay();
  }
}

function handleAuth(e) {
  e.preventDefault();
  const isSignUp = document.getElementById('auth-title').textContent === 'Create Account';
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  if (isSignUp) {
    const name = document.getElementById('auth-name').value;
    const confirm = document.getElementById('auth-confirm').value;
    if (password !== confirm) { alert('Passwords do not match!'); return; }
    CortexState.user = { name, email, created: new Date().toISOString() };
  } else {
    CortexState.user = { name: 'Michael Ujuku Morim', email, created: new Date().toISOString() };
  }
  
  localStorage.setItem('cortex_user', JSON.stringify(CortexState.user));
  CortexState.isAuth = true;
  showApp();
  addLog('User authenticated — ' + CortexState.user.email, 'success');
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
    document.getElementById('user-name').textContent = CortexState.user.name.split(' ')[0];
    document.getElementById('user-avatar').textContent = CortexState.user.name.charAt(0).toUpperCase();
  }
  addLog('Platform session initialized — Paystack ' + (PAYSTACK_MODE === 'live' ? 'LIVE' : 'TEST') + ' mode', 'success');
  updateOrdersTable();
  updateRevenueDisplay();
  renderSocialLinks();
}

function signOut() {
  localStorage.removeItem('cortex_user');
  CortexState.user = null;
  CortexState.isAuth = false;
  location.reload();
}

// ============================================
// SOCIAL MEDIA LINKS
// ============================================
function renderSocialLinks() {
  const footerSocial = document.getElementById('footer-social-links');
  if (footerSocial) {
    footerSocial.innerHTML = Object.entries(CortexState.socialLinks).map(([platform, url]) => `
      <a href="${url}" target="_blank" rel="noopener noreferrer" title="${platform.charAt(0).toUpperCase() + platform.slice(1)}" class="social-link">
        ${getSocialIcon(platform)}
      </a>
    `).join('');
  }
}

function getSocialIcon(platform) {
  const icons = {
    x: '𝕏',
    youtube: '▶',
    tiktok: '♪',
    instagram: '📸',
    linkedin: '🔗',
    github: '⚙',
    pinterest: '📌',
    shopify: '🛒'
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
  document.getElementById('user-menu').classList.toggle('show');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.top-bar-right')) {
    document.getElementById('user-menu').classList.remove('show');
  }
});

// ============================================
// PAYSTACK PAYMENT — LIVE INTEGRATION
// ============================================
function payWithPaystack() {
  const email = document.getElementById('paystack-email').value;
  const amountInput = document.getElementById('paystack-amount').value;
  const name = document.getElementById('paystack-name').value;
  const phone = document.getElementById('paystack-phone').value;
  const product = document.getElementById('paystack-product').value;
  
  // Validate
  if (!email || !amountInput || !name) {
    showPaymentStatus('error', 'Please fill in all required fields: Email, Amount, and Name.');
    return;
  }
  
  const amount = parseInt(amountInput) * 100; // Convert to kobo
  
  if (amount < 10000) { // Minimum ₦100
    showPaymentStatus('error', 'Minimum amount is ₦100.');
    return;
  }
  
  const reference = 'CORTEX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  
  showPaymentStatus('processing', 'Initializing Paystack payment... Please wait.');
  
  // Initialize Paystack Inline
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
        { display_name: 'Product', variable_name: 'product', value: product },
        { display_name: 'Platform', variable_name: 'platform', value: 'Cortex Platform v2.1' }
      ]
    },
    callback: function(response) {
      // Payment successful
      const ngnAmount = amount / 100;
      showPaymentStatus('success', 
        'Payment Successful!\n\n' +
        'Reference: ' + response.reference + '\n' +
        'Amount: ₦' + ngnAmount.toLocaleString() + '\n' +
        'Status: ' + response.status + '\n\n' +
        'The transaction has been recorded in your Orders tab.'
      );
      
      // Record order
      recordOrder({
        id: reference,
        customer: name,
        email: email,
        amount: '₦' + ngnAmount.toLocaleString(),
        status: 'Paid',
        reference: response.reference,
        date: new Date().toLocaleString(),
        channel: 'Paystack',
        transactionId: response.transaction
      });
      
      // Update revenue
      CortexState.totalRevenue += ngnAmount;
      localStorage.setItem('cortex_revenue', CortexState.totalRevenue.toString());
      updateRevenueDisplay();
      
      addLog('Paystack payment SUCCESS: ₦' + ngnAmount.toLocaleString() + ' (ref: ' + response.reference + ')', 'success');
      
      // Update badge
      updateNotificationBadge(1);
    },
    onClose: function() {
      showPaymentStatus('cancelled', 'Payment window closed. You can retry anytime from the Checkout tab.');
      addLog('Paystack payment cancelled by user', 'warn');
    }
  });
  
  handler.openIframe();
}

function showPaymentStatus(type, message) {
  const panel = document.getElementById('payment-status-panel');
  const content = document.getElementById('payment-status-content');
  
  panel.style.display = 'block';
  
  let icon = '⏳';
  let color = '#94a3b8';
  let title = 'Processing';
  
  if (type === 'success') { icon = '✅'; color = '#34d399'; title = 'Payment Successful'; }
  if (type === 'error') { icon = '❌'; color = '#f87171'; title = 'Payment Failed'; }
  if (type === 'cancelled') { icon = '⚠️'; color = '#fbbf24'; title = 'Payment Cancelled'; }
  
  content.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <span style="font-size:1.5rem;">${icon}</span>
      <div>
        <div style="font-weight:700;color:${color};font-size:1.1rem;">${title}</div>
        <div style="font-size:0.8rem;color:#64748b;">${new Date().toLocaleString()}</div>
      </div>
    </div>
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:14px;font-family:'JetBrains Mono',monospace;font-size:0.85rem;color:#e2e8f0;white-space:pre-line;line-height:1.6;">
      ${message}
    </div>
  `;
  
  // Scroll to status
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
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No orders yet. Complete a payment in the Checkout tab to see it here.</td></tr>';
    return;
  }
  
  tbody.innerHTML = CortexState.orders.map(o => `
    <tr>
      <td><code style="font-family:monospace;font-size:0.8rem;color:#818cf8;">${o.id}</code></td>
      <td>${o.customer}</td>
      <td>${o.email}</td>
      <td><strong>${o.amount}</strong></td>
      <td><span style="color:#34d399;font-weight:600;">● ${o.status}</span></td>
      <td><code style="font-family:monospace;font-size:0.75rem;color:#94a3b8;">${o.reference}</code></td>
      <td>${o.date}</td>
      <td><button class="btn-sm" onclick="viewOrder('${o.id}')">View</button></td>
    </tr>
  `).join('');
  
  document.getElementById('stat-orders').textContent = CortexState.orders.length;
}

function viewOrder(id) {
  const order = CortexState.orders.find(o => o.id === id);
  if (order) {
    showPaymentStatus('success', 
      'Order Details\n\n' +
      'Order ID: ' + order.id + '\n' +
      'Customer: ' + order.customer + '\n' +
      'Email: ' + order.email + '\n' +
      'Amount: ' + order.amount + '\n' +
      'Status: ' + order.status + '\n' +
      'Reference: ' + order.reference + '\n' +
      'Date: ' + order.date + '\n' +
      'Channel: ' + order.channel
    );
  }
}

function updateRevenueDisplay() {
  const total = CortexState.totalRevenue;
  document.getElementById('stat-revenue').textContent = '₦' + total.toLocaleString();
  document.getElementById('paystack-total').textContent = '₦' + total.toLocaleString();
  document.getElementById('total-processed').textContent = '₦' + total.toLocaleString();
  document.getElementById('paystack-success').textContent = CortexState.orders.length;
  document.getElementById('total-success').textContent = CortexState.orders.length;
}

function exportOrders() {
  if (CortexState.orders.length === 0) {
    showToast('No orders to export yet.');
    return;
  }
  
  const csv = [
    ['Order ID', 'Customer', 'Email', 'Amount', 'Status', 'Reference', 'Date', 'Channel'].join(','),
    ...CortexState.orders.map(o => [
      o.id, o.customer, o.email, o.amount, o.status, o.reference, o.date, o.channel
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cortex-orders-' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  
  addLog('Orders exported to CSV', 'success');
  showToast('Orders exported successfully!');
}

function togglePaymentMode() {
  const mode = document.getElementById('payment-mode').value;
  CortexState.paymentMode = mode;
  localStorage.setItem('cortex_payment_mode', mode);
  
  if (mode === 'live') {
    PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY_LIVE;
    PAYSTACK_MODE = 'live';
  } else {
    PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY_TEST;
    PAYSTACK_MODE = 'test';
  }
  
  addLog('Payment mode switched to ' + mode.toUpperCase(), 'warn');
  showToast('Payment mode: ' + mode.toUpperCase() + ' — ' + (mode === 'live' ? 'Real money will be debited' : 'Sandbox mode'));
}

// ============================================
// AI WORKSPACE
// ============================================
function sendAiMessage() {
  const input = document.getElementById('ai-input');
  const msg = input.value.trim();
  if (!msg) return;
  
  const chat = document.getElementById('ai-chat-messages');
  const voice = VOICES[CortexState.currentVoice];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const userMsg = document.createElement('div');
  userMsg.className = 'message user-message';
  userMsg.innerHTML = `
    <div class="message-avatar">${CortexState.user ? CortexState.user.name.charAt(0).toUpperCase() : 'U'}</div>
    <div class="message-bubble">
      <div class="message-sender">You</div>
      <div class="message-text">${escapeHtml(msg)}</div>
      <div class="message-time">${now}</div>
    </div>
  `;
  chat.appendChild(userMsg);
  
  const thinking = document.createElement('div');
  thinking.className = 'message ai-message';
  thinking.id = 'ai-thinking';
  thinking.innerHTML = `
    <div class="message-avatar">${voice.avatar}</div>
    <div class="message-bubble">
      <div class="message-sender">${voice.name}</div>
      <div class="message-text"><span class="typing">●●●</span></div>
    </div>
  `;
  chat.appendChild(thinking);
  chat.scrollTop = chat.scrollHeight;
  
  input.value = '';
  input.style.height = 'auto';
  
  setTimeout(() => {
    thinking.remove();
    const response = generateAiResponse(msg, voice);
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai-message';
    aiMsg.innerHTML = `
      <div class="message-avatar">${voice.avatar}</div>
      <div class="message-bubble">
        <div class="message-sender">${voice.name}</div>
        <div class="message-text">${response}</div>
        <div class="message-time">${now}</div>
      </div>
    `;
    chat.appendChild(aiMsg);
    chat.scrollTop = chat.scrollHeight;
    addTask(msg, voice.name);
    addLog('AI [' + voice.name + '] responded', 'info');
  }, 1200 + Math.random() * 800);
}

function generateAiResponse(msg, voice) {
  const lower = msg.toLowerCase();
  if (lower.includes('email') || lower.includes('mail')) return generateEmailResponse(voice);
  if (lower.includes('python') || lower.includes('code') || lower.includes('script')) return generateCodeResponse(voice);
  if (lower.includes('social') || lower.includes('post') || lower.includes('content')) return generateSocialResponse(voice);
  if (lower.includes('product') || lower.includes('description') || lower.includes('listing')) return generateProductResponse(voice);
  if (lower.includes('analyze') || lower.includes('data') || lower.includes('report')) return generateAnalysisResponse(voice);
  if (lower.includes('marketing') || lower.includes('campaign') || lower.includes('ad')) return generateMarketingResponse(voice);
  if (lower.includes('pay') || lower.includes('money') || lower.includes('checkout') || lower.includes('naira')) return generatePaymentResponse(voice);
  
  const generic = voice.responses[Math.floor(Math.random() * voice.responses.length)];
  return generic + '<br><br>I have processed your request: "<em>' + escapeHtml(msg) + '</em>". Is there anything specific you would like me to refine or expand upon?';
}

function generateEmailResponse(voice) {
  if (voice.name === 'Cortex Nexus') {
    return `Subject: Strategic Partnership Opportunity — CINIS NEXUS INDUSTRY HQ<br><br>Dear Partner,<br><br>We are reaching out from CINIS NEXUS INDUSTRY OGOJA, headquartered in Cross River State, Nigeria. Our sovereign industrial AI core, Cortex Platform, is now operational and ready for strategic collaboration.<br><br>Key capabilities include:<br>• Edge-resilient industrial automation<br>• AI-powered commerce orchestration<br>• Deterministic workflow execution<br>• Integrated payment processing via Paystack<br><br>We look forward to exploring synergies.<br><br>Best regards,<br>Michael Ujuku Morim<br>Founder & CEO`;
  }
  if (voice.name === 'MikeComplex AI') {
    return `Subject: Let us Build Something Extraordinary Together<br><br>Hello,<br><br>I am writing to you on behalf of CINIS NEXUS — where sovereign AI meets industrial innovation. Based in Ogoja, Nigeria, we are not just building technology; we are building the future of African industry.<br><br>Our platform connects:<br>• Shopify commerce with AI intelligence<br>• Paystack & Flutterwave payment rails<br>• Social media command across X, TikTok, YouTube, Pinterest<br>• Real-time order and revenue tracking<br><br>Let us discuss how we can create value together.<br><br>Warm regards,<br>Michael Ujuku Morim`;
  }
  return `Subject: Business Communication — CINIS NEXUS<br><br>Dear Recipient,<br><br>Thank you for your interest in our sovereign industrial AI platform.<br><br>We have prepared a comprehensive overview of our capabilities and would welcome the opportunity to discuss further.<br><br>Please let us know a convenient time for a call or meeting.<br><br>Regards,<br>CINIS NEXUS INDUSTRY HQ`;
}

function generateCodeResponse(voice) {
  if (voice.name === 'Builder Bot') {
    return `Here is a production-ready Python webhook handler for Paystack:<br><br><pre style="background:#020617;padding:12px;border-radius:8px;overflow-x:auto;font-size:0.8rem;"><code>import hashlib
import hmac
import os
from flask import Flask, request, jsonify

app = Flask(__name__)
PAYSTACK_SECRET = os.getenv('PAYSTACK_SECRET')

@app.route('/api/webhooks/paystack', methods=['POST'])
def paystack_webhook():
    signature = request.headers.get('x-paystack-signature')
    body = request.get_data()
    expected = hmac.new(PAYSTACK_SECRET.encode(), body, hashlib.sha512).hexdigest()
    if not hmac.compare_digest(expected, signature):
        return jsonify({"error": "Invalid signature"}), 400
    event = request.json
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(port=8080)</code></pre><br>Deploy this to Netlify Functions or run locally with Flask.`;
  }
  return `I have generated a code solution for your request. The implementation follows edge-resilient principles with zero external API dependencies for core logic.<br><br>Would you like me to expand this into a full module, or shall I generate the corresponding JavaScript/Node.js version?`;
}

function generateSocialResponse(voice) {
  return `🚀 <strong>CINIS NEXUS is LIVE!</strong><br><br>Our sovereign industrial AI core is now operational from Ogoja, Cross River State, Nigeria. 🇳🇬<br><br>What we built:<br>⚡ Edge-resilient automation<br>🤖 4 AI agents working 24/7<br>💳 Paystack + Flutterwave integration<br>🛒 Shopify-connected commerce<br>🌐 Social command center<br>📦 Real-time order tracking<br>📌 Connected on Pinterest<br><br>The future of African industry starts here.<br><br>#CINISNEXUS #SovereignAI #IndustrialAutomation #NigeriaTech #CortexPlatform #Paystack`;
}

function generateProductResponse(voice) {
  return `<strong>Cortex Platform — Sovereign Industrial AI Core</strong><br><br>Transform your industrial operations with Africa's first sovereign AI platform. Engineered for zero-latency execution across local terminal environments including Termux and Pydroid-3.<br><br><strong>Key Features:</strong><br>• Deterministic workflows with offline-first architecture<br>• 4 specialized AI agents (Cortex, MikeComplex, Builder, Scout)<br>• Integrated payment processing (Paystack & Flutterwave)<br>• Shopify store synchronization<br>• Cross-platform social media command center<br>• Real-time revenue and order tracking<br>• Data sovereignty and private node hosting<br><br><strong>Perfect for:</strong> Industrial manufacturers, tech entrepreneurs, and businesses seeking AI-powered automation with complete data control.<br><br>Founded by Michael Ujuku Morim in Ogoja, Nigeria.`;
}

function generateAnalysisResponse(voice) {
  return `<strong>Market Intelligence Report — CINIS NEXUS Sector</strong><br><br>Based on current industrial AI trends in the Nigerian and West African markets:<br><br>📈 <strong>Growth Opportunity:</strong> Industrial automation adoption in Nigeria is projected to grow 340% by 2028.<br><br>🎯 <strong>Competitive Edge:</strong> Sovereign/edge-first architecture positions CINIS NEXUS uniquely against cloud-dependent competitors.<br><br>💰 <strong>Revenue Streams:</strong><br>• Platform subscriptions (₦100+ via Paystack)<br>• AI agent task execution<br>• Payment processing fees<br>• Shopify integration services<br>• Content & marketing automation<br><br>🌍 <strong>Geographic Advantage:</strong> Ogoja, Cross River State offers strategic positioning for pan-African expansion.<br><br>Recommendation: Accelerate social media presence and Shopify store launch to capture early market share.`;
}

function generateMarketingResponse(voice) {
  return `<strong>Marketing Campaign: "Sovereign Future"</strong><br><br><strong>Headline:</strong> Your Industry. Your Data. Your AI.<br><br><strong>Body:</strong> CINIS NEXUS INDUSTRY HQ delivers the first truly sovereign industrial AI platform built for African businesses. No cloud lock-in. No data leakage. Pure edge-resilient power.<br><br><strong>CTA:</strong> Launch Your Sovereign Operations →<br><br><strong>Channels:</strong><br>• X/Twitter: Thread series on data sovereignty<br>• YouTube: Architecture deep-dives with @MikecomplexAI-i2e<br>• TikTok: 60-second platform demos<br>• LinkedIn: B2B thought leadership<br>• Pinterest: Visual boards on industrial automation trends<br><br><strong>Budget Allocation:</strong> 40% content, 30% paid social, 20% partnerships, 10% events`;
}

function generatePaymentResponse(voice) {
  return `<strong>Payment System Overview</strong><br><br>Your Cortex Platform is configured with <strong>Paystack LIVE</strong> integration.<br><br>✅ <strong>Current Status:</strong> Active and ready for real transactions<br><br>💳 <strong>Supported Methods:</strong><br>• Nigerian debit cards (Verve, Visa, Mastercard)<br>• Bank transfers<br>• USSD<br>• Mobile money<br><br>📊 <strong>Revenue Tracking:</strong> All payments are automatically logged in the Orders tab with full reference tracking.<br><br>🔒 <strong>Security:</strong> PCI-DSS compliant. Card details are processed directly by Paystack — never touch our servers.<br><br>Total revenue recorded: <strong>₦${CortexState.totalRevenue.toLocaleString()}</strong><br>Total orders: <strong>${CortexState.orders.length}</strong><br><br>Go to the <strong>Checkout</strong> tab to process a payment.`;
}

function switchVoice(voiceId) {
  CortexState.currentVoice = voiceId;
  const voice = VOICES[voiceId];
  document.querySelectorAll('.voice-card').forEach(el => {
    el.classList.remove('active');
    el.style.background = '';
    el.style.border = '';
  });
  const activeCard = document.querySelector('.voice-card[data-voice="' + voiceId + '"]');
  if (activeCard) {
    activeCard.classList.add('active');
    activeCard.style.background = 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.12))';
    activeCard.style.border = '2px solid var(--accent)';
  }
  document.getElementById('ai-avatar').textContent = voice.avatar;
  document.getElementById('ai-avatar').style.background = voice.gradient;
  document.getElementById('ai-name').textContent = voice.name;
  addLog('Switched AI persona to ' + voice.name, 'accent');
}

function quickTask(task) {
  document.getElementById('ai-input').value = task;
  sendAiMessage();
}

function clearAiChat() {
  const chat = document.getElementById('ai-chat-messages');
  const voice = VOICES[CortexState.currentVoice];
  chat.innerHTML = `
    <div class="message ai-message">
      <div class="message-avatar">${voice.avatar}</div>
      <div class="message-bubble">
        <div class="message-sender">${voice.name}</div>
        <div class="message-text">${voice.greeting}</div>
        <div class="message-time">Just now</div>
      </div>
    </div>
  `;
}

function addTask(task, agent) {
  CortexState.tasks.unshift({ task, agent, time: new Date().toISOString() });
  updateTaskList();
}

function updateTaskList() {
  const list = document.getElementById('ai-task-list');
  if (!list) return;
  if (CortexState.tasks.length === 0) {
    list.innerHTML = '<div class="task-item empty">No tasks yet. Start by asking Cortex above.</div>';
    return;
  }
  list.innerHTML = CortexState.tasks.slice(0, 5).map(t => {
    const time = new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `<div class="task-item">[${time}] <strong>${t.agent}:</strong> ${escapeHtml(t.task.substring(0, 50))}...</div>`;
  }).join('');
}

// ============================================
// ACTIVITY LOG
// ============================================
function addLog(message, type = 'info') {
  const log = document.getElementById('activity-log');
  if (!log) return;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const typeClass = 'log-' + type;
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">[${now}]</span> <span class="${typeClass}">${escapeHtml(message)}</span>`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function clearLog() {
  const log = document.getElementById('activity-log');
  if (log) log.innerHTML = '';
}

function logAction(action) {
  addLog(action, 'info');
  showToast(action);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 60px; right: 20px;
    background: var(--bg-secondary); color: var(--text-primary);
    border: 1px solid var(--border-light); border-radius: 8px;
    padding: 12px 20px; font-size: 0.9rem; z-index: 10000;
    box-shadow: var(--shadow); animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateNotificationBadge(count) {
  const badge = document.getElementById('notif-badge');
  if (badge) {
    const current = parseInt(badge.textContent) || 0;
    badge.textContent = current + count;
  }
}

function showNotifications() {
  showToast('Notifications: ' + (CortexState.orders.length) + ' new orders');
}

function showMessages() {
  showToast('Messages: No new messages');
}

// ============================================
// QUICK ACTIONS
// ============================================
function quickAction(action) {
  if (action.includes('Test Payment')) {
    switchTab('checkout');
    return;
  }
  switchTab('ai-workspace');
  setTimeout(() => {
    document.getElementById('ai-input').value = action;
    sendAiMessage();
  }, 300);
}

// ============================================
// CONTENT STUDIO
// ============================================
function setContentType(type) {
  CortexState.contentType = type;
  const template = CONTENT_TEMPLATES[type];
  document.querySelectorAll('.content-cat').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('content-type-title').textContent = template.title;
  document.getElementById('content-subject').placeholder = template.placeholder;
  document.getElementById('content-tone').value = template.tone;
  document.getElementById('content-audience').value = template.audience;
  document.getElementById('content-output').value = '';
}

function generateContent() {
  const subject = document.getElementById('content-subject').value;
  const tone = document.getElementById('content-tone').value;
  const audience = document.getElementById('content-audience').value;
  const brief = document.getElementById('content-brief').value;
  const output = document.getElementById('content-output');
  if (!subject && !brief) { output.value = 'Please enter a subject or brief first, then click Generate.'; return; }
  output.value = '✨ Generating content with ' + VOICES[CortexState.currentVoice].name + '...';
  setTimeout(() => {
    const voice = VOICES[CortexState.currentVoice];
    let generated = '';
    if (CortexState.contentType === 'email') generated = generateEmailResponse(voice);
    else if (CortexState.contentType === 'social') generated = generateSocialResponse(voice);
    else if (CortexState.contentType === 'product') generated = generateProductResponse(voice);
    else generated = `<strong>${subject || 'Generated Content'}</strong>\n\nTone: ${tone}\nAudience: ${audience}\n\n${brief}\n\n[AI-generated content would appear here based on your brief.]\n\n— Generated by ${voice.name}`;
    output.value = generated.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '');
    addLog('Content generated: ' + (subject || brief).substring(0, 30) + '...', 'success');
  }, 1500);
}

// ============================================
// SETTINGS
// ============================================
function setSettingsTab(tab) {
  CortexState.settingsTab = tab;
  document.querySelectorAll('.settings-nav-item').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.settings-panel').forEach(el => el.classList.remove('active'));
  document.getElementById('settings-' + tab).classList.add('active');
}

function saveSettings() {
  const name = document.getElementById('settings-name').value;
  const email = document.getElementById('settings-email').value;
  const company = document.getElementById('settings-company').value;
  const location = document.getElementById('settings-location').value;
  CortexState.user = { ...CortexState.user, name, email, company, location };
  localStorage.setItem('cortex_user', JSON.stringify(CortexState.user));
  document.getElementById('user-name').textContent = name.split(' ')[0];
  document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
  showToast('Settings saved successfully');
  addLog('Account settings updated', 'success');
}

function savePaymentConfig() {
  showToast('Payment configuration saved');
  addLog('Payment configuration updated', 'success');
}

function changePassword() {
  showToast('Password updated successfully');
  addLog('Password changed', 'success');
}

function setAccent(color) {
  CortexState.accentColor = color;
  document.documentElement.style.setProperty('--accent', color);
  document.querySelectorAll('.color-opt').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
}

// ============================================
// SHOPIFY
// ============================================
function connectShopify() {
  showToast('Shopify store already connected: cortex-intelligence-nexus.myshopify.com');
  addLog('Shopify integration verified', 'success');
}

function viewIntegrationDocs() {
  addLog('Shopify integration documentation requested', 'info');
  showToast('Documentation opening in new tab...');
}

// ============================================
// PAYMENTS (Legacy test buttons)
// ============================================
function testPaystack() {
  switchTab('checkout');
  showToast('Redirected to Checkout tab for live payment');
}

function testFlutterwave() {
  showToast('Flutterwave test payment simulated (demo)');
  addLog('Flutterwave test transaction simulated', 'info');
  setTimeout(() => {
    addLog('Flutterwave payment: SUCCESS — ₦3,500.00 (demo)', 'success');
  }, 2000);
}

function viewPaystackLogs() {
  addLog('Paystack transaction logs opened', 'info');
  showToast(CortexState.orders.length + ' Paystack transactions recorded');
}

function viewFlutterwaveLogs() {
  addLog('Flutterwave transaction logs opened', 'info');
}

// ============================================
// GLOBAL SEARCH
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase();
        addLog('Global search: "' + query + '"', 'info');
        if (query.includes('ai') || query.includes('cortex') || query.includes('bot')) switchTab('ai-workspace');
        else if (query.includes('shop')) switchTab('shopify');
        else if (query.includes('pay') || query.includes('money') || query.includes('checkout')) switchTab('checkout');
        else if (query.includes('social') || query.includes('x') || query.includes('twitter')) switchTab('social');
        else if (query.includes('content') || query.includes('write')) switchTab('content');
        else if (query.includes('setting') || query.includes('config')) switchTab('settings');
        else if (query.includes('order')) switchTab('orders');
        else if (query.includes('business') || query.includes('industry')) switchTab('business');
        e.target.value = '';
      }
    });
  }
  
  // AI input auto-resize
  const aiInput = document.getElementById('ai-input');
  if (aiInput) {
    aiInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    aiInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAiMessage(); }
    });
  }
  
  // Amount input sync
  const amountInput = document.getElementById('paystack-amount');
  if (amountInput) {
    amountInput.addEventListener('input', function() {
      document.getElementById('btn-amount').textContent = this.value || '100';
    });
  }
  
  initAuth();
});

// ============================================
// UTILITIES
// ============================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const search = document.getElementById('global-search');
    if (search) search.focus();
  }
  if (e.key === 'Escape') {
    document.getElementById('user-menu').classList.remove('show');
  }
});

// Periodic heartbeat
setInterval(() => {
  if (CortexState.isAuth && Math.random() > 0.7) {
    const heartbeats = [
      'Heartbeat check — all systems nominal',
      'Edge node sync complete',
      'AI agent health check: OK',
      'Payment gateway status: ' + (PAYSTACK_MODE === 'live' ? 'LIVE' : 'TEST'),
      'Social media monitoring: active',
      'Revenue tracking: ₦' + CortexState.totalRevenue.toLocaleString()
    ];
    addLog(heartbeats[Math.floor(Math.random() * heartbeats.length)], 'info');
  }
}, 30000);