# Deployment Guide — Social Media Integration Module

**Complete deployment instructions for production**

---

## 🚀 Deployment Options

### Option 1: Docker (Recommended)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Option 2: Render.com (Free Tier)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Add social media integration"
git push origin main
```

2. **Create Render Service**
   - Go to https://render.com/dashboard
   - Click "New +" → "Web Service"
   - Select GitHub repository
   - Set build command: `npm ci && npm run migrate`
   - Set start command: `npm start`
   - Add environment variables (see below)

3. **Configure Environment Variables on Render**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-key
TWITTER_BEARER_TOKEN=...
LINKEDIN_ACCESS_TOKEN=...
TELEGRAM_BOT_TOKEN=...
... (add all from .env)
```

### Option 3: Railway.app

1. **Connect GitHub repo**
   - Go to https://railway.app/dashboard
   - Click "Create" → "GitHub repo"
   - Select your repository

2. **Add environment variables**
   - Railway will auto-detect Node.js project
   - Go to Variables tab
   - Paste all environment variables

3. **Deploy**
   - Railway auto-deploys on push
   - Monitor in Railway dashboard

### Option 4: AWS Lambda + API Gateway

```bash
# Install Serverless Framework
npm install -g serverless

# Deploy
serverless deploy
```

### Option 5: DigitalOcean App Platform

1. Go to DigitalOcean Dashboard
2. Click "Create" → "App"
3. Select GitHub repo
4. Set buildpack: Node.js
5. Configure environment variables
6. Deploy

---

## 🔐 Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `JWT_SECRET` — Random 32+ character string
- [ ] `TWITTER_BEARER_TOKEN` — From Twitter Developer Portal
- [ ] `LINKEDIN_ACCESS_TOKEN` — From LinkedIn Developer Console
- [ ] `TELEGRAM_BOT_TOKEN` — From @BotFather
- [ ] `WHATSAPP_BUSINESS_TOKEN` — From WhatsApp Business API
- [ ] `MEDIUM_INTEGRATION_TOKEN` — From Medium Settings
- [ ] `FRONTEND_URL` — Your frontend domain
- [ ] `NODE_ENV` — Set to 'production'

---

## 📊 Post-Deployment Checklist

- [ ] API is accessible at `/api/health`
- [ ] Database is initialized
- [ ] All environment variables set
- [ ] CORS configured for frontend domain
- [ ] SSL/HTTPS enabled
- [ ] Logs are accessible
- [ ] Health checks passing
- [ ] Rate limiting active

---

## 🔍 Monitoring

### Check Health
```bash
curl https://your-api.com/api/health
```

### View Logs
```bash
# Docker
docker-compose logs -f api

# Render
Visit Render dashboard → Logs tab

# Railway
Visit Railway dashboard → Logs
```

### Database Backup
```bash
# Download SQLite database
cp backend/social_media.db backup-$(date +%Y%m%d).db
```

---

## 🚨 Troubleshooting

**API not responding?**
- Check health endpoint: `/api/health`
- Verify environment variables
- Check logs for errors
- Ensure database is initialized

**Posts not publishing?**
- Verify API credentials
- Check platform rate limits
- Review error logs
- Test API endpoint directly

**Database issues?**
- Delete social_media.db and reinitialize
- Check file permissions
- Verify SQLite is installed

---

## 📈 Scaling

**For high volume:**
1. Switch to PostgreSQL (better for concurrency)
2. Add message queue (Redis/Bull)
3. Use horizontal scaling (multiple instances)
4. Implement caching layer

---

**Deployed successfully! 🎉**
