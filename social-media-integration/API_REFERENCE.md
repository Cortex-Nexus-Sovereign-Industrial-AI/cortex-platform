# API Reference

**Complete REST API documentation**

---

## 🔐 Authentication

All endpoints (except `/health`) require Bearer token in `Authorization` header.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

---

## 📱 Posts Endpoints

### List All Posts

```http
GET /api/posts
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "account_id": 1,
    "content": "Hello World",
    "status": "posted",
    "platform": "twitter",
    "posted_at": "2026-07-18T08:00:00Z"
  }
]
```

### Create Post

```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId": 1,
  "content": "Check out our new platform!",
  "mediaUrls": ["https://example.com/image.jpg"],
  "scheduledAt": "2026-07-18T10:00:00Z"
}
```

**Response (201):**
```json
{
  "id": 123,
  "status": "scheduled",
  "message": "Post scheduled"
}
```

### Publish Post

```http
POST /api/posts/:id/publish
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "platform": "twitter",
  "postId": "1234567890",
  "url": "https://twitter.com/user/status/1234567890"
}
```

### Delete Post

```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post deleted"
}
```

---

## 💾 Account Endpoints

### List Accounts

```http
GET /api/accounts
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "platform": "twitter",
    "account_name": "@mikecomplexai",
    "is_active": true
  }
]
```

### Add Account

```http
POST /api/accounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "twitter",
  "account_name": "@myhandle",
  "credentials": {
    "access_token": "...",
    "access_secret": "..."
  }
}
```

### Delete Account

```http
DELETE /api/accounts/:id
Authorization: Bearer <token>
```

---

## 📊 Analytics Endpoints

### Get Summary

```http
GET /api/analytics/summary
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "total_posts": 45,
  "total_engagement": 1250,
  "average_engagement_rate": 0.38,
  "platforms": {
    "twitter": {
      "posts": 30,
      "engagement": 900
    },
    "linkedin": {
      "posts": 15,
      "engagement": 350
    }
  }
}
```

### Get Per-Platform Stats

```http
GET /api/analytics/by-platform?platform=twitter
Authorization: Bearer <token>
```

### Get Post Analytics

```http
GET /api/analytics/posts/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "likes": 250,
  "shares": 45,
  "comments": 30,
  "impressions": 2500,
  "engagement_rate": 0.12,
  "fetched_at": "2026-07-18T08:30:00Z"
}
```

---

## 🎯 Media Endpoints

### Upload Media

```http
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file=<binary>
```

**Response (200):**
```json
{
  "url": "https://cdn.cortex.platform/uploads/abc123.jpg",
  "size": 245678,
  "mime_type": "image/jpeg"
}
```

---

## 🪝 Webhook Endpoints

### Twitter Mentions Webhook

```http
POST /api/webhooks/twitter
Content-Type: application/json

{
  "for_user_id": "...",
  "data": [...]
}
```

### Telegram Updates Webhook

```http
POST /api/webhooks/telegram
Content-Type: application/json

{
  "update_id": 123456,
  "message": {
    "from": {...},
    "text": "Hello!"
  }
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Content is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "timestamp": "2026-07-18T08:00:00Z"
}
```

---

**Base URL:** `http://localhost:5000` (development)

**Production:** `https://api.cortex-platform.com`
