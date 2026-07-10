/* ============================================
   CORTEX PLATFORM — Sovereign Industrial AI Core
   Application Logic v2.0.0
   CINIS NEXUS INDUSTRY OGOJA
   ============================================ */

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
  orders: [],
  payments: { paystack: [], flutterwave: [] },
  shopifyConnected: false,
  notifications: [],
  compactSidebar: false,
  accentColor: '#6366f1'
};

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
  email: {
    title: 'Email Campaign Generator',
    placeholder: 'Enter email subject line...',
    tone: 'Professional',
    audience: 'Nigerian SMEs and industrial partners'
  },
  social: {
    title: 'Social Media Post Generator',
    placeholder: 'Enter post headline...',
    tone: 'Engaging',
    audience: 'Tech-savvy entrepreneurs and industrial buyers'
  },
  product: {
    title: 'Product Description Generator',
    placeholder: 'Enter product name...',
    tone: 'Persuasive',
    audience: 'E-commerce shoppers and B2B buyers'
  },
  blog: {
    title: 'Blog Article Generator',
    placeholder: 'Enter article title...',
    tone: 'Informative',
    audience: 'Industry professionals and decision makers'
  },
  ad: {
    title: 'Ad Copy Generator',
    placeholder: 'Enter ad headline...',
    tone: 'Persuasive',
    audience: 'Targeted ad audience'
  },
  seo: {
    title: 'SEO Content Generator',
    placeholder: 'Enter target keyword...',
    tone: 'Optimized',
    audience: 'Search engine users'
  }
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
    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }
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

  addLog('Platform session initialized', 'success');
}

function signOut() {
  localStorage.removeItem('cortex_user');
  CortexState.user = null;
  CortexState.isAuth = false;
  location.reload();
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

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.top-bar-right')) {
    document.getElementById('user-menu').classList.remove('show');
  }
});

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

  // User message
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

  // AI thinking indicator
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

  // Simulate AI response
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
    addLog(`AI [${voice.name}] responded to: "${msg.substring(0, 40)}..."`, 'info');
  }, 1200 + Math.random() * 800);
}

function generateAiResponse(msg, voice) {
  const lower = msg.toLowerCase();

  // Task-specific responses
  if (lower.includes('email') || lower.includes('mail')) {
    return generateEmailResponse(voice);
  }
  if (lower.includes('python') || lower.includes('code') || lower.includes('script')) {
    return generateCodeResponse(voice);
  }
  if (lower.includes('social') || lower.includes('post') || lower.includes('content')) {
    return generateSocialResponse(voice);
  }
  if (lower.includes('product') || lower.includes('description') || lower.includes('listing')) {
    return generateProductResponse(voice);
  }
  if (lower.includes('analyze') || lower.includes('data') || lower.includes('report')) {
    return generateAnalysisResponse(voice);
  }
  if (lower.includes('marketing') || lower.includes('campaign') || lower.includes('ad')) {
    return generateMarketingResponse(voice);
  }

  // Generic response
  const generic = voice.responses[Math.floor(Math.random() * voice.responses.length)];
  return generic + '<br><br>I have processed your request: "<em>' + escapeHtml(msg) + '</em>". Is there anything specific you would like me to refine or expand upon?';
}

