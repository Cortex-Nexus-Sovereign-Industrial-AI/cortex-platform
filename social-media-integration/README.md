# 📱 Social Media Integration Module

**Autonomous social media posting across 8+ platforms**

---

## 🎯 Overview

The Social Media Integration Module provides unified posting, scheduling, and analytics across:
- **Twitter/X** — Real-time technical updates
- **LinkedIn** — Professional thought leadership
- **TikTok** — Dynamic platform demonstrations
- **Instagram** — Visual storytelling
- **YouTube** — Video metadata & automation
- **Medium** — Long-form technical articles
- **Telegram** — Community notifications
- **WhatsApp** — Direct customer engagement

---

## 🔧 Architecture

```
social-media-integration/
├── backend/                    # Node.js social media API
│   ├── server.js              # Express server + route handlers
│   ├── models/
│   │   ├── SocialAccount.js   # Platform credentials model
│   │   ├── PostQueue.js       # Scheduled posts model
│   │   └── Analytics.js       # Engagement metrics model
│   ├── controllers/
│   │   ├── twitterController.js
│   │   ├── linkedinController.js
│   │   ├── tiktokController.js
│   │   ├── instagramController.js
│   │   ├── youtubeController.js
│   │   ├── mediumController.js
│   │   ├── telegramController.js
│   │   └── whatsappController.js
│   ├── services/
│   │   ├── socialMediaService.js   # Unified API client
│   │   ├── mediaUploadService.js   # Image/video processing
│   │   ├── scheduleService.js      # Queue management
│   │   └── analyticsService.js     # Metrics aggregation
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication
│   │   ├── rateLimiter.js          # API rate limiting
│   │   └── errorHandler.js         # Global error handling
│   ├── webhooks/
│   │   ├── twitterWebhook.js       # Twitter mention notifications
│   │   └── telegramWebhook.js      # Telegram message handler
│   ├── package.json
│   ├── .env.example
│   └── server.js               # Express app entry point
│
├── frontend/                   # Vue.js admin dashboard
│   ├── components/
│   │   ├── PostComposer.vue       # Write & schedule posts
│   │   ├── AnalyticsDashboard.vue # Engagement metrics
│   │   ├── AccountManager.vue     # Platform credential config
│   │   └── QueueManager.vue       # View/edit scheduled posts
│   ├── pages/
│   │   ├── Dashboard.vue
│   │   ├── Scheduler.vue
│   │   └── Analytics.vue
│   ├── App.vue
│   ├── main.js
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   ├── schema.sql              # Database migrations
│   └── seeds.sql               # Initial test data
│
└── docs/
    ├── API_REFERENCE.md        # REST API docs
    ├── SETUP.md                # Installation & config
    └── EXAMPLES.md             # Code examples
```

---

## 🔑 Credentials Required

Obtain API keys/tokens from each platform:

| Platform | Type | Where to Get |
|----------|------|-------------|
| **Twitter** | Bearer Token (v2) | https://developer.twitter.com/en/portal/dashboard |
| **LinkedIn** | App Credentials + User Token | https://www.linkedin.com/developers/apps |
| **TikTok** | App ID + Secret | https://developers.tiktok.com/app |
| **Instagram** | Graph API Token | https://developers.facebook.com/apps |
| **YouTube** | API Key + OAuth2 | https://console.cloud.google.com |
| **Medium** | Integration Token | https://medium.com/me/settings/security |
| **Telegram** | Bot Token (BotFather) | https://t.me/botfather |
| **WhatsApp** | Business API Token | https://www.whatsapp.com/business/api |

---

## 📊 Database Schema

### `social_accounts`
```sql
CREATE TABLE social_accounts (
  id INTEGER PRIMARY KEY,
  platform TEXT NOT NULL (twitter, linkedin, tiktok, instagram, youtube, medium, telegram, whatsapp),
  account_name TEXT NOT NULL,
  credentials JSON NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(platform, account_name)
);
```

### `post_queue`
```sql
CREATE TABLE post_queue (
  id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  media_urls JSON,
  scheduled_at DATETIME,
  status TEXT DEFAULT 'draft' (draft, scheduled, posted, failed),
  posted_at DATETIME,
  platform_post_id TEXT,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(account_id) REFERENCES social_accounts(id)
);
```

### `analytics`
```sql
CREATE TABLE analytics (
  id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL,
  platform_post_id TEXT,
  content_preview TEXT,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0,
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(account_id) REFERENCES social_accounts(id)
);
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

```bash
# backend/.env
NODE_ENV=production
PORT=5000
DATABASE_URL=sqlite:./social_media.db
JWT_SECRET=your-secret-key-here

# Twitter
TWITTER_BEARER_TOKEN=your_token_here
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret

# LinkedIn
LINKEDIN_ACCESS_TOKEN=your_token_here
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

# TikTok
TIKTOK_APP_ID=your_app_id
TIKTOK_APP_SECRET=your_app_secret

# Instagram
INSTAGRAM_GRAPH_TOKEN=your_token_here
INSTAGRAM_PAGE_ID=your_page_id

# YouTube
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CHANNEL_ID=your_channel_id

# Medium
MEDIUM_INTEGRATION_TOKEN=your_token_here

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id

