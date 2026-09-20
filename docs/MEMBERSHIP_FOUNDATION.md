# Membership & Access Foundation Plan

**Created:** 2026-09-20  
**Purpose:** Define the minimum viable membership system so paid users receive real value and the Founder receives recurring support.

---

## Goal

After a user pays (Professional or Enterprise), they must immediately have access to a protected area that delivers ongoing utility. Free users see limited public content only.

---

## Minimum Viable Membership (MVP)

### 1. Access Levels

| Tier          | Price          | Access                                      |
|---------------|----------------|---------------------------------------------|
| Free          | ₦0             | Public pages only                           |
| Professional  | ₦5,000 / month | Member dashboard + directory + basic reports|
| Enterprise    | ₦15,000 / month| Everything + priority support + future API  |

### 2. Required Components

- Simple authentication (email + password or magic link to start)
- Subscription status stored and checked
- Protected routes / pages under `/member/`
- Paystack webhook that sets `subscription_status = active` (and expiry) on successful charge
- Basic member dashboard showing:
  - Current plan
  - Directory search entry point
  - Placeholder for alerts / reports / education

### 3. Technical Path (Practical for current stack)

Current stack is Netlify + static HTML + `netlify/functions` + optional Express backend.

Recommended progressive path:

**Phase 1 (fastest)**  
- Use Netlify Identity or a lightweight JWT + simple user store (SQLite / JSON / external simple DB)  
- Webhook updates user record  
- Client-side check + server function protection for sensitive endpoints

**Phase 2**  
- Full proper auth + Postgres / better persistence  
- Real-time directory with claimable listings

### 4. Founder-Only Steps Still Required

1. Confirm `PAYSTACK_SECRET_KEY` is set in Netlify environment variables.
2. Confirm webhook URL in Paystack dashboard points to the correct Netlify function.
3. Test one live payment end-to-end and verify access is granted.

Everything else can be scaffolded and improved in the repository.

---

## Immediate Deliverables in Repo

- `/member/` folder structure
- Clear documentation of the access model
- Updated NEXT_ACTIONS that reflect the real remaining founder steps
- Issues / project board for tracking the build

---

**This plan is now the working reference for membership work.**
