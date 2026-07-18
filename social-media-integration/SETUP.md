# Complete Setup Guide

**Step-by-step installation and configuration**

---

## 📋 Prerequisites

- Node.js 16+ and npm
- Docker & Docker Compose (optional, for containerized deployment)
- Git
- API credentials from social media platforms

---

## 🚀 Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform.git
cd cortex-platform/social-media-integration
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env

# Initialize database
npm run migrate

# (Optional) Seed test data
npm run seed

# Start server
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Dashboard runs on `http://localhost:3000`

### 4. Test API Connection

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "platform": "Cortex Social Media API",
  "version": "2.1.0",
  "timestamp": "2026-07-18T08:00:00Z"
}
```

---

## 🔐 Getting API Credentials

### Twitter/X

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create new app (if needed)
3. Go to "Keys and tokens"
4. Copy:
   - API Key → `TWITTER_API_KEY`
   - API Secret → `TWITTER_API_SECRET`
   - Access Token → `TWITTER_ACCESS_TOKEN`
   - Access Token Secret → `TWITTER_ACCESS_SECRET`
   - Bearer Token → `TWITTER_BEARER_TOKEN`

### LinkedIn

1. Go to https://www.linkedin.com/developers/apps
2. Create new app
3. Get credentials:
   - Client ID → `LINKEDIN_CLIENT_ID`
   - Client Secret → `LINKEDIN_CLIENT_SECRET`
4. Generate access token
5. Copy → `LINKEDIN_ACCESS_TOKEN`

### Telegram

1. Message @BotFather on Telegram
2. Create new bot: `/newbot`
3. Copy token → `TELEGRAM_BOT_TOKEN`
4. Get your chat ID:
   ```bash
   curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
   ```
5. Copy chat ID → `TELEGRAM_CHAT_ID`

### Medium

1. Go to https://medium.com/me/settings/security
2. Create integration token
3. Copy → `MEDIUM_INTEGRATION_TOKEN`

### WhatsApp Business

1. Go to https://www.whatsapp.com/business/api
2. Register for Business API
3. Get credentials from Meta Business Suite
4. Copy:
   - Business Token → `WHATSAPP_BUSINESS_TOKEN`
   - Phone ID → `WHATSAPP_PHONE_ID`

---

## 🐳 Docker Deployment

### Build & Run with Docker Compose

```bash
# Copy environment file
cp backend/.env.example .env

# Edit with credentials
nano .env

# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Access
# API: http://localhost:5000/api/health
# Dashboard: http://localhost:3000
```

### Troubleshoot

```bash
# View logs
docker-compose logs api
docker-compose logs frontend

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Clean up (remove volumes)
docker-compose down -v
```

---

## 📊 Database Setup

### Initialize Schema

```bash
cd backend
npm run migrate
```

### Seed Test Data

```bash
npm run seed
```

### View Database

```bash
# Install SQLite CLI
brew install sqlite3  # macOS
sudo apt-get install sqlite3  # Ubuntu

# Open database
sqlite3 social_media.db

# View tables
.tables

# Query posts
SELECT * FROM post_queue LIMIT 10;

# Exit
.quit
```

---

## 🧪 Test Posts

### Via cURL

```bash
# Login (get token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@cortex.local", "password": "test123"}'

# Copy token from response

# Create post
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 1,
    "content": "Test post from Cortex Platform",
    "platforms": ["twitter"],
    "mediaUrls": []
  }'

# Get all posts
curl http://localhost:5000/api/posts \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Via Dashboard

1. Open http://localhost:3000
2. Login with test credentials
3. Go to "Compose"
4. Write post
5. Select platforms
6. Click "Publish Now" or "Schedule Post"

---

## 🔧 Troubleshooting

### "Cannot connect to API"
- Verify backend is running: `npm run dev`
- Check port 5000 is available
- Try: `curl http://localhost:5000/api/health`

### "Database locked"
- Kill other node processes
- Delete `.db` file if corrupt
- Reinitialize: `npm run migrate`

### "Posts not publishing"
- Check API credentials in `.env`
- Verify rate limits haven't been exceeded
- Check logs: `npm run logs` (backend)

### "CORS errors"
- Ensure `FRONTEND_URL` is set correctly in `.env`
- Default is `http://localhost:3000`

---

## 📖 Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start with auto-reload
npm start            # Start production
npm run migrate      # Initialize database
npm run seed         # Add test data
npm run logs         # View logs

# Frontend
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Docker
docker-compose up -d         # Start all services
docker-compose logs -f api   # View backend logs
docker-compose restart       # Restart services
docker-compose down          # Stop all services
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Database initialized (`social_media.db` exists)
- [ ] Environment variables set in `.env`
- [ ] API health check passing
- [ ] Can login to dashboard
- [ ] Can compose and publish posts
- [ ] Analytics data appearing

---

## 🚀 Next Steps

1. Connect all social media accounts in "Accounts" tab
2. Create first automated post
3. Set up scheduling for regular updates
4. Monitor analytics on dashboard
5. Configure webhooks for bidirectional communication

---

**Setup complete! 🎉**
