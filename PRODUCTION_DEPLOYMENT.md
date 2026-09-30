# Production Deployment Guide

## Final deployment model

**Frontend**: Netlify (static site)
**Backend**: Render (Node.js API)
**Database**: SQLite (MVP)
**Auth**: JWT
**Payments**: Paystack

## Frontend deployment (Netlify)

1. Connect repo to Netlify
2. Set publish directory: `public`
3. Use index.html as root
4. Deploy

## Backend deployment (Render)

1. Create new Web Service on Render
2. Connect repo
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Configure environment variables in Render dashboard

## Environment variables (Render)

```
PORT=5000
NODE_ENV=production
JWT_SECRET=[32+ char random string]
FRONTEND_URL=https://cortex-platforms.netlify.app
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_WEBHOOK_SECRET=[webhook secret]
```

## Paystack webhook setup

1. Go to Paystack dashboard
2. Settings → Webhooks
3. Add webhook URL:
   ```
   https://[your-render-service].onrender.com/api/webhooks/paystack
   ```
4. Copy webhook secret to PAYSTACK_WEBHOOK_SECRET

## Pre-deployment checklist

- [ ] Backend runs locally: `npm start`
- [ ] /api/health returns 200
- [ ] Register/login work
- [ ] Test Paystack payment with pk_test_
- [ ] Frontend calls correct backend URL
- [ ] All static assets load
- [ ] No console errors
- [ ] HTTPS enabled
- [ ] Env vars set in production

## Post-deployment verification

1. Test frontend loads: https://cortex-platforms.netlify.app
2. Test backend health: https://[service].onrender.com/api/health
3. Test auth: register and login
4. Test order creation
5. Test payment flow with test key
6. Monitor logs in both Netlify and Render
7. Verify webhook delivery in Paystack dashboard

## Rollback procedure

If deployment fails:
1. Check Render/Netlify logs
2. Fix issue in code
3. Commit and push
4. Services auto-redeploy

## Monitoring

- Netlify: site status and deploy logs
- Render: application logs and health metrics
- Paystack: webhook delivery and transaction logs

---

**Status**: Ready for production push
