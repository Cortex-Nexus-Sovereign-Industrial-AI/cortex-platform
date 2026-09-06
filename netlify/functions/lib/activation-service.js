// netlify/functions/lib/activation-service.js
// Activation code validation and registry

import { pool } from './db.js';

export async function getByCode(code) {
  try {
    const result = await pool.query(
      'SELECT * FROM activation_codes WHERE code = $1',
      [code]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[ACTIVATION-SERVICE] getByCode error:', error);
    throw error;
  }
}

export async function listByStatus(status) {
  try {
    const result = await pool.query(
      'SELECT * FROM activation_codes WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return result.rows;
  } catch (error) {
    console.error('[ACTIVATION-SERVICE] listByStatus error:', error);
    throw error;
  }
}

export async function updateStatus(id, status) {
  try {
    const result = await pool.query(
      'UPDATE activation_codes SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[ACTIVATION-SERVICE] updateStatus error:', error);
    throw error;
  }
}

export async function create(code, campaignId, siteId, metadata = {}) {
  try {
    const result = await pool.query(
      `INSERT INTO activation_codes (code, campaign_id, site_id, status, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [code, campaignId, siteId, 'active', JSON.stringify(metadata)]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[ACTIVATION-SERVICE] create error:', error);
    throw error;
  }
}

export async function getStats(code) {
  try {
    const result = await pool.query(
      `SELECT 
         ac.code,
         ac.campaign_id,
         ac.site_id,
         ac.status,
         ac.created_at,
         COUNT(DISTINCT se.session_id) as total_scans,
         COUNT(DISTINCT se.device_type) as unique_devices,
         MAX(se.timestamp) as last_scan
       FROM activation_codes ac
       LEFT JOIN scan_events se ON ac.id = se.activation_code_id
       WHERE ac.code = $1
       GROUP BY ac.id`,
      [code]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[ACTIVATION-SERVICE] getStats error:', error);
    throw error;
  }
}
