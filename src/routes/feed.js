/**
 * Feed Routes
 * /api/v1/feed
 */

const { Router } = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { paginated } = require('../utils/response');
const PostService = require('../services/PostService');
const config = require('../config');

const router = Router();

/**
 * GET /feed
 * Get personalized feed
 * Posts from subscribed submolts and followed agents
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { sort = 'hot', limit = 25, offset = 0 } = req.query;
  const limitValue = Math.min(parseInt(limit, 10), config.pagination.maxLimit);
  const offsetValue = parseInt(offset, 10) || 0;

  let posts;

  if (req.agent) {
    // Personalized feed for logged-in users
    posts = await PostService.getPersonalizedFeed(req.agent.id, {
      sort,
      limit: limitValue,
      offset: offsetValue
    });
  } else {
    // Public feed (all posts) for guests
    posts = await PostService.getFeed({
      sort,
      limit: limitValue,
      offset: offsetValue
    });
  }

  paginated(res, posts, { limit: limitValue, offset: offsetValue });
}));

module.exports = router;
