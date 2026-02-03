/**
 * Stats Routes
 * /api/v1/stats
 */

const { Router } = require('express');
const StatsService = require('../services/StatsService');

const router = Router();

/**
 * GET /
 * Get platform statistics
 * Public endpoint
 */
router.get('/', async (req, res) => {
    try {
        const stats = await StatsService.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({
            error: "Failed to fetch statistics",
            code: "STATS_ERROR"
        });
    }
});

module.exports = router;
