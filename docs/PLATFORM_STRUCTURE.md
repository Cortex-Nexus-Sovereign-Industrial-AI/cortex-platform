# CINIS / Cortex Platform — Authoritative Structure

**Last updated:** 2026-09-20 (late)  
**Authority:** Acting Technical Director (on behalf of Founder Michael Ujuku Morim)  
**Repository:** Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform  
**Status:** Active build — coding & wiring in progress (test keys)

This document is the single source of truth for how the platform must be organized to become a complete, functional, revenue-generating system.

---

## 1. Core Purpose (Locked)

CINIS NEXUS INDUSTRY OGOJA is an AI-powered regional industry intelligence platform that connects businesses, farmers, government and communities in Ogoja / Cross River State (and later wider Nigeria).

It must deliver real ongoing value so that paid subscriptions (Professional ₦5,000 / Enterprise ₦15,000) and sponsored listings generate recurring financial support for the Founder.

---

## 2. Required Layers

### Layer A — Public Marketing Surface ✅ Strong
- Landing / hero / features / pricing / contact
- Live: https://cortex-platforms.netlify.app

### Layer B — Authentication & Membership 🟡 Scaffolded
- Member area under `/member/`
- Dashboard, directory, success page in place
- Full auth + durable grant store still to be hardened

### Layer C — Core Services 🟡 Scaffolded
- Directory search UI ready
- Reports / education / alerts placeholders on dashboard

### Layer D — Payments & Access Control 🟡 Wired (test)
- Paystack payment link live
- Webhook function exists and verifies HMAC with `PAYSTACK_SECRET_KEY`
- Secret already on Netlify (test key)
- Live key switch deferred — see `docs/commerce/LIVE_KEY_SWITCH.md`

### Layer E — Admin / Founder Control ⬜ Later
- Mock admin exists elsewhere; real panel after membership is solid

### Layer F — Data & Infrastructure 🟡 Partial
- Netlify functions + backend path exist
- Durable membership store still progressive

---

## 3. Target Repository Layout

```
cortex-platform/
├── index.html
├── offers.html
├── identity.html
├── metrics-dashboard.html
├── member/
│   ├── index.html       # Dashboard
│   ├── directory.html   # Searchable directory
│   ├── success.html     # Post-payment landing
│   └── profile.html     # Profile stub
├── netlify/functions/   # paystack-webhook, etc.
├── backend/
├── docs/
│   ├── PLATFORM_STRUCTURE.md
│   ├── NEXT_ACTIONS.md
│   ├── commerce/
│   │   ├── ACCESS_FLOW.md
│   │   ├── LIVE_KEY_SWITCH.md
│   │   └── PAYSTACK_KEYS.md
│   └── ...
└── README.md
```

---

## 4. Priority Order (Locked)

1. Close payment → access loop (webhook + grant) — in progress under test keys  
2. Member area usable — scaffold done  
3. Minimal viable directory — scaffold done  
4. Clean docs — done / ongoing  
5. Real data + retention — next phase after live switch  

**Live key switch only after Director explicit reminder.**

---

## 5. Revenue Support for Founder

- Subscriptions (primary)
- Sponsored directory listings
- Later: reports, API, grants

---

## 6. Current Snapshot (2026-09-20 late)

| Layer | Status |
|-------|--------|
| Public marketing | ✅ Strong |
| Member area scaffold | ✅ Done |
| Directory scaffold | ✅ Done |
| Post-payment success page | ✅ Done |
| Webhook HMAC | ✅ Exists |
| PAYSTACK_SECRET_KEY on Netlify | ✅ Present (test) |
| Live key switch | ⏳ Deferred until reminder |
| Durable access grant store | 🟡 Next coding |
| Full auth (login/signup) | 🟡 Progressive |

---

## 7. Governance

Final authority: Founder Michael Ujuku Morim.  
This file is the operational map for the Acting Technical Director.
