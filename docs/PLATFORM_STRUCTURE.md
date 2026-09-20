# CINIS / Cortex Platform — Authoritative Structure

**Last updated:** 2026-09-20  
**Authority:** Acting Technical Director (on behalf of Founder Michael Ujuku Morim)  
**Repository:** Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform  
**Status:** Active build plan

This document is the single source of truth for how the platform must be organized to become a complete, functional, revenue-generating system.

---

## 1. Core Purpose (Locked)

CINIS NEXUS INDUSTRY OGOJA is an AI-powered regional industry intelligence platform that connects businesses, farmers, government and communities in Ogoja / Cross River State (and later wider Nigeria).

It must deliver real ongoing value so that paid subscriptions (Professional ₦5,000 / Enterprise ₦15,000) and sponsored listings generate recurring financial support for the Founder.

---

## 2. Required Layers (What Must Exist)

### Layer A — Public Marketing Surface (mostly complete)
- Landing / hero / features / pricing / contact
- Live at: https://cortex-platforms.netlify.app
- Keep fast, static-friendly, mobile responsive

### Layer B — Authentication & Membership (CRITICAL GAP)
- Sign-up / login
- Role-based access: Free / Professional / Enterprise
- Subscription status tracking
- Protected member area

### Layer C — Core Services (CRITICAL GAP)
- Searchable Business / Farmer / Government Directory
- Member Dashboard (reports, saved items, alerts, education access)
- Funding / Opportunity board
- Basic market & agricultural intelligence (start curated)

### Layer D — Payments & Access Control (partially done)
- Paystack live integration
- Webhook that automatically grants / renews access on successful payment
- Clear upgrade / cancel flow

### Layer E — Admin / Founder Control
- Real admin panel for users, listings, content, revenue view
- Not mock HTML only

### Layer F — Data & Infrastructure
- Lightweight backend (existing `backend/` + Netlify Functions path)
- Persistent storage (SQLite path already noted, or upgrade later)
- Audit / event logging

---

## 3. Target Repository Layout (Clean Target)

```
cortex-platform/
├── index.html                  # Public marketing entry
├── offers.html                 # Pricing & payment
├── identity.html
├── metrics-dashboard.html
├── member/                     # NEW — protected member area
│   ├── index.html              # Member dashboard
│   ├── directory.html
│   └── profile.html
├── admin/                      # NEW — founder/admin only
│   └── index.html
├── assets/
├── netlify/
│   └── functions/              # Paystack webhook, auth helpers
├── backend/                    # Express / API layer
├── docs/
│   ├── PLATFORM_STRUCTURE.md   # This file (SSOT)
│   ├── NEXT_ACTIONS.md
│   └── ...
├── agents/                     # Internal runners only
└── README.md
```

Personal account repos (`mikecomplexai-7/*`) should be treated as secondary / profile / draft. All production work stays in the organization repository.

---

## 4. Priority Execution Order (Locked)

1. **Close payment → access loop**  
   Confirm live Paystack + working webhook that grants membership.

2. **Scaffold & protect member area**  
   Minimal but real dashboard that only paid users can usefully enter.

3. **Launch minimal viable directory**  
   Even curated listings + search is better than pure marketing page.

4. **Clean documentation & single README source of truth**

5. **Add real data value & retention loops**  
   Education, alerts, sponsored listings → recurring revenue.

---

## 5. Revenue Support Model for Founder

- Subscriptions (primary)
- Sponsored / featured directory listings
- Later: paid reports, API access (Enterprise), grants/partnerships

Settlement already flows through Paystack to Founder’s bank. The missing piece is delivering enough ongoing value that people stay subscribed.

---

## 6. Current Status Snapshot (2026-09-20)

| Layer                        | Status          | Notes                                      |
|-----------------------------|-----------------|--------------------------------------------|
| Public marketing surface    | Strong          | Live on Netlify                            |
| Identity & branding docs    | Strong          | IDENTITY.md, ECOSYSTEM_INDEX, etc.         |
| Paystack payment link       | Live            | Confirmed in previous NEXT_ACTIONS         |
| Webhook + auto access       | Incomplete      | Needs secret + confirmation                |
| Real auth / membership      | Missing         | Highest priority gap                       |
| Real directory + dashboard  | Missing         | Highest priority gap                       |
| Admin control panel         | Mock only       | Needs real data                            |
| Backend / storage           | Partial scaffold| Exists in repo but not fully operational   |

---

## 7. Governance Note

All strategic and final decisions remain with Founder Michael Ujuku Morim.  
This structure and priority list is the working operational map used by the Acting Technical Director role.

---

**Next concrete file actions will follow this document.**