# WhatsApp
WHATSAPP_BUSINESS_TOKEN=your_token_here
WHATSAPP_PHONE_ID=your_phone_id
```

### 3. Initialize Database

```bash
npm run migrate
```

### 4. Start Server

```bash
npm run dev      # Development with nodemon
npm start        # Production
```

### 5. Access Dashboard

```
Frontend: http://localhost:3000
API: http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` — Get JWT token
- `POST /api/auth/logout` — Revoke token

### Account Management
- `GET /api/accounts` — List connected accounts
- `POST /api/accounts` — Add new platform account
- `PUT /api/accounts/:id` — Update account credentials
- `DELETE /api/accounts/:id` — Disconnect account

### Post Management
- `GET /api/posts` — List all scheduled posts
- `POST /api/posts` — Create new post
- `PUT /api/posts/:id` — Edit draft post
- `DELETE /api/posts/:id` — Delete post
- `POST /api/posts/:id/publish` — Publish immediately
- `POST /api/posts/:id/schedule` — Schedule for later

### Media
- `POST /api/media/upload` — Upload image/video
- `POST /api/media/process` — Compress & optimize

### Analytics
- `GET /api/analytics/summary` — Overall engagement metrics
- `GET /api/analytics/by-platform` — Per-platform breakdown
- `GET /api/analytics/posts/:id` — Single post analytics

### Webhooks
- `POST /api/webhooks/twitter` — Twitter mention notifications
- `POST /api/webhooks/telegram` — Telegram message handler

---

## 🎬 Example: Posting to Twitter

```javascript
// backend/controllers/twitterController.js
const TwitterApi = require('twitter-api-v2').default;

class TwitterController {
  async tweet(req, res) {
    const { content, mediaUrls, scheduleTime } = req.body;
    
    try {
      // If scheduled, save to queue
      if (scheduleTime) {
        const post = await PostQueue.create({
          accountId: req.user.twitterAccountId,
          content,
          mediaUrls,
          scheduledAt: scheduleTime,
          status: 'scheduled'
        });
        return res.json({ message: 'Post scheduled', post });
      }
      
      // Post immediately
      const client = new TwitterApi({ bearerToken: process.env.TWITTER_BEARER_TOKEN });
      const rwClient = client.readWrite;
      
      const response = await rwClient.v2.tweet({
        text: content,
        // media handling if mediaUrls provided
      });
      
      await PostQueue.create({
        accountId: req.user.twitterAccountId,
        content,
        status: 'posted',
        platformPostId: response.data.id,
        postedAt: new Date()
      });
      
      res.json({ success: true, tweetId: response.data.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

---

## 📅 Automation Examples

### Auto-Post Daily Updates

```javascript
// Schedule daily at 9 AM
const schedule = require('node-schedule');

schedule.scheduleJob('0 9 * * *', async () => {
  const post = {
    content: `🚀 Platform Update: ${new Date().toLocaleDateString()}\n\nCINIS NEXUS running smoothly with X transactions today!`,
    mediaUrls: ['/assets/daily-stats.png'],
    platforms: ['twitter', 'linkedin', 'telegram']
  };
  
  await socialMediaService.postToAll(post);
});
```

### Auto-Post New Blog Articles

```javascript
// Listen for new Medium articles, republish to other platforms
app.post('/api/webhooks/medium', (req, res) => {
  const article = req.body;
  
  socialMediaService.postToAll({
    content: `📚 New article: ${article.title}\n\n${article.excerpt}\n\nRead more: ${article.url}`,
    mediaUrls: [article.coverImage],
    platforms: ['twitter', 'linkedin']
  });
  
  res.json({ success: true });
});
```

---

## 🔒 Security Best Practices

1. **Never commit credentials** — Use .env files
2. **Rotate tokens regularly** — Update API keys every 90 days
3. **Rate limit requests** — Built-in rate limiter included
4. **Validate webhooks** — Verify signatures from platforms
5. **Audit logging** — All posts logged with timestamps
6. **HTTPS only** — Enforce in production

---

## 📊 Dashboard Features

### Post Composer
- Rich text editor with emoji support
- Image/video upload with compression
- Schedule picker with timezone support
- Multi-platform selector
- Character counter with platform-specific limits

### Analytics Dashboard
- Real-time engagement metrics
- Per-platform breakdown
- Best-performing post types
- Audience insights (demographics, locations)
- Trend analysis (hashtags, keywords)

### Account Manager
- Add/remove platform accounts
- Update API credentials
- Monitor rate limits
- Test API connections

### Queue Manager
- View all scheduled posts
- Edit/reschedule drafts
- Bulk publish/delete
- Filter by platform/date

---

## 🔧 Troubleshooting

**Posts not posting?**
- Check API credentials in .env
- Verify account is connected in dashboard
- Check rate limits — wait 15 minutes
- Review error logs in `npm run logs`

**Media not uploading?**
- File must be <100MB
- Supported: JPG, PNG, MP4, MOV
- Check S3/file storage permissions

**Analytics not updating?**
- Wait 5-10 minutes for data to sync
- Verify API token has analytics permissions
- Manual refresh: `POST /api/analytics/sync`

---

## 📚 Documentation

- **API Reference** → `docs/API_REFERENCE.md`
- **Setup Guide** → `docs/SETUP.md`
- **Code Examples** → `docs/EXAMPLES.md`

---

## 🎯 Next Steps

1. Deploy backend to Render/Railway
2. Deploy frontend to Vercel/Netlify
3. Connect all social media accounts
4. Set up automation rules
5. Configure webhooks for bidirectional communication
6. Monitor analytics and optimize content

---

**Built with 💚 for CINIS NEXUS INDUSTRY OGOJA**
