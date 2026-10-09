# 🔐 Cortex Intelligence Nexus — Build, Deploy & Identity Lock

**Status:** LOCKED CANONICAL DIRECTIVE  
**Effective:** 2026-10-09  
**Owner:** Michael Ujuku Morim  
**Repository:** Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform

---

## SECTION 1: CANONICAL IDENTITY (NON-NEGOTIABLE)

### Legal / Public Identity
```
Public Name:       Cortex Intelligence Nexus (ONLY)
Owner:             Michael Ujuku Morim (ONLY)
Organization:      Cortex-Nexus-Sovereign-Industrial-AI
Platform Name:     Cortex Platform / CINIS
Primary Domain:    https://cortex-platforms.netlify.app
HQ Location:       Ogoja, Cross River State, Nigeria
Payment Gateway:   Paystack (primary)
Contact Email:     cortexnexus@proton.me
WhatsApp:          0901 025 1577
```

### Child Division (Locked Relationship)
```
Division Name:     DARKTRONIX 9V LABS
Type:              Technical education + diagnostics division
Parent:            Cortex Intelligence Nexus
Public Destination: /darktronix.html
Positioning:       "I learned the practical field. Now I teach the reasoning."
```

### Non-Negotiable Rules
- ✅ Use **Cortex Intelligence Nexus** in all public messaging
- ❌ Never use alternate names (CINIS is internal reference only)
- ✅ Always attribute work to **Michael Ujuku Morim**
- ❌ Never make unsupported income/follower guarantees
- ✅ Lead with **problem → solution → verified outcome**
- ❌ Never commit secrets (.env, keys, tokens) to repo

---

## SECTION 2: BUILD PROCESS (LOCKED WORKFLOW)

### 2.1 Local Environment Setup

```bash
# Clone
git clone https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform.git
cd cortex-platform

# Environment
cp env.example .env

# REQUIRED secrets to add to .env:
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxx
JWT_SECRET=your-jwt-secret-2026
FRONTEND_URL=https://cortex-platforms.netlify.app
SHOPIFY_STORE_DOMAIN=cortex-intelligence-nexus.myshopify.com
NODE_ENV=production
```

### 2.2 Backend Build

```bash
cd backend
npm install
npm run test  # Optional: run jest suite
npm start     # Local: http://localhost:3000/api/health
```

**Verification Steps:**
```bash
# Health check
curl http://localhost:3000/api/health
# Expected: { "status": "ok", "platform": "Cortex Platform v2.3" }

# Auth register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@cortex.local","password":"test1234"}'

# Paystack webhook path active
curl http://localhost:3000/api/webhooks/paystack
# Expected: Method not allowed (GET) — POST only (correct behavior)
```

### 2.3 Frontend (No Build Required)

Frontend is **100% static HTML/CSS/JS** served by Netlify or Render.

```bash
# File structure:
- index.html (landing)
- member-dashboard.html (for logged-in users)
- metrics-dashboard.html (platform pulse)
- identity.html (about + brand)
- offers.html (booking + products)
- command-center.html (internal ops hub)
- /styles.css
- /app.js
```

No bundler, no compilation. Netlify serves directly from repo root.

---

## SECTION 3: DEPLOYMENT (LOCKED PATHS)

### 3.1 Netlify (Frontend + Static)

**Status:** LIVE at https://cortex-platforms.netlify.app

**Configuration:**
- Build command: `echo build-ok`
- Publish directory: `.` (repo root)
- Functions directory: `netlify/functions`
- Redirects: configured in `netlify.toml`

**Deploy Steps:**
1. Connect GitHub repo → Netlify
2. Netlify auto-detects `netlify.toml`
3. On every main push: auto-deploy
4. Test: `https://cortex-platforms.netlify.app/api/health`

### 3.2 Render (Backend + API)

**Status:** Ready (not yet deployed — use if Netlify Functions insufficient)

**Configuration File:** `render.yaml`
```yaml
services:
  - type: web
    name: cortex-platform-api
    runtime: node
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
```

**Deploy Steps:**
1. Go to https://render.com/dashboard
2. Create new project → Blueprint
3. Connect GitHub repo
4. Upload `render.yaml`
5. Set environment variables:
   - `JWT_SECRET` → (auto-generated or set manually)
   - `PAYSTACK_SECRET_KEY` → (from Paystack merchant dashboard)
   - `PAYSTACK_PUBLIC_KEY` → (from Paystack merchant dashboard)
   - `FRONTEND_URL` → `https://cortex-platforms.netlify.app`
