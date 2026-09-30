# Cortex Intelligence Nexus — Production Ready

Cortex Intelligence Nexus is the public-facing platform and service layer for completed digital and operational services in Ogoja, Cross River State, Nigeria.

This repository contains the live production platform structure for:
- public-facing website
- member dashboard
- offers and booking
- payment and access flow
- backend API and auth layer

## Live surfaces

- Website: https://cortex-platforms.netlify.app
- Offers: https://cortex-platforms.netlify.app/offers.html
- Identity: https://cortex-platforms.netlify.app/identity.html
- Dashboard: https://cortex-platforms.netlify.app/member-dashboard.html

## Business model

What we deliver:
- Electronics and appliance repair
- Practical agro and trader automations
- Structured digital content systems

Primary business rule:
- Lead with completed, paid work
- Never promise income or follower growth
- Keep public messaging factual and service-oriented

## Production architecture

```
Browser
  -> Netlify static frontend
       -> public pages
       -> offers
       -> identity
       -> dashboard
  -> Render backend API
       -> JWT auth
       -> order handling
       -> Paystack verification
       -> access grants
  -> SQLite database
```

## Repository structure

```
cortex-platform/
├── README_PRODUCTION.md
├── IDENTITY.md
├── COMMAND_CENTER.md
├── DEPLOYMENT.md
├── DEPLOY_CHECKLIST.md
├── .gitignore
├── .env.example
├── package.json
├── render.yaml
├── public/
│   ├── index.html
│   ├── offers.html
│   ├── identity.html
│   ├── metrics-dashboard.html
│   ├── member-dashboard.html
│   ├── support.html
│   ├── join.html
│   ├── research.html
│   ├── products.html
│   ├── projects.html
│   ├── documentation.html
│   ├── documents.html
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── pages/
├── backend/
│   ├── README.md
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── db/
│   │   └── database.sqlite
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       └── utils/
├── docs/
│   ├── deployment/
│   ├── architecture/
│   └── ops/
└── scripts/
    └── release-check.sh
```

## Backend API

The production backend provides:
- health check
- user auth
- orders
- payment verification
- webhook handling

Core endpoints:
- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/orders
- GET /api/orders/:id
- POST /api/payments/verify
- POST /api/webhooks/paystack

## Environment variables

Create a backend `.env` file:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_secure_secret_here
FRONTEND_URL=https://your-site.netlify.app
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

## Deployment

### Frontend
Deploy the `public/` directory to Netlify.

### Backend
Deploy `backend/` to Render.

## Production rules

- Keep one canonical app structure
- Keep one live frontend
- Keep one live backend
- Archive experimental features and duplicate files
- Never mix the production app with unverified automation modules
- Do not commit live secrets
- Keep business claims factual

## Release checklist

- [ ] backend starts locally
- [ ] /api/health works
- [ ] auth flow works
- [ ] Paystack flow works
- [ ] webhook endpoint works
- [ ] frontend loads correctly
- [ ] environment variables are configured
- [ ] site is secured with HTTPS
- [ ] final smoke test passes

## Notes

This repository is structured for a clean live deployment and not for broad experimental expansion. Experimental modules and alternate architecture drafts should be moved out of the active production path until they are fully validated.

© 2026 Cortex Intelligence Nexus
