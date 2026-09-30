# Production Launch Checklist

## Pre-deployment

### Code quality
- [ ] No console.log statements left in production code
- [ ] No hardcoded secrets in code
- [ ] No TODO/FIXME comments blocking launch
- [ ] All dependencies in package.json
- [ ] No unused imports or files

### Security
- [ ] JWT_SECRET is random (32+ chars)
- [ ] Paystack keys are production keys (pk_live_, sk_live_)
- [ ] HTTPS is enabled
- [ ] CORS is configured correctly
- [ ] No exposed .env files
- [ ] Password hashing uses bcryptjs

### Backend
- [ ] npm install runs without errors
- [ ] npm start launches server
- [ ] GET /api/health returns 200
- [ ] POST /api/auth/register works
- [ ] POST /api/auth/login works
- [ ] GET /api/auth/me works (with JWT)
- [ ] POST /api/orders works (with JWT)
- [ ] GET /api/orders/:id works
- [ ] POST /api/payments/verify works
- [ ] POST /api/webhooks/paystack works
- [ ] Database creates and persists
- [ ] Error handling returns proper status codes

### Frontend
- [ ] All pages load
- [ ] No broken links
- [ ] No missing assets
- [ ] Mobile responsive
- [ ] Forms submit correctly
- [ ] Payment buttons work
- [ ] Dashboard loads with auth
- [ ] No console errors
- [ ] Images load correctly
- [ ] CSS/JS bundled correctly

### Payment flow
- [ ] Paystack test key works locally
- [ ] Test payment completes
- [ ] Webhook delivers successfully
- [ ] Access grant is created
- [ ] Order status updates to "paid"
- [ ] Email notification (if configured)

### Environment
- [ ] .env.example is up to date
- [ ] No production secrets in .env.example
- [ ] All required vars documented
- [ ] Render environment variables set
- [ ] Netlify environment variables set (if needed)
- [ ] Paystack webhook URL configured

## Deployment

### Frontend (Netlify)
- [ ] Repo connected to Netlify
- [ ] Publish directory set to `public`
- [ ] Build command set (if needed)
- [ ] Auto-deploy on push enabled
- [ ] Custom domain configured (if applicable)
- [ ] SSL/HTTPS enabled
- [ ] Site loads from live URL

### Backend (Render)
- [ ] Repo connected to Render
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] All environment variables set
- [ ] Auto-deploy on push enabled
- [ ] Service starts successfully
- [ ] Health endpoint responds
- [ ] Logs are accessible

## Post-deployment smoke test

### Frontend
- [ ] Site loads at https://cortex-platforms.netlify.app
- [ ] Page speed is acceptable (< 3s)
- [ ] All sections render
- [ ] Forms are interactive
- [ ] Links work

### Backend
- [ ] Health check: https://[service].onrender.com/api/health
- [ ] Response time < 1s
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create order
- [ ] Can verify payment

### Integration
- [ ] Frontend connects to backend
- [ ] Login flow works end-to-end
- [ ] Order creation works
- [ ] Payment flow works with Paystack
- [ ] Access grant is created after payment
- [ ] Dashboard shows member data

### Monitoring
- [ ] Netlify shows successful deploy
- [ ] Render shows service is running
- [ ] No errors in Render logs
- [ ] Paystack webhooks are delivering
- [ ] No failed transactions

## Final verification

- [ ] Walk through complete user flow
  - Visit site
  - Browse offers
  - Register account
  - Login
  - Create order
  - Pay with test card
  - Verify payment succeeds
  - Access granted
  - Dashboard updates
- [ ] All critical features working
- [ ] No blocking issues
- [ ] Performance acceptable
- [ ] Security measures in place

## Go/No-go decision

- [ ] All checklist items completed
- [ ] No critical issues found
- [ ] Stakeholder approval received
- [ ] Ready to launch

## Post-launch monitoring (24 hours)

- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Check Paystack transaction logs
- [ ] Monitor user registrations
- [ ] Monitor payment completions
- [ ] Check for any support tickets
- [ ] Verify email notifications (if enabled)
- [ ] Monitor database size

---

**Status**: Ready for production launch
