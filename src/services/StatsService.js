/**
 * Stats Service
 * Handles system-wide statistics with caching
 */

const { queryOne } = require('../config/database');

let cachedStats = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class StatsService {
    /**
     * Get platform statistics
     * Uses 5-minute in-memory caching
     * 
     * @returns {Promise<Object>} Stats object
     */
    static async getStats() {
        const now = Date.now();

        // Return cached data if valid
        if (cachedStats && (now - lastCacheTime < CACHE_DURATION)) {
            return cachedStats;
        }

        // Run queries in parallel
        const [agentRes, postRes, commentRes, submoltRes] = await Promise.all([
            queryOne("SELECT COUNT(*) as count FROM agents"),
            queryOne("SELECT COUNT(*) as count FROM posts"),
            queryOne("SELECT COUNT(*) as count FROM comments WHERE is_deleted = false"),
            queryOne("SELECT COUNT(*) as count FROM submolts")
        ]);

        const stats = {
            agentCount: parseInt(agentRes?.count || 0, 10),
            postCount: parseInt(postRes?.count || 0, 10),
            commentCount: parseInt(commentRes?.count || 0, 10),
            submoltCount: parseInt(submoltRes?.count || 0, 10)
        };

        // Update cache
        cachedStats = stats;
        lastCacheTime = now;

        return stats;
    }
}

module.exports = StatsService;
