// netlify/functions/activation-gateway.js
// CINIS Activation Gateway
// Entry point: /a/:code

import * as activationService from './lib/activation-service.js';
import * as eventService from './lib/event-service.js';
import * as sessionService from './lib/session-service.js';
import * as youtubeService from './lib/youtube-service.js';
import * as educationService from './lib/education-service.js';
import { errorHandler } from './lib/error-handler.js';
import welcomeDashboard from './views/welcome-dashboard.html';

export const handler = async (event, context) => {
  try {
    // Extract activation code from URL path
    const pathMatch = event.path.match(/\/a\/([A-Z0-9\-]+)/);
    const code = pathMatch ? pathMatch[1] : null;

    if (!code) {
      return errorHandler.badRequest('Activation code required');
    }

    console.log(`[ACTIVATION] Processing code: ${code}`);

    // 1. Validate activation code
    const activationRecord = await activationService.getByCode(code);
    if (!activationRecord) {
      console.warn(`[ACTIVATION] Code not found: ${code}`);
      return errorHandler.notFound('Activation code not found');
    }

    if (activationRecord.status !== 'active') {
      console.warn(`[ACTIVATION] Code inactive: ${code}, status: ${activationRecord.status}`);
      return errorHandler.forbidden('Activation code is not active');
    }

    // 2. Create anonymous session
    const sessionId = await sessionService.createAnonymousSession();
    console.log(`[ACTIVATION] Session created: ${sessionId}`);

    // 3. Create education progression record
    await educationService.createProgressionRecord(sessionId, 'L0');
    console.log(`[ACTIVATION] Education progression started for: ${sessionId}`);

    // 4. Record scan event
    await eventService.recordScan({
      activation_code_id: activationRecord.id,
      session_id: sessionId,
      user_agent: event.headers['user-agent'] || '',
      referrer: event.headers.referer || '',
      ip_address: event.headers['client-ip'] || event.headers['x-forwarded-for'] || '',
      device_type: detectDeviceType(event.headers['user-agent'] || ''),
      metadata: {
        campaign: activationRecord.campaign_id,
        site: activationRecord.site_id,
        timestamp: new Date().toISOString()
      }
    });
    console.log(`[ACTIVATION] Scan event recorded for: ${code}`);

    // 5. Fetch YouTube content (featured videos + playlists)
    let youtubeContent = {
      featuredVideos: [],
      playlists: []
    };
    try {
      youtubeContent.featuredVideos = await youtubeService.getFeaturedVideos(10);
      youtubeContent.playlists = await youtubeService.getChannelPlaylists();
      console.log(`[ACTIVATION] YouTube content loaded: ${youtubeContent.featuredVideos.length} videos, ${youtubeContent.playlists.length} playlists`);
    } catch (error) {
      console.warn('[ACTIVATION] YouTube integration warning:', error.message);
      youtubeContent.error = 'Could not load YouTube content';
    }

    // 6. Render welcome dashboard with video content
    let html = welcomeDashboard
      .replace('{{ACTIVATION_CODE}}', code)
      .replace('{{SESSION_ID}}', sessionId)
      .replace('{{CAMPAIGN}}', activationRecord.campaign_id || 'CINIS')
      .replace('{{SITE}}', activationRecord.site_id || 'Physical')
      .replace('{{FEATURED_VIDEOS_JSON}}', JSON.stringify(youtubeContent.featuredVideos || []))
      .replace('{{PLAYLISTS_JSON}}', JSON.stringify(youtubeContent.playlists || []));

    console.log(`[ACTIVATION] Dashboard rendered for: ${code}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': `cinis_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: html
    };
  } catch (error) {
    console.error('[ACTIVATION] Gateway error:', error);
    return errorHandler.internalError(error);
  }
};

function detectDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}
