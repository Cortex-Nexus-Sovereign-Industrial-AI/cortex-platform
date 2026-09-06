// netlify/functions/lib/education-service.js
// Learning progression tracking (L0 → L5)

import { pool } from './db.js';

export async function createProgressionRecord(sessionId, startingLevel = 'L0') {
  try {
    const result = await pool.query(
      `INSERT INTO education_progression 
       (session_id, starting_level, current_level, user_level, created_at, last_updated)
       VALUES ($1, $2, $3, $3, NOW(), NOW())
       RETURNING id, user_level, starting_level, current_level`,
      [sessionId, startingLevel, startingLevel]
    );
    console.log(`[EDUCATION-SERVICE] Progression record created for ${sessionId}`);
    return result.rows[0];
  } catch (error) {
    console.error('[EDUCATION-SERVICE] createProgressionRecord error:', error);
    throw error;
  }
}

export async function trackVideoEngagement(sessionId, videoData) {
  try {
    const result = await pool.query(
      `INSERT INTO video_engagement 
       (session_id, youtube_video_id, video_title, playlist_id, playlist_title, action, watch_time_seconds, timestamp, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
       RETURNING id`,
      [
        sessionId,
        videoData.videoId || '',
        videoData.title || '',
        videoData.playlistId || '',
        videoData.playlistTitle || '',
        videoData.action || 'play',
        videoData.watchTimeSeconds || 0,
        JSON.stringify(videoData.metadata || {})
      ]
    );
    console.log(`[EDUCATION-SERVICE] Video engagement tracked: ${videoData.action}`);
    return result.rows[0];
  } catch (error) {
    console.error('[EDUCATION-SERVICE] trackVideoEngagement error:', error);
    throw error;
  }
}

export async function updateProgressionMetrics(sessionId, updates) {
  try {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    });

    fields.push(`last_updated = NOW()`);
    values.push(sessionId);

    const result = await pool.query(
      `UPDATE education_progression 
       SET ${fields.join(', ')}
       WHERE session_id = $${paramIndex}
       RETURNING *`,
      values
    );
    console.log(`[EDUCATION-SERVICE] Progression metrics updated`);
    return result.rows[0];
  } catch (error) {
    console.error('[EDUCATION-SERVICE] updateProgressionMetrics error:', error);
    throw error;
  }
}

export async function getProgressionReport(sessionId) {
  try {
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
    return result.rows[0] || null;
  } catch (error) {
    console.error('[EDUCATION-SERVICE] getProgressionReport error:', error);
    throw error;
  }
}
