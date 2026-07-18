"use strict";

const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const socialMediaService = require('../services/socialMediaService');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

// Middleware to verify authentication
router.use(auth);

/**
 * GET /api/posts - List all posts
 */
router.get('/', (req, res) => {
  try {
    const query = `
      SELECT pq.*, sa.platform, sa.account_name
      FROM post_queue pq
      JOIN social_accounts sa ON pq.account_id = sa.id
      ORDER BY pq.created_at DESC
      LIMIT 100
    `;
    
    const posts = db.prepare(query).all();
    res.json(posts);
  } catch (error) {
    logger.error(`GET /posts error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/posts - Create new post
 */
router.post('/', (req, res) => {
  try {
    const { accountId, content, mediaUrls, scheduledAt, platforms } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const insertQuery = `
      INSERT INTO post_queue (account_id, content, media_urls, scheduled_at, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const status = scheduledAt ? 'scheduled' : 'draft';
    const stmt = db.prepare(insertQuery);
    const result = stmt.run(
      accountId,
      content,
      JSON.stringify(mediaUrls || []),
      scheduledAt || null,
      status,
      new Date().toISOString()
    );

    res.status(201).json({
      id: result.lastID,
      status,
      message: scheduledAt ? 'Post scheduled' : 'Post saved as draft'
    });
  } catch (error) {
    logger.error(`POST /posts error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/posts/:id/publish - Publish post immediately
 */
router.post('/:id/publish', async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = db.prepare('SELECT * FROM post_queue WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const account = db.prepare('SELECT * FROM social_accounts WHERE id = ?').get(post.account_id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Post to platform
    const result = await socialMediaService.postToTwitter(post.content, JSON.parse(post.media_urls));

    // Update post status
    db.prepare(`
      UPDATE post_queue
      SET status = 'posted', posted_at = ?, platform_post_id = ?
      WHERE id = ?
    `).run(new Date().toISOString(), result.postId, postId);

    logger.info(`✅ Post ${postId} published to ${account.platform}`);
    res.json({ success: true, message: 'Post published', ...result });
  } catch (error) {
    logger.error(`POST /posts/:id/publish error: ${error.message}`);
    
    // Update post with error
    db.prepare(`
      UPDATE post_queue
      SET status = 'failed', error_message = ?
      WHERE id = ?
    `).run(error.message, req.params.id);

    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/posts/:id - Delete post
 */
router.delete('/:id', (req, res) => {
  try {
    const postId = req.params.id;
    db.prepare('DELETE FROM post_queue WHERE id = ?').run(postId);
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    logger.error(`DELETE /posts/:id error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
