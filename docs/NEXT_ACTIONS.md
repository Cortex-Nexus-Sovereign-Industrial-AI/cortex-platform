# NEXT ACTIONS — Director Update
**Updated:** 2026-09-20 (evening)

## Locked instructions from Founder

- Finish coding and wiring first.
- Keep a clean placeholder for the live key switch.
- **Remind the Founder before conclusion / round-up** so the live `sk_live_...` key can be set cleanly.

## Completed this session

- [x] Full platform examination
- [x] PLATFORM_STRUCTURE.md (authoritative map)
- [x] MEMBERSHIP_FOUNDATION.md
- [x] Member area scaffold (`/member/index.html` + `/member/directory.html`)
- [x] Tracking issues #32, #33, #34
- [x] PR opened: https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform/pull/35
- [x] Confirmed `PAYSTACK_SECRET_KEY` already exists on Netlify (test key)
- [x] Clean live-key switch placeholder created: `docs/commerce/LIVE_KEY_SWITCH.md`

## In progress / next coding steps

1. Harden membership access path (how paid status is recognised and shown)
2. Ensure webhook → access grant path is clear and documented
3. Keep member dashboard and directory structure ready for real data
4. Maintain single source of truth docs

## Explicit reminder (do not skip)

Before the system build is declared complete / rounded up, the Acting Technical Director **must** tell the Founder:

> “Coding and wiring are finished. It is now time to switch to the live Paystack secret key (`sk_live_...`) and confirm the Live webhook. See `docs/commerce/LIVE_KEY_SWITCH.md`.”

Until that reminder is given, stay on test keys.

## Founder-only items (deferred until reminder)

- Paste live secret key into Netlify production context
- Register Live webhook URL in Paystack dashboard
- One live payment verification

## Primary live site
https://cortex-platforms.netlify.app