function generateEmailResponse(voice) {
  if (voice.name === 'Cortex Nexus') {
    return `Subject: Strategic Partnership Opportunity — CINIS NEXUS INDUSTRY HQ<br><br>Dear Partner,<br><br>We are reaching out from CINIS NEXUS INDUSTRY OGOJA, headquartered in Cross River State, Nigeria. Our sovereign industrial AI core, Cortex Platform, is now operational and ready for strategic collaboration.<br><br>Key capabilities include:<br>• Edge-resilient industrial automation<br>• AI-powered commerce orchestration<br>• Deterministic workflow execution<br><br>We look forward to exploring synergies.<br><br>Best regards,<br>Michael Ujuku Morim<br>Founder & CEO`;
  }
  if (voice.name === 'MikeComplex AI') {
    return `Subject: Let's Build Something Extraordinary Together<br><br>Hello,<br><br>I'm writing to you on behalf of CINIS NEXUS — where sovereign AI meets industrial innovation. Based in Ogoja, Nigeria, we're not just building technology; we're building the future of African industry.<br><br>Our platform connects:<br>• Shopify commerce with AI intelligence<br>• Paystack & Flutterwave payment rails<br>• Social media command across X, TikTok, YouTube<br><br>Let's discuss how we can create value together.<br><br>Warm regards,<br>Michael Ujuku Morim`;
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

    expected = hmac.new(
        PAYSTACK_SECRET.encode(),
        body,
        hashlib.sha512
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        return jsonify({"error": "Invalid signature"}), 400

    event = request.json
    # Process event['event'] type
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(port=8080)</code></pre><br>Deploy this to Netlify Functions or run locally with Flask.`;
  }
  return `I've generated a code solution for your request. The implementation follows edge-resilient principles with zero external API dependencies for core logic.<br><br>Would you like me to expand this into a full module, or shall I generate the corresponding JavaScript/Node.js version?`;
}

function generateSocialResponse(voice) {
  return `🚀 <strong>CINIS NEXUS is LIVE!</strong><br><br>Our sovereign industrial AI core is now operational from Ogoja, Cross River State, Nigeria. 🇳🇬<br><br>What we built:<br>⚡ Edge-resilient automation<br>🤖 4 AI agents working 24/7<br>💳 Paystack + Flutterwave integration<br>🛒 Shopify-connected commerce<br>🌐 Social command center<br><br>The future of African industry starts here.<br><br>#CINISNEXUS #SovereignAI #IndustrialAutomation #NigeriaTech #CortexPlatform`;
}

function generateProductResponse(voice) {
  return `<strong>Cortex Platform — Sovereign Industrial AI Core</strong><br><br>Transform your industrial operations with Africa's first sovereign AI platform. Engineered for zero-latency execution across local terminal environments including Termux and Pydroid-3.<br><br><strong>Key Features:</strong><br>• Deterministic workflows with offline-first architecture<br>• 4 specialized AI agents (Cortex, MikeComplex, Builder, Scout)<br>• Integrated payment processing (Paystack & Flutterwave)<br>• Shopify store synchronization<br>• Cross-platform social media command center<br>• Data sovereignty and private node hosting<br><br><strong>Perfect for:</strong> Industrial manufacturers, tech entrepreneurs, and businesses seeking AI-powered automation with complete data control.<br><br>Founded by Michael Ujuku Morim in Ogoja, Nigeria.`;
}

function generateAnalysisResponse(voice) {
  return `<strong>Market Intelligence Report — CINIS NEXUS Sector</strong><br><br>Based on current industrial AI trends in the Nigerian and West African markets:<br><br>📈 <strong>Growth Opportunity:</strong> Industrial automation adoption in Nigeria is projected to grow 340% by 2028.<br><br>🎯 <strong>Competitive Edge:</strong> Sovereign/edge-first architecture positions CINIS NEXUS uniquely against cloud-dependent competitors.<br><br>💰 <strong>Revenue Streams:</strong><br>• Platform subscriptions<br>• AI agent task execution<br>• Payment processing fees<br>• Shopify integration services<br>• Content & marketing automation<br><br>🌍 <strong>Geographic Advantage:</strong> Ogoja, Cross River State offers strategic positioning for pan-African expansion.<br><br>Recommendation: Accelerate social media presence and Shopify store launch to capture early market share.`;
}

function generateMarketingResponse(voice) {
  return `<strong>Marketing Campaign: "Sovereign Future"</strong><br><br><strong>Headline:</strong> Your Industry. Your Data. Your AI.<br><br><strong>Body:</strong> CINIS NEXUS INDUSTRY HQ delivers the first truly sovereign industrial AI platform built for African businesses. No cloud lock-in. No data leakage. Pure edge-resilient power.<br><br><strong>CTA:</strong> Launch Your Sovereign Operations →<br><br><strong>Channels:</strong><br>• X/Twitter: Thread series on data sovereignty<br>• YouTube: Architecture deep-dives with @MikecomplexAi<br>• TikTok: 60-second platform demos<br>• LinkedIn: B2B thought leadership<br><br><strong>Budget Allocation:</strong> 40% content, 30% paid social, 20% partnerships, 10% events`;
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

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', () => {
  const aiInput = document.getElementById('ai-input');
  if (aiInput) {
    aiInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    aiInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAiMessage();
      }
    });
  }
});

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
  // Show toast notification
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

