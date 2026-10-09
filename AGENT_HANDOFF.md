# Cortex Platform Agent Handoff & Continuation Guide

**Purpose:** Enable any future AI agent, developer, or ChatGPT instance to continue building on this system without loss of context or direction.

**Last updated:** 2026-10-09  
**System owner:** Michael Ujuku Morim  
**Repo:** https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform

---

## What has been built (as of 2026-10-09)

### 1. Identity Layer (LOCKED)
- **Single source of truth:** `IDENTITY.md` + `COMMAND_CENTER.md`
- **Brand name:** Cortex Intelligence Nexus (only)
- **Founder:** Michael Ujuku Morim (only)
- **Child division:** DARKTRONIX 9V LABS (education-first)
- **Primary site:** https://cortex-platforms.netlify.app
- **Offers:** https://cortex-platforms.netlify.app/offers.html
- **Google Business:** Verified + linked
- **Non-negotiable rules:**
  - No fake income promises
  - No follower guarantees
  - Problem-to-outcome framework only
  - Operational, verified content only

### 2. Content Agent Architecture (ACTIVE)

**Location:** `agents/` directory

**Components:**
- `cortex_content_orchestrator.py` — central router and validator
- `podcast_agent.py` — autonomous podcast script generator
- `member_gate_router.py` — access grant management + content routing
- `metrics_tracker.py` — autonomous performance logging
- `run_agents.sh` — one-command activation script

**Capabilities:**
- generates podcast episodes aligned to IDENTITY.md
- creates public teasers (60-second social versions)
- manages Paystack payment → access grant flow
- logs listens, views, clicks, conversions, revenue
- exports metrics to Platform Pulse dashboard

### 3. Content Generation (IN PRODUCTION)

**First launch kit:** `content-output/launch/first_launch_kit.md`

**Published content:**
- `content-output/podcast/cortex_signals_1.md` — full episode script
- `content-output/podcast/cortex_signals_1_teaser.md` — 60-second social teaser
- `content-output/member/dashboard_payload_example.json` — member access structure

**Revenue model:**
- 30-Day AI Content System: ₦22,000 (Paystack)
- Teaser → offer → checkout → access grant → member unlock

### 4. Member Access & Gating (WIRED)

**Flow:**
1. User sees public teaser
2. Clicks CTA to offers.html
3. Paystack checkout (₦22,000)
4. Success webhook fires to backend
5. Backend calls `member_gate_router.create_access_grant()`
6. Access grant created in `content-output/access-grants/`
7. Member dashboard reads access grants
8. User sees full podcast + member content

**Integration point:** `backend/paystack_webhook.js` needs to call Python agent on webhook success

### 5. Metrics Tracking (AUTONOMOUS)

**Tracked metrics:**
- podcast_listens (duration + user email)
- content_views (type + user email)
- offer_clicks (source + user email)
- conversions (Paystack reference + amount + email)
- member_retention (days active per user)

**Output:** Platform Pulse dashboard (metrics-dashboard.html) reads from `content-output/metrics/`

**Health status indicators:**
- member_growth (early/growing/strong)
- engagement (warming_up/active/strong)
- revenue (early/growing/strong)
- conversion_efficiency (optimize/healthy/excellent)

---

## How to continue building (instructions for next agent)

### If you are a new agent (ChatGPT, Claude, next developer):

1. **Read these files first:**
   - `IDENTITY.md` — brand rules (non-negotiable)
   - `COMMAND_CENTER.md` — operational entry point
   - `agents/DEPLOYMENT.md` — deployment checklist
   - `content-output/launch/first_launch_kit.md` — first cycle structure