6. Deploy
7. Add Paystack webhook URL:
   - Go to Paystack dashboard → Settings → Webhooks
   - Add: `https://<render-service>.onrender.com/api/webhooks/paystack`

### 3.3 Database (SQLite — Embedded)

- Location: `backend/data/cortex.db`
- Auto-created on first backend start
- Tables: `users`, `orders`, `transactions`, `access_grants`, `webhook_logs`
- Backup strategy: Daily git commit snapshots (optional)

**Reset Database:**
```bash
rm backend/data/cortex.db
npm start  # Recreates schema
```

---

## SECTION 4: REVENUE GENERATION (LOCKED COMMERCE MODEL)

### 4.1 Pricing Structure

| Product | Price | Delivery | Status |
|---------|-------|----------|--------|
| **30-Day AI Content System** | ₦22,000 | Digital | 🟢 Live |
| **Agro/Trader Automation** | ₦15,000–₦50,000 | Custom | 🟢 WhatsApp only |
| **Electronics Diagnosis** | Diagnosis fee + agreed total | Physical | 🟢 WhatsApp only |
| **DARKTRONIX Educational Coaching** | Tiered | Online/Physical | 🟢 By enquiry |

### 4.2 Payment Flows

**Flow 1: Online Purchase (Paystack)**
```
User → offers.html → Paystack form → Webhook → access_grants table → Email confirmation
```

**Flow 2: WhatsApp / Cash (Manual)**
```
User → WhatsApp (0901 025 1577) → Confirmation → Manual entry → system delivery
```

**Paystack Configuration:**
```
Test Mode: ❌ DISABLED (live only)
Webhook URL: https://cortex-platforms.netlify.app/api/webhooks/paystack
              OR https://<render-service>.onrender.com/api/webhooks/paystack
Event: charge.success
Verify signature: ✅ ENABLED
```

### 4.3 Member Access Control

**Access grants are created when:**
1. Payment received via Paystack webhook
2. `charge.success` event fires
3. Email + product auto-matched to `access_grants` table

**Member can access content when:**
```javascript
// Endpoint: GET /api/member-payload?email=user@example.com
// Check: access_grants WHERE email = user_email AND active = 1
```

### 4.4 Metrics Tracking (Revenue Tracking)

**Endpoints:**
- `GET /api/stats` (authenticated) — revenue summary
- `GET /api/metrics/pulse` (authenticated) — weekly/monthly/yearly breakdown

**Tracked Metrics:**
- Total orders
- Completed orders (status: 'completed')
- Pending orders
- Total revenue (sum of amount_ngn for completed orders)
- Active access grants
- Member growth trend

---

## SECTION 5: PROFESSIONAL LOOK & SOLIDIFICATION

### 5.1 Visual Design (Locked)

**Color Scheme (CINIS Standard):**
```css
Primary:    #6366f1 (indigo — trust, tech)
Accent:     #ec4899 (pink — energy, conversion)
Dark BG:    #0f172a (navy — professional)
Text:       #f1f5f9 (light — readability)
Success:    #10b981 (emerald — completed)
Warning:    #f59e0b (amber — pending)
Error:      #ef4444 (red — issues)
```

**Typography:**
```css
Headlines:  Inter, sans-serif (geometric, modern)
Body:       Segoe UI, sans-serif (clean, universal)
Code:       Fira Code, monospace (technical sections)
```

### 5.2 Content Sections (Locked Structure)

**Homepage (index.html)**
- Hero: Problem statement → Cortex solution
- Services: Card layout (3-column)
- Testimonials / Results: Social proof
- CTA: "Book Now" → WhatsApp or offers.html
- Footer: Contact + compliance

**Offers Page (offers.html)**
- Product cards: Clear price + scope
- Paystack button: Real payment integration
- FAQ: Objection handling
- Guarantee: 7-day satisfaction or refund

**Identity Page (identity.html)**
- Brand story: Who is Michael Ujuku Morim?
- Technical background
- DARKTRONIX origin story
- Operating values (problem → outcome focus)

**Member Dashboard (member-dashboard.html)**
- Access summary: What you own
- Content library: Unlocked episodes
- Usage stats: Your engagement
- Support: Quick contact button

