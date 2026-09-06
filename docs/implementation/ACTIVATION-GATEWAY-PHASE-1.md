# CINIS Activation Gateway — Implementation Roadmap

## Current State vs. Target State

### Current State
```
Physical QR (CINIS-OGOJA-01)
   ↓
Messenger / @cortexHrbot
   └─ Single communication channel
```

### Target State
```
Physical QR (CINIS-OGOJA-01)
   ↓
/a/CINIS-OGOJA-01
   ↓
CINIS Activation Gateway (Netlify Function)
   ├─ Validate activation code
   ├─ Register scan event
   ├─ Identify campaign/site
   └─ Create anonymous session
   ↓
Multi-Path Welcome Dashboard
   ├─ [YouTube Education Track] → Zero to Advanced learning pathway
   ├─ [Activate Cortex] → Onboarding → Identity → Session → Platform
   ├─ [Message HRbot] → Messenger integration
   └─ [Explore Platform] → Marketing / Feature discovery
   ↓
CORTEX INTELLIGENCE NEXUS
```

**Key Advantage:** Single QR → Multiple functions, all server-routable, no reprinting needed.

---

## Implementation Phase 1: Activation Gateway Foundation

### Objective
Make `/a/CINIS-OGOJA-01` return a functional activation gateway that validates the code, records telemetry, presents a welcome dashboard, and seamlessly integrates YouTube educational content as the primary onboarding pathway for users progressing from zero level to advanced.

### Acceptance Criteria

- [ ] `GET /a/:code` endpoint exists and is reachable
- [ ] Activation code validation works (code exists in registry, not revoked)
- [ ] Scan event is recorded to audit log
- [ ] Anonymous session is created
- [ ] Welcome dashboard UI renders without errors
- [ ] YouTube integration loads featured playlists and video progression tracks
- [ ] All four paths (YouTube Education, Cortex, Messenger, Explore) are clickable and logged
- [ ] Video playback is tracked (play, pause, complete, engagement)
- [ ] Educational progression metadata is stored
- [ ] 5xx errors are caught and logged with full context

### Netlify Function Structure

```
netlify/functions/
├── activation-gateway.js          (Main entry point)
├── youtube-handler.js             (YouTube API integration)
├── lib/
│   ├── activation-service.js     (Code validation, registry)
│   ├── event-service.js          (Scan event recording)
│   ├── session-service.js        (Anonymous session creation)
│   ├── youtube-service.js        (YouTube playlist fetching)
│   ├── education-service.js      (Learning progression tracking)
│   └── error-handler.js          (Consistent error responses)
└── views/
    ├── welcome-dashboard.html    (Multi-path UI with video)
    └── video-player.html         (Embedded YouTube player)
```

### Database Requirements

Create activation code registry:

```sql
CREATE TABLE activation_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  campaign_id VARCHAR(50),
  site_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  metadata JSONB
);

-- Insert CINIS-OGOJA-01
INSERT INTO activation_codes (code, campaign_id, site_id, status)
VALUES ('CINIS-OGOJA-01', 'physical-activation', 'CINIS-STUDIO', 'active');
```

Create scan event log:

```sql
CREATE TABLE scan_events (
  id BIGSERIAL PRIMARY KEY,
  activation_code_id INT REFERENCES activation_codes(id),
  session_id VARCHAR(255) UNIQUE,
  timestamp TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  device_type VARCHAR(50),
  metadata JSONB
);
```

Create education progression tracking:

```sql
CREATE TABLE education_progression (
  id BIGSERIAL PRIMARY KEY,
  session_id VARCHAR(255),
  user_level VARCHAR(50),
  starting_level VARCHAR(50),
  current_level VARCHAR(50),
  videos_watched INT DEFAULT 0,
  videos_completed INT DEFAULT 0,
  playlists_started INT DEFAULT 0,
  playlists_completed INT DEFAULT 0,
  total_watch_time_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

Create video engagement tracking:

```sql
CREATE TABLE video_engagement (
  id BIGSERIAL PRIMARY KEY,
  session_id VARCHAR(255),
  youtube_video_id VARCHAR(50),
  video_title VARCHAR(255),
  playlist_id VARCHAR(50),
  playlist_title VARCHAR(255),
  action VARCHAR(50),
  watch_time_seconds INT,
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE youtube_playlists (
  id SERIAL PRIMARY KEY,
  playlist_id VARCHAR(50) UNIQUE,
  playlist_title VARCHAR(255),
  description TEXT,
  level VARCHAR(50),
  sequence_order INT,
  video_count INT,
  total_duration_seconds INT,
  synced_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE youtube_videos (
  id SERIAL PRIMARY KEY,
  video_id VARCHAR(50) UNIQUE,
  video_title VARCHAR(255),
  playlist_id INT REFERENCES youtube_playlists(id),
  sequence_in_playlist INT,
  duration_seconds INT,
  thumbnail_url TEXT,
  synced_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

---

## YouTube Integration: Educational Progression Model

### Channel: @MikecomplexAI-i2e
**URL:** https://www.youtube.com/@MikecomplexAI-i2e

### Learning Levels (Zero → Advanced)

| Level | Name | Example Topics |
|-------|------|-----------------|
| **L0** | Introduction | What is Cortex? Channel overview |
| **L1** | Foundations | Core concepts, architecture basics |
| **L2** | Intermediate | Building first workflows, API usage |
| **L3** | Advanced | Production deployment, optimization |
| **L4** | Expert | Monetization, enterprise features |
| **L5** | Master | Diplomatic automation, AI agents |

### YouTube API Integration

**File: `netlify/functions/lib/youtube-service.js`**

```javascript
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCxxxxxxxxxxxxxx'; // @MikecomplexAI-i2e

export async function getChannelPlaylists() {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
      params: {
        part: 'snippet,contentDetails',
        channelId: CHANNEL_ID,
        maxResults: 50,
        key: YOUTUBE_API_KEY
      }
    });

    return response.data.items.map(item => ({
      playlistId: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      videoCount: item.contentDetails.itemCount
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
}

export async function getPlaylistVideos(playlistId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 50,
        key: YOUTUBE_API_KEY
      }
    });

    return response.data.items.map(item => ({
      videoId: item.contentDetails.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      position: item.snippet.position
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
}

export async function getVideoDetails(videoId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });

    const video = response.data.items[0];
    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      commentCount: video.statistics.commentCount
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
}

// Get featured videos (public uploads)
export async function getFeaturedVideos(maxResults = 20) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: CHANNEL_ID,
        order: 'date',
        type: 'video',
        maxResults: maxResults,
        key: YOUTUBE_API_KEY
      }
    });

    return response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.default.url
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
}
```

### Education Service

**File: `netlify/functions/lib/education-service.js`**

```javascript
import { pool } from './db';

export async function createProgressionRecord(sessionId, startingLevel = 'L0') {
  const result = await pool.query(
    `INSERT INTO education_progression 
     (session_id, starting_level, current_level, user_level)
     VALUES ($1, $2, $3, $3)
     RETURNING id, user_level, starting_level, current_level`,
    [sessionId, startingLevel, startingLevel]
  );
  return result.rows[0];
}

export async function trackVideoEngagement(sessionId, videoData) {
  const result = await pool.query(
    `INSERT INTO video_engagement 
     (session_id, youtube_video_id, video_title, playlist_id, playlist_title, action, watch_time_seconds, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      sessionId,
      videoData.videoId,
      videoData.title,
      videoData.playlistId,
      videoData.playlistTitle,
      videoData.action, // 'play', 'pause', 'complete', 'skip'
      videoData.watchTimeSeconds || 0,
      JSON.stringify(videoData.metadata || {})
    ]
  );
  return result.rows[0];
}

export async function updateProgressionMetrics(sessionId, updates) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  });

  values.push(sessionId);

  const result = await pool.query(
    `UPDATE education_progression 
     SET ${fields.join(', ')}, last_updated = NOW()
     WHERE session_id = $${paramIndex}
     RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function getProgressionReport(sessionId) {
  const result = await pool.query(
    `SELECT 
       ep.*,
       COUNT(DISTINCT ve.youtube_video_id) as unique_videos_viewed,
       SUM(ve.watch_time_seconds) as total_watch_time
     FROM education_progression ep
     LEFT JOIN video_engagement ve ON ep.session_id = ve.session_id
     WHERE ep.session_id = $1
     GROUP BY ep.id`,
    [sessionId]
  );
  return result.rows[0];
}
```

---

## Netlify Function Implementation

**File: `netlify/functions/activation-gateway.js`**

```javascript
import * as activationService from './lib/activation-service';
import * as eventService from './lib/event-service';
import * as sessionService from './lib/session-service';
import * as youtubeService from './lib/youtube-service';
import * as educationService from './lib/education-service';
import { errorHandler } from './lib/error-handler';
import welcomeDashboard from './views/welcome-dashboard.html';

export const handler = async (event, context) => {
  try {
    // Extract activation code from URL
    const { code } = event.queryStringParameters || {};

    if (!code) {
      return errorHandler.badRequest('Activation code required');
    }

    // 1. Validate activation code
    const activationRecord = await activationService.getByCode(code);
    if (!activationRecord) {
      return errorHandler.notFound('Activation code not found');
    }

    if (activationRecord.status !== 'active') {
      return errorHandler.forbidden('Activation code is not active');
    }

    // 2. Create anonymous session
    const sessionId = await sessionService.createAnonymousSession();

    // 3. Create education progression record
    await educationService.createProgressionRecord(sessionId, 'L0');

    // 4. Record scan event
    await eventService.recordScan({
      activation_code_id: activationRecord.id,
      session_id: sessionId,
      user_agent: event.headers['user-agent'],
      referrer: event.headers.referer,
      ip_address: event.headers['client-ip'],
      device_type: detectDeviceType(event.headers['user-agent']),
      metadata: {
        campaign: activationRecord.campaign_id,
        site: activationRecord.site_id,
        timestamp: new Date().toISOString()
      }
    });

    // 5. Fetch YouTube content (featured videos + playlists)
    let youtubeContent = {};
    try {
      youtubeContent.featuredVideos = await youtubeService.getFeaturedVideos(10);
      youtubeContent.playlists = await youtubeService.getChannelPlaylists();
    } catch (error) {
      console.warn('YouTube integration warning:', error.message);
      youtubeContent.error = 'Could not load YouTube content';
      // Don't fail the entire request if YouTube is down
    }

    // 6. Render welcome dashboard with video content
    const html = welcomeDashboard
      .replace('{{ACTIVATION_CODE}}', code)
      .replace('{{SESSION_ID}}', sessionId)
      .replace('{{CAMPAIGN}}', activationRecord.campaign_id)
      .replace('{{SITE}}', activationRecord.site_id)
      .replace('{{FEATURED_VIDEOS_JSON}}', JSON.stringify(youtubeContent.featuredVideos || []))
      .replace('{{PLAYLISTS_JSON}}', JSON.stringify(youtubeContent.playlists || []));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': `cinis_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
      },
      body: html
    };
  } catch (error) {
    console.error('Activation gateway error:', error);
    return errorHandler.internalError(error);
  }
};

function detectDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}
```

---

## Welcome Dashboard with YouTube Integration

**File: `netlify/functions/views/welcome-dashboard.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CINIS Activation — Cortex Intelligence Nexus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        .header {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            margin-bottom: 8px;
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .badge {
            display: inline-block;
            background: #e8f5e9;
            color: #2e7d32;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .message {
            background: #f5f5f5;
            border-left: 4px solid #667eea;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
            color: #555;
            font-size: 14px;
        }
        .main-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-4px);
        }
        .card-header {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
        }
        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }
        .card-description {
            font-size: 13px;
            color: #666;
        }
        .card-body {
            padding: 20px;
        }
        .button {
            display: block;
            width: 100%;
            padding: 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
            text-align: center;
        }
        .button-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .button-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .button-secondary {
            background: #f0f0f0;
            color: #333;
            border: 2px solid #e0e0e0;
            margin-top: 8px;
        }
        .button-secondary:hover {
            background: #e8e8e8;
        }
        .video-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
            margin-top: 16px;
        }
        .video-card {
            background: #f5f5f5;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .video-card:hover {
            transform: scale(1.05);
        }
        .video-thumbnail {
            width: 100%;
            height: 140px;
            background: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
        }
        .video-info {
            padding: 12px;
            font-size: 12px;
            color: #666;
        }
        .video-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .level-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-top: 8px;
        }
        .level-l0 { background: #e3f2fd; color: #1976d2; }
        .level-l1 { background: #f3e5f5; color: #7b1fa2; }
        .level-l2 { background: #e8f5e9; color: #388e3c; }
        .level-l3 { background: #fff3e0; color: #f57c00; }
        .level-l4 { background: #fce4ec; color: #c2185b; }
        .level-l5 { background: #e0f2f1; color: #00796b; }
        .footer {
            background: white;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .code-display {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 4px;
            font-family: monospace;
            color: #666;
            word-break: break-all;
        }
        .loading {
            display: none;
            text-align: center;
        }
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .tabs {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            border-bottom: 2px solid #f0f0f0;
        }
        .tab {
            padding: 12px 16px;
            cursor: pointer;
            border: none;
            background: none;
            font-weight: 600;
            color: #999;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
        }
        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        @media (max-width: 768px) {
            .main-grid {
                grid-template-columns: 1fr;
            }
            h1 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🌐</div>
            <h1>Welcome to Cortex</h1>
            <p class="subtitle">Intelligence Nexus — Industrial AI & Automation</p>
            <div class="badge">✓ Verified Activation</div>
            <div class="message">
                You arrived through a validated CINIS activation point.
                <br><br>
                <strong>Campaign:</strong> {{CAMPAIGN}} | <strong>Site:</strong> {{SITE}}
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="main-grid">
            <!-- YouTube Education Track -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">📚 Learn from Zero to Master</div>
                    <div class="card-description">Complete educational pathway on Cortex platform</div>
                </div>
                <div class="card-body">
                    <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                        Start from foundational concepts and progress through intermediate to advanced topics. All content is monetized and ready for enterprise adoption.
                    </p>
                    
                    <div class="tabs">
                        <button class="tab active" onclick="switchTab('featured')">Featured</button>
                        <button class="tab" onclick="switchTab('playlists')">Playlists</button>
                    </div>

                    <!-- Featured Videos Tab -->
                    <div id="featured" class="tab-content active">
                        <div class="video-grid" id="featured-videos">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p style="margin-top: 12px; color: #666;">Loading videos...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Playlists Tab -->
                    <div id="playlists" class="tab-content">
                        <div class="video-grid" id="playlists-grid">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p style="margin-top: 12px; color: #666;">Loading playlists...</p>
                            </div>
                        </div>
                    </div>

                    <a href="https://www.youtube.com/@MikecomplexAI-i2e/videos" 
                       class="button button-primary"
                       onclick="trackAction('youtube-education')">
                        ▶️ Watch Full Channel
                    </a>
                    <a href="/activate/onboarding?code={{ACTIVATION_CODE}}&session={{SESSION_ID}}&entry=youtube" 
                       class="button button-secondary"
                       onclick="trackAction('activate-from-youtube')">
                        Continue to Cortex Platform
                    </a>
                </div>
            </div>

            <!-- Cortex Platform Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">🚀 Activate Cortex</div>
                    <div class="card-description">Join the intelligence network immediately</div>
                </div>
                <div class="card-body">
                    <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                        Skip straight to Cortex platform activation. Complete your identity, set up your profile, and access agents, AI services, voice interface, and directory.
                    </p>
                    
                    <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; margin: 12px 0; font-size: 12px; color: #666;">
                        <strong>Quick paths:</strong>
                        <ul style="margin-left: 16px; margin-top: 8px;">
                            <li>Explore → Browse agents & services</li>
                            <li>Join Network → Create identity</li>
                            <li>Developer → API access & SDK</li>
                        </ul>
                    </div>

                    <a href="/activate/onboarding?code={{ACTIVATION_CODE}}&session={{SESSION_ID}}" 
                       class="button button-primary"
                       onclick="trackAction('activate-cortex')">
                        → Start Onboarding
                    </a>
                </div>
            </div>
        </div>

        <!-- Secondary Actions -->
        <div class="main-grid">
            <!-- Messenger Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">💬 Message HRbot</div>
                    <div class="card-description">Direct communication channel</div>
                </div>
                <div class="card-body">
                    <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                        Connect with @cortexHrbot on Messenger for support, questions, or human assistance.
                    </p>
                    <a href="https://www.messenger.com/t/cortexHrbot" 
                       class="button button-primary"
                       onclick="trackAction('message-hrbot')">
                        💬 Open Messenger
                    </a>
                </div>
            </div>

            <!-- Explore Platform Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">🔍 Explore Platform</div>
                    <div class="card-description">Feature discovery & documentation</div>
                </div>
                <div class="card-body">
                    <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
                        Learn about Cortex capabilities: AI agents, voice interface, workflow automation, industrial control, and enterprise services.
                    </p>
                    <a href="/explore" 
                       class="button button-primary"
                       onclick="trackAction('explore-platform')">
                        🔍 Explore Features
                    </a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="code-display">{{ACTIVATION_CODE}}</div>
            Session: {{SESSION_ID}}
        </div>
    </div>

    <script>
        // Load YouTube content data
        const featuredVideos = {{FEATURED_VIDEOS_JSON}};
        const playlists = {{PLAYLISTS_JSON}};

        function renderFeaturedVideos() {
            const container = document.getElementById('featured-videos');
            if (!featuredVideos || featuredVideos.length === 0) {
                container.innerHTML = '<p style="color: #999;">No featured videos available</p>';
                return;
            }

            container.innerHTML = featuredVideos.map(video => `
                <div class="video-card" onclick="trackVideoClick('${video.videoId}', '${video.title}')">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" style="width: 100%; height: 100%; object-fit: cover;" alt="${video.title}">
                    </div>
                    <div class="video-info">
                        <div class="video-title" title="${video.title}">${video.title}</div>
                        <div class="level-badge level-l0">Introductory</div>
                    </div>
                </div>
            `).join('');
        }

        function renderPlaylists() {
            const container = document.getElementById('playlists-grid');
            if (!playlists || playlists.length === 0) {
                container.innerHTML = '<p style="color: #999;">No playlists available</p>';
                return;
            }

            container.innerHTML = playlists.map(playlist => `
                <div class="video-card" onclick="trackPlaylistClick('${playlist.playlistId}', '${playlist.title}')">
                    <div class="video-thumbnail" style="font-size: 24px;">
                        📺
                    </div>
                    <div class="video-info">
                        <div class="video-title" title="${playlist.title}">${playlist.title}</div>
                        <div style="font-size: 11px; color: #999;">
                            ${playlist.videoCount} videos
                        </div>
                        <div class="level-badge level-l1">Learning Path</div>
                    </div>
                </div>
            `).join('');
        }

        function switchTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));

            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');

            trackAction(`tab-switched-${tabName}`);
        }

        async function trackAction(action) {
            try {
                await fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'ACTIVATION_PATH_SELECTED',
                        path: action,
                        activation_code: '{{ACTIVATION_CODE}}',
                        session_id: '{{SESSION_ID}}',
                        timestamp: new Date().toISOString()
                    })
                }).catch(err => console.error('Event log failed:', err));
            } catch (error) {
                console.error('Track action error:', error);
            }
        }

        function trackVideoClick(videoId, title) {
            trackAction(`video-clicked-${videoId}`);
            window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
        }

        function trackPlaylistClick(playlistId, title) {
            trackAction(`playlist-clicked-${playlistId}`);
            window.open(`https://youtube.com/playlist?list=${playlistId}`, '_blank');
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            renderFeaturedVideos();
            renderPlaylists();

            // Log page view
            fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'ACTIVATION_DASHBOARD_VIEWED',
                    activation_code: '{{ACTIVATION_CODE}}',
                    session_id: '{{SESSION_ID}}',
                    timestamp: new Date().toISOString()
                })
            }).catch(err => console.error('Event log failed:', err));
        });
    </script>
