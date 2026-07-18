"use strict";

const TwitterApi = require('twitter-api-v2').default;
const axios = require('axios');
const logger = require('../utils/logger');

class SocialMediaService {
  /**
   * Post to Twitter
   */
  async postToTwitter(content, mediaUrls = []) {
    try {
      const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });

      const rwClient = client.readWrite;
      const response = await rwClient.v2.tweet({
        text: content
      });

      logger.info(`✅ Tweet posted: ${response.data.id}`);
      return { success: true, postId: response.data.id, platform: 'twitter' };
    } catch (error) {
      logger.error(`❌ Twitter post failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Post to LinkedIn
   */
  async postToLinkedIn(content, mediaUrls = []) {
    try {
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${process.env.LINKEDIN_USER_URN}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc:ShareContent': {
              shareCommentary: {
                text: content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc:ShareVisibility': {
              code: 'PUBLIC'
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`✅ LinkedIn post created: ${response.data.id}`);
      return { success: true, postId: response.data.id, platform: 'linkedin' };
    } catch (error) {
      logger.error(`❌ LinkedIn post failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Post to TikTok
   */
  async postToTikTok(content, videoUrl) {
    try {
      // TikTok requires video file upload
      const response = await axios.post(
        'https://open-api.tiktok.com/v1/post/publish/video/init/',
        {
          source_info: {
            source: 'FILE_UPLOAD',
            video_name: `cortex-${Date.now()}`
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`✅ TikTok video initialized: ${response.data.data.upload_url}`);
      return { success: true, uploadUrl: response.data.data.upload_url, platform: 'tiktok' };
    } catch (error) {
      logger.error(`❌ TikTok post failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Post to Telegram
   */
  async postToTelegram(content, mediaUrl = null) {
    try {
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/`;

      if (mediaUrl) {
        await axios.post(`${url}sendPhoto`, {
          chat_id: process.env.TELEGRAM_CHAT_ID,
          photo: mediaUrl,
          caption: content,
          parse_mode: 'HTML'
        });
      } else {
        await axios.post(`${url}sendMessage`, {
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: content,
          parse_mode: 'HTML'
        });
      }

      logger.info(`✅ Telegram message sent`);
      return { success: true, platform: 'telegram' };
    } catch (error) {
      logger.error(`❌ Telegram post failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Post to WhatsApp Business API
   */
  async postToWhatsApp(content, recipientNumber) {
    try {
      const response = await axios.post(
        `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientNumber,
          type: 'text',
          text: {
            body: content
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_BUSINESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`✅ WhatsApp message sent: ${response.data.messages[0].id}`);
      return { success: true, messageId: response.data.messages[0].id, platform: 'whatsapp' };
    } catch (error) {
      logger.error(`❌ WhatsApp post failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Post to Medium
   */
  async postToMedium(title, content, tags = []) {
    try {
      const response = await axios.post(
        `https://api.medium.com/v1/users/${process.env.MEDIUM_USER_ID}/posts`,
        {
          title,
          contentFormat: 'html',
          content,
          publishStatus: 'public',
          tags,
          canonicalUrl: `${process.env.FRONTEND_URL}/blog/${Date.now()}`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MEDIUM_INTEGRATION_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`✅ Medium article published: ${response.data.data.id}`);
      return { success: true, postId: response.data.data.id, url: response.data.data.url, platform: 'medium' };
    } catch (error) {
      logger.error(`❌ Medium post failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get Twitter analytics
   */
  async getTwitterAnalytics(tweetId) {
    try {
      const client = new TwitterApi({
        bearerToken: process.env.TWITTER_BEARER_TOKEN
      });

      const response = await client.v2.singleTweet(tweetId, {
        'tweet.fields': 'public_metrics',
        'expansions': 'author_id'
      });

      return response.data.public_metrics;
    } catch (error) {
      logger.error(`❌ Twitter analytics failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Post to multiple platforms simultaneously
   */
  async postToAll(platforms, content, mediaUrls = []) {
    const results = [];

    for (const platform of platforms) {
      try {
        let result;
        switch (platform) {
          case 'twitter':
            result = await this.postToTwitter(content, mediaUrls);
            break;
          case 'linkedin':
            result = await this.postToLinkedIn(content, mediaUrls);
            break;
          case 'telegram':
            result = await this.postToTelegram(content, mediaUrls[0]);
            break;
          case 'medium':
            result = await this.postToMedium('Update', content);
            break;
          default:
            logger.warn(`⚠️ Platform not supported: ${platform}`);
        }
        results.push(result);
      } catch (error) {
        results.push({ success: false, platform, error: error.message });
      }
    }

    return results;
  }
}

module.exports = new SocialMediaService();
