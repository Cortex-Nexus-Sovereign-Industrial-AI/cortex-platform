// netlify/functions/lib/event-service.js
// Scan event recording and telemetry

import { pool } from './db.js';

export async function recordScan(data) {
  try {
    const result = await pool.query(
      `INSERT INTO scan_events 
       (activation_code_id, session_id, user_agent, referrer, ip_address, device_type, metadata, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id`,
      [
        data.activation_code_id,
        data.session_id,
        data.user_agent || '',
        data.referrer || '',
        data.ip_address || '',
        data.device_type || 'unknown',
        JSON.stringify(data.metadata || {})
      ]
    );
    console.log(`[EVENT-SERVICE] Scan recorded: ${result.rows[0].id}`);
    return result.rows[0];
  } catch (error) {
    console.error('[EVENT-SERVICE] recordScan error:', error);
    throw error;
  }
}

export async function recordPathSelection(sessionId, path, activationCode) {
  try {
    const result = await pool.query(
      `INSERT INTO scan_events 
       (activation_code_id, session_id, metadata, timestamp)
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [
        activationCode,
        sessionId,
        JSON.stringify({
          event_type: 'ACTIVATION_PATH_SELECTED',
          path: path,
          timestamp: new Date().toISOString()
        })
      ]
    );
    console.log(`[EVENT-SERVICE] Path selection recorded: ${path}`);
    return result.rows[0];
  } catch (error) {
    console.error('[EVENT-SERVICE] recordPathSelection error:', error);
    throw error;
  }
}

export async function getSessionEvents(sessionId) {
  try {
    const result = await pool.query(
      `SELECT * FROM scan_events 
       WHERE session_id = $1 
       ORDER BY timestamp DESC`,
      [sessionId]
    );
    return result.rows;
  } catch (error) {
    console.error('[EVENT-SERVICE] getSessionEvents error:', error);
    throw error;
  }
}