</body>
</html>
```

---

## Video Analytics & Monetization Tracking

**File: `netlify/functions/youtube-video-analytics.js`**

```javascript
import * as educationService from './lib/education-service';

export const handler = async (event, context) => {
  try {
    const { sessionId, videoId, action, watchTimeSeconds } = JSON.parse(event.body);

    // Track video engagement
    const engagement = await educationService.trackVideoEngagement(sessionId, {
      videoId,
      action, // 'play', 'pause', 'complete', 'skip'
      watchTimeSeconds,
      metadata: {
        timestamp: new Date().toISOString(),
        deviceType: event.headers['user-agent']
      }
    });

    // Update progression metrics
    if (action === 'complete') {
      await educationService.updateProgressionMetrics(sessionId, {
        videos_completed: `videos_completed + 1`,
        total_watch_time_seconds: `total_watch_time_seconds + ${watchTimeSeconds}`
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        engagement_id: engagement.id
      })
    };
  } catch (error) {
    console.error('Video analytics error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

---

## Implementation Tasks

### Task 1: Database Setup
- [ ] Create `activation_codes` table
- [ ] Create `scan_events` table
- [ ] Create `education_progression` table
- [ ] Create `video_engagement` table
- [ ] Create `youtube_playlists` table
- [ ] Create `youtube_videos` table
- [ ] Create indexes for performance
- [ ] Set up connection pooling

### Task 2: YouTube API Configuration
- [ ] Create YouTube API project in Google Cloud Console
- [ ] Generate API key for channel data access
- [ ] Add API key to Netlify environment variables
- [ ] Test channel ID: @MikecomplexAI-i2e
- [ ] Sync featured videos (manual or automated)
- [ ] Sync playlists (manual or automated)

### Task 3: Netlify Functions Core
- [ ] Implement `activation-gateway.js` entry point
- [ ] Implement `activation-service.js` (code lookup)
- [ ] Implement `youtube-service.js` (YouTube API)
- [ ] Implement `education-service.js` (progression tracking)
- [ ] Implement `event-service.js` (scan recording)
- [ ] Implement `session-service.js` (session creation)
- [ ] Implement `error-handler.js` (consistent errors)

### Task 4: Welcome Dashboard UI
- [ ] Create `welcome-dashboard.html` with video integration
- [ ] Style featured videos grid
- [ ] Style playlists grid
- [ ] Implement tab switching (Featured/Playlists)
- [ ] Add responsive design for mobile/tablet/desktop
- [ ] Implement video click tracking
- [ ] Test accessibility (ARIA, keyboard navigation)

### Task 5: Video Analytics
- [ ] Create `youtube-video-analytics.js` endpoint
- [ ] Track play/pause/complete/skip events
- [ ] Track watch time per video
- [ ] Generate engagement reports
- [ ] Export data for monetization tracking

### Task 6: Education Progression Reporting
- [ ] Create progression report endpoint
- [ ] Generate learning level assignments
- [ ] Track educational journey (L0 → L5)
- [ ] Create user progression dashboard
- [ ] Export data for instructor/admin review

### Task 7: Testing & Validation
- [ ] Test `/a/CINIS-OGOJA-01` endpoint
- [ ] Verify YouTube content loads
- [ ] Verify scan events recorded
- [ ] Verify session creation
- [ ] Test all four main paths
- [ ] Video click tracking
- [ ] Load test: 500 concurrent users
- [ ] Error handling: YouTube API down, invalid codes

### Task 8: Monetization & Tracking
- [ ] Connect Google AdSense to YouTube channel
- [ ] Track viewer engagement metrics
- [ ] Generate revenue reports
- [ ] Identify top-performing videos
- [ ] Create monetization dashboard
- [ ] Export analytics for enterprise clients

---

## Success Metrics (Phase 1)

✅ **Functional Activation Gateway**
- [ ] `/a/CINIS-OGOJA-01` returns 200 status
- [ ] YouTube featured videos load within 3 seconds
- [ ] Playlists display correctly
- [ ] Scan events recorded to database
- [ ] Sessions created with tracking
- [ ] All four primary paths functional

✅ **User Experience**
- [ ] Page loads in < 2 seconds
- [ ] Videos display with thumbnails
- [ ] Tab switching smooth and responsive
- [ ] Mobile/tablet responsive layout
- [ ] No console errors
- [ ] Accessible keyboard navigation

✅ **Educational Content Integration**
- [ ] Featured videos populate from YouTube
- [ ] Playlists load and display
- [ ] Video titles and descriptions visible
- [ ] Progression L0-L5 tracked
- [ ] Watch time metrics collected
- [ ] Monetization data available

✅ **Telemetry**
- [ ] Each scan tracked with timestamp, device, referrer
- [ ] Each button click logged
- [ ] Video views/engagements tracked
- [ ] Educational progression stored
- [ ] Queryable analytics available

---

## Next Phase: Onboarding + Cortex Integration (Phase 2)

Once Phase 1 complete:

1. **Implement `/activate/onboarding`** 
   - Multi-step form with YouTube pre-roll
   - Purpose → Identity → Sector → Verification
   - Educational checkpoint reminders

2. **Implement Identity Service**
   - CINIS-ID generation
   - OTP/Passkey authentication
   - Learning level assignment based on videos viewed

3. **Implement Session Management**
   - Short-lived session tokens
   - Server-side auth state
   - Progression tracking

4. **Connect to Cortex**
   - Bootstrap API
   - Capability-gated access
   - AI/Voice/Directory

5. **Monetization Integration**
   - YouTube revenue tracking
   - Enterprise licensing
   - Platform fee structures

---

## Deployment Checklist

- [ ] All function code committed
- [ ] Database migrations merged
- [ ] Environment variables set (YOUTUBE_API_KEY, DB_URL)
- [ ] Netlify build succeeds
- [ ] CORS headers configured
- [ ] Rate limiting enabled (10 scans/min per IP)
- [ ] Error logging configured
- [ ] YouTube API quota monitored
- [ ] Staging deployment tested end-to-end
- [ ] Production rollback plan ready

---

## Environment Variables Required

```
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@host:5432/cortex
REDIS_URL=redis://host:6379
JWT_SECRET=your_jwt_secret_here
ENVIRONMENT=production
```

---

## References

- YouTube Channel: https://www.youtube.com/@MikecomplexAI-i2e/videos
- Featured Content: https://www.youtube.com/@MikecomplexAI-i2e/featured
- CINIS-PHYSICAL-ACTIVATION.md — Full architecture
- cortex-platform repository — Netlify Functions setup
- Activation Code: CINIS-OGOJA-01

---

**Document Version:** 2.0 (with YouTube Integration)  
**Last Updated:** 2026-09-06  
**Status:** Ready for Implementation  
**Priority:** Phase 1 MVP  
**Monetization:** Ready for AdSense + Enterprise Revenue Tracking