**Metrics Dashboard (metrics-dashboard.html)**
- Week/Month/Year views
- KPIs: Listens, views, conversions, revenue
- Health status: Growing / Healthy / Optimize
- Leaderboard: Top content

### 5.3 Professionalism Checklist

- ✅ HTTPS everywhere (Netlify + Render auto-SSL)
- ✅ No typos or grammar errors (spell-check before deploy)
- ✅ Load times < 2s (lighthouse score > 80)
- ✅ Mobile responsive (test on device before deploy)
- ✅ Accessibility: WCAG 2.1 AA (semantic HTML, alt text)
- ✅ Privacy policy + terms (link in footer)
- ✅ Google Business profile verified (linked in identity)
- ✅ Error handling: User-friendly messages (not stack traces)
- ✅ Security: No secrets in frontend, no console logs with sensitive data
- ✅ Analytics: Google Analytics + Paystack reporting

---

## SECTION 6: DEPLOYMENT CHECKLIST

Before pushing to production:

```markdown
## Pre-Deploy
- [ ] All secrets moved to .env (NOT in code)
- [ ] Identity.md reviewed and locked
- [ ] Privacy policy exists and is linked
- [ ] All links are HTTPS
- [ ] Contact email is cortexnexus@proton.me
- [ ] WhatsApp link is 0901 025 1577
- [ ] Paystack keys are LIVE (not test)
- [ ] Netlify health check configured
- [ ] Render health check configured
- [ ] Database backup strategy documented

## Deploy Netlify
- [ ] Push to GitHub main branch
- [ ] Wait for Netlify build (should take < 2min)
- [ ] Test https://cortex-platforms.netlify.app
- [ ] Check /api/health endpoint
- [ ] Test offers page → Paystack form

## Deploy Render
- [ ] Create render.yaml or use dashboard
- [ ] Set all environment variables
- [ ] Deploy service
- [ ] Wait for health check pass
- [ ] Test /api/health from Render URL
- [ ] Update Paystack webhook URL (if using Render backend)
- [ ] Test webhook processing with test charge

## Post-Deploy
- [ ] Monitor error logs for 24h
- [ ] Verify first payment flow end-to-end
- [ ] Check member dashboard access
- [ ] Test email notifications
- [ ] Update social media links (Google Business, X, LinkedIn)
- [ ] Announce launch to WhatsApp followers
```

---

## SECTION 7: MONTHLY OPERATIONS (LOCKED)

### Content Cycle
```
Week 1: Generate 4 podcast episodes (cortex_content_orchestrator.py)
Week 2: Convert to social assets (media-agent)
Week 3: Publish to YouTube + TikTok
Week 4: Measure + adjust messaging based on metrics
```

### Revenue Tracking
```bash
# Check weekly revenue
curl -H "Authorization: Bearer <TOKEN>" \
  https://cortex-platforms.netlify.app/api/stats

# Check member growth
# → access_grants table size
```

### Compliance
- Check Google Business profile reviews (respond within 24h)
- Update Paystack dispute/chargeback records
- Archive transaction logs monthly

---

## SECTION 8: LOCKED GOVERNANCE

**Any changes to this directive require:**
1. Update IDENTITY.md first
2. Update this file
3. Git commit with message: `[GOVERNANCE] Update Build/Deploy/Identity lock`
4. Notify team/stakeholders
5. Update version stamp below

**Current Version:** 1.0.0  
**Last Updated:** 2026-10-09  
**Approved By:** Michael Ujuku Morim  
**Next Review:** 2026-11-09

---

## SECTION 9: QUICK REFERENCE

### Repos & Links
- Repo: https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform
- Live: https://cortex-platforms.netlify.app
- Identity SSOT: IDENTITY.md
- Ops Entry: COMMAND_CENTER.md
- Google Business: https://maps.google.com/maps?cid=2073161413550473641

### Commands
```bash
# Local dev
cd backend && npm install && npm start

# Test health
curl http://localhost:3000/api/health

# Deploy (auto on git push to main)
git add -A && git commit -m "Update build" && git push origin main

# Database reset (CAUTION)
rm backend/data/cortex.db && npm start
```

### Contacts
- Founder: Michael Ujuku Morim
- Email: cortexnexus@proton.me
- WhatsApp: 0901 025 1577
- GitHub: @mikecomplexai-7

---

**This document is the single source of truth for all Cortex Intelligence Nexus builds, deployments, and identity governance. All team members, agents, and processes must align with this directive.**