// ============================================
// QUICK ACTIONS
// ============================================
function quickAction(action) {
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

  if (!subject && !brief) {
    output.value = 'Please enter a subject or brief first, then click Generate.';
    return;
  }

  output.value = '✨ Generating content with ' + VOICES[CortexState.currentVoice].name + '...';

  setTimeout(() => {
    const voice = VOICES[CortexState.currentVoice];
    let generated = '';

    if (CortexState.contentType === 'email') {
      generated = generateEmailResponse(voice);
    } else if (CortexState.contentType === 'social') {
      generated = generateSocialResponse(voice);
    } else if (CortexState.contentType === 'product') {
      generated = generateProductResponse(voice);
    } else {
      generated = `<strong>${subject || 'Generated Content'}</strong>

Tone: ${tone}
Audience: ${audience}

${brief}

[AI-generated content would appear here based on your brief. This is a demo of the content generation pipeline.]

— Generated by ${voice.name}`;
    }

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
  showToast('Payment configuration saved (demo mode)');
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
  const storeUrl = prompt('Enter your Shopify store URL (e.g., yourstore.myshopify.com):');
  if (storeUrl) {
    CortexState.shopifyConnected = true;
    document.getElementById('shopify-url').textContent = storeUrl;
    document.getElementById('shopify-url').className = 'status-connected';
    document.getElementById('shopify-api').textContent = 'Connected';
    document.getElementById('shopify-api').className = 'status-connected';
    document.getElementById('shopify-webhook').textContent = 'Active';
    document.getElementById('shopify-webhook').className = 'status-connected';
    document.getElementById('shopify-inventory').textContent = 'Synced';
    document.getElementById('shopify-inventory').className = 'status-connected';

    showToast('Shopify store connected: ' + storeUrl);
    addLog('Shopify integration established: ' + storeUrl, 'success');
  }
}

function viewIntegrationDocs() {
  addLog('Shopify integration documentation requested', 'info');
  showToast('Documentation opening in new tab...');
}

// ============================================
// PAYMENTS
// ============================================
function testPaystack() {
  showToast('Paystack test payment initiated (demo)');
  addLog('Paystack test transaction simulated', 'info');

  // Simulate a transaction
  setTimeout(() => {
    addLog('Paystack test payment: SUCCESS — ₦5,000.00', 'success');
    document.getElementById('paystack-total').textContent = '₦5,000.00';
    document.getElementById('paystack-success').textContent = '1';
    document.getElementById('total-processed').textContent = '₦5,000.00';
    document.getElementById('total-success').textContent = '1';
    document.getElementById('stat-revenue').textContent = '₦5,000.00';
  }, 2000);
}

function testFlutterwave() {
  showToast('Flutterwave test payment initiated (demo)');
  addLog('Flutterwave test transaction simulated', 'info');

  setTimeout(() => {
    addLog('Flutterwave test payment: SUCCESS — ₦3,500.00', 'success');
    document.getElementById('flutterwave-total').textContent = '₦3,500.00';
    document.getElementById('flutterwave-success').textContent = '1';
    document.getElementById('total-processed').textContent = '₦8,500.00';
    document.getElementById('total-success').textContent = '2';
    document.getElementById('stat-revenue').textContent = '₦8,500.00';
  }, 2000);
}

function viewPaystackLogs() {
  addLog('Paystack transaction logs opened', 'info');
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
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length < 2) return;

      const tabs = ['dashboard', 'ai-workspace', 'business', 'shopify', 'payments', 'orders', 'social', 'content', 'settings', 'help'];
      const matched = tabs.find(t => t.includes(query) || query.includes(t));
      if (matched && matched !== CortexState.currentTab) {
        // Optional: auto-navigate on exact match
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase();
        addLog('Global search: "' + query + '"', 'info');

        // Route to appropriate tab
        if (query.includes('ai') || query.includes('cortex') || query.includes('bot')) switchTab('ai-workspace');
        else if (query.includes('shop')) switchTab('shopify');
        else if (query.includes('pay') || query.includes('money')) switchTab('payments');
        else if (query.includes('social') || query.includes('x') || query.includes('twitter')) switchTab('social');
        else if (query.includes('content') || query.includes('write')) switchTab('content');
        else if (query.includes('setting') || query.includes('config')) switchTab('settings');
        else if (query.includes('order')) switchTab('orders');
        else if (query.includes('business') || query.includes('industry')) switchTab('business');

        e.target.value = '';
      }
    });
  }
});

// ============================================
// UTILITIES
// ============================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('global-search').focus();
    }
    // Escape to close menus
    if (e.key === 'Escape') {
      document.getElementById('user-menu').classList.remove('show');
    }
  });

  // Simulate periodic activity
  setInterval(() => {
    if (CortexState.isAuth && Math.random() > 0.7) {
      const heartbeats = [
        'Heartbeat check — all systems nominal',
        'Edge node sync complete',
        'AI agent health check: OK',
        'Payment gateway status: online',
        'Social media monitoring: active'
      ];
      addLog(heartbeats[Math.floor(Math.random() * heartbeats.length)], 'info');
    }
  }, 30000);
});