2. **Understand the current state:**
   - The podcast agent is ready to generate episodes
   - The member gate is wired but needs backend webhook integration
   - The metrics tracker is autonomous and logs to JSON
   - The first episode (Cortex Signals #1) is ready for publication

3. **Do NOT rebuild what exists:**
   - Do not rewrite `agents/podcast_agent.py`
   - Do not recreate the member gate logic
   - Do not change the IDENTITY.md rules
   - Extend, integrate, and optimize only

4. **Common next tasks:**
   - **Integrate backend webhook:** Wire Paystack success → Python agent call
   - **Render member dashboard:** Build HTML to read `dashboard_payload_example.json`
   - **Render metrics dashboard:** Build HTML to read `content-output/metrics/`
   - **Generate episodes 2+:** Call `podcast_agent.py` to create next episodes
   - **Optimize offers page:** Improve CTA and conversion flow
   - **Add social media posting:** Automate teaser distribution

---

## Agent handoff checklist

Before handing off to the next agent, verify:

### Identity layer
- [ ] IDENTITY.md is the source of truth
- [ ] COMMAND_CENTER.md is updated with current status
- [ ] All public content references Cortex Intelligence Nexus only
- [ ] No conflicting brand names or messaging

### Content agents
- [ ] `agents/` directory exists with all 4 Python files
- [ ] `run_agents.sh` is executable and tested
- [ ] `podcast_agent.py` generates valid episode scripts
- [ ] `member_gate_router.py` creates access grants correctly
- [ ] `metrics_tracker.py` logs events to JSON

### Content production
- [ ] First episode (cortex_signals_1.md) is ready
- [ ] First teaser (cortex_signals_1_teaser.md) is ready
- [ ] Member dashboard payload example exists
- [ ] Launch kit is documented in `content-output/launch/`

### Integration points
- [ ] Backend Paystack webhook exists at `/api/webhooks/paystack`
- [ ] Webhook can call Python agents to create access grants
- [ ] Member dashboard HTML exists and reads access grants
- [ ] Metrics dashboard HTML exists and reads from `content-output/metrics/`
- [ ] Offers page CTA links are correct

### Metrics & monitoring
- [ ] Metrics tracker is logging events to JSON
- [ ] Platform Pulse can read metrics files
- [ ] Health status calculations are accurate
- [ ] First conversion has been logged and verified

---

## System architecture (visual)

```
PUBLIC TEASER
    ↓
OFFERS PAGE (cortex-platforms.netlify.app/offers.html)
    ↓
PAYSTACK CHECKOUT (₦22,000)
    ↓
PAYMENT SUCCESS WEBHOOK (backend/paystack_webhook.js)
    ↓
member_gate_router.create_access_grant()
    ↓
ACCESS GRANT STORED (content-output/access-grants/)
    ↓
MEMBER DASHBOARD READS ACCESS GRANTS
    ↓
USER SEES FULL PODCAST + MEMBER CONTENT
    ↓
METRICS TRACKER LOGS: conversion + revenue
    ↓
PLATFORM PULSE UPDATES (metrics-dashboard.html)
    ↓
CONTENT LOOP REPEATS: next episode
```

---

## Key files to understand

**Brand & identity:**
- `IDENTITY.md` — canonical source of truth
- `COMMAND_CENTER.md` — operational center

**Agents:**
- `agents/podcast_agent.py` — episode generation
- `agents/member_gate_router.py` — access control
- `agents/metrics_tracker.py` — performance logging
- `agents/cortex_content_orchestrator.py` — central router

**Content:**
- `content-output/podcast/` — generated episodes
- `content-output/member/` — member-facing payloads
- `content-output/metrics/` — event logs (JSON)
- `content-output/launch/` — launch planning

**Frontend:**
- `member-dashboard.html` — member access display
- `metrics-dashboard.html` — Platform Pulse
- `offers.html` — conversion entry point

**Backend:**
- `backend/paystack_webhook.js` — payment event handler (needs integration)
- `backend/` — Express API + SQLite

---

## Common next-agent tasks

### Task 1: Integrate backend webhook
**Who:** Backend developer or agent with Node.js knowledge
**What:** Wire Paystack success → member_gate_router.create_access_grant()
**Where:** `backend/paystack_webhook.js`
**How:** Import Python agent, call on successful payment

### Task 2: Build member dashboard UI
**Who:** Frontend developer or agent with HTML/JS knowledge
**What:** Render member content + access grants from `dashboard_payload_example.json`
**Where:** `member-dashboard.html`
**How:** Fetch access grants, loop through content, display unlocked episodes

### Task 3: Build Platform Pulse UI
**Who:** Frontend developer or agent with HTML/JS knowledge
**What:** Render metrics + health status from `content-output/metrics/`
**Where:** `metrics-dashboard.html`
**How:** Fetch metrics JSON, display revenue, conversions, member growth, engagement

### Task 4: Generate episodes 2–5
**Who:** Content agent or copywriter
**What:** Create 4 more podcast scripts using `podcast_agent.py`
**Where:** `content-output/podcast/`
**How:** Call agent with title, problem, solution, action

### Task 5: Publish first teaser
**Who:** Marketing or social media agent
**What:** Post teaser to social + email
**Where:** LinkedIn, Twitter/X, email
**How:** Use copy from `cortex_signals_1_teaser.md`, link to offers.html

### Task 6: Optimize offers page
**Who:** Growth or conversion specialist
**What:** Improve CTA, messaging, urgency
**Where:** `offers.html`
**How:** A/B test copy, track clicks via metrics_tracker

---

## System constraints (DO NOT VIOLATE)

1. **Brand identity is locked**
   - All content must reference "Cortex Intelligence Nexus" only
   - Founder name is "Michael Ujuku Morim" only
   - No alternate names, no confusion

2. **No fake promises**
   - No guaranteed income
   - No guaranteed followers
   - Problem-to-outcome framework only
   - Operational, verified reasoning only

3. **Revenue model is fixed**
   - 30-Day AI Content System = ₦22,000
   - Paystack is the payment provider
   - Access grants = member unlock mechanism

4. **Content gates are binary**
   - Public teaser = free
   - Full episode = behind access grant
   - No middle ground

5. **Metrics are autonomous**
   - All events logged to JSON
   - No fake metrics
   - Health status auto-calculated

---

## Token conservation tips for next agent

If the next agent runs low on tokens:

1. **Use this file as reference**
   - Don't re-explain the system
   - Point to this file

2. **Only fetch files you need**
   - Don't load the entire repo
   - Use specific file paths

3. **Batch similar tasks**
   - Generate multiple episodes at once
   - Create multiple CTAs together

4. **Reference existing patterns**
   - Cortex Signals #1 is the template
   - Use it for episodes 2–5
   - Don't rebuild from scratch

5. **Use Python agents for generation**
   - Don't write scripts manually
   - Call `podcast_agent.py` instead
   - It's already optimized

---

## How to resume if tokens are exhausted

**The next agent should do this:**

1. Read this file completely
2. Check `IDENTITY.md` for brand rules
3. Check `COMMAND_CENTER.md` for current status
4. Check `agents/DEPLOYMENT.md` for deployment checklist
5. Identify the next uncompleted task from the "Common next-agent tasks" section above
6. Execute only that task
7. Update this file with new status
8. Leave clear notes for the next agent

**Example handoff note:**

```
[Agent Name] — [Date] — [Status]
Completed: Backend webhook integration for Paystack
Next: Build member dashboard UI to render access grants
Files to modify: member-dashboard.html
Reference: content-output/member/dashboard_payload_example.json
Token usage: ~15k of 200k budget
```

---

## Current status (as of 2026-10-09)

✅ **Completed:**
- Identity layer locked (IDENTITY.md, COMMAND_CENTER.md)
- Content agents built (podcast, member gate, metrics)
- First episode scripted (Cortex Signals #1)
- First teaser created
- Launch kit documented
- Repo architecture established

⏳ **In progress:**
- Backend Paystack webhook integration
- Member dashboard rendering
- Metrics dashboard rendering
- First publication (teaser + offer)

🎯 **Next priorities:**
1. Wire backend webhook to create access grants
2. Build member dashboard to show unlocked content
3. Build metrics dashboard to show conversion + revenue
4. Publish first teaser to social + email
5. Monitor first conversions and access grants
6. Generate episodes 2–5
7. Optimize offers page based on metrics

---

**This document is the operational continuity guide.**

Any agent reading this should understand:
- What has been built
- What is not yet done
- How to continue without restarting
- What the non-negotiable rules are
- How to hand off to the next agent

**Repo:** https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform
