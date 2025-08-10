import CricketDataOrgService from './CricketDataOrgService.js';

// Main Cricket Data Service - Uses CricketData.org exclusively (FREE TIER OPTIMIZED)
class CricketDataService {
  constructor() {
    this.cricketDataOrg = new CricketDataOrgService();
    this.cache = new Map(); // Simple in-memory cache
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache timeout (longer for free tier)
  }

  // Cache management
  getCacheKey(service, method, params) {
    return `${service}_${method}_${JSON.stringify(params)}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Get live matches from CricketData.org
  async getLiveMatches() {
    const cacheKey = this.getCacheKey('cricketdata', 'getLiveMatches', {});
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.cricketDataOrg.getLiveMatches();
      const result = { source: 'cricketdata.org', data: data.data };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('CricketData.org live matches failed:', error.message);
      throw new Error('Unable to fetch live matches: ' + error.message);
    }
  }

  // Get player statistics from CricketData.org
  async getPlayerStats(playerId) {
    const cacheKey = this.getCacheKey('cricketdata', 'getPlayerStats', { playerId });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.cricketDataOrg.getPlayerInfo(playerId);
      const result = { source: 'cricketdata.org', data: data.data };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('CricketData.org player stats failed:', error.message);
      throw new Error(`Unable to fetch player stats for ID: ${playerId} - ${error.message}`);
    }
  }

  // Get current rankings - Note: CricketData.org doesn't have direct rankings endpoint
  // This will return series information instead as an alternative
  async getRankings(format = 'odi') {
    const cacheKey = this.getCacheKey('cricketdata', 'getRankings', { format });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Since CricketData.org doesn't have rankings, we'll get recent series
      const data = await this.cricketDataOrg.getSeries(0);
      const result = { 
        source: 'cricketdata.org', 
        data: data.data,
        note: 'Rankings not available - showing recent series instead'
      };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('CricketData.org series failed:', error.message);
      throw new Error(`Unable to fetch series data - ${error.message}`);
    }
  }

  // Get recent matches from CricketData.org
  async getRecentMatches() {
    const cacheKey = this.getCacheKey('cricketdata', 'getRecentMatches', {});
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.cricketDataOrg.getRecentMatches();
      const result = { source: 'cricketdata.org', data: data.data };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('CricketData.org recent matches failed:', error.message);
      throw new Error('Unable to fetch recent matches: ' + error.message);
    }
  }

  // Get match details from CricketData.org
  async getMatchDetails(matchId) {
    const cacheKey = this.getCacheKey('cricketdata', 'getMatchDetails', { matchId });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.cricketDataOrg.getFullMatchDetails(matchId);
      const result = { source: 'cricketdata.org', data };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('CricketData.org match details failed:', error.message);
      throw new Error(`Unable to fetch match details for ID: ${matchId} - ${error.message}`);
    }
  }

  // Additional CricketData.org specific methods

  // Get all series
  async getAllSeries(offset = 0) {
    try {
      const data = await this.cricketDataOrg.getSeries(offset);
      return { source: 'cricketdata.org', data: data.data };
    } catch (error) {
      throw new Error('Unable to fetch series: ' + error.message);
    }
  }

  // Search series
  async searchSeries(searchTerm) {
    try {
      const data = await this.cricketDataOrg.searchSeries(searchTerm);
      return { source: 'cricketdata.org', data: data.data };
    } catch (error) {
      throw new Error('Unable to search series: ' + error.message);
    }
  }

  // Search players
  async searchPlayers(searchTerm) {
    try {
      const data = await this.cricketDataOrg.searchPlayers(searchTerm);
      return { source: 'cricketdata.org', data: data.data };
    } catch (error) {
      throw new Error('Unable to search players: ' + error.message);
    }
  }

  // Get series information
  async getSeriesInfo(seriesId) {
    try {
      const data = await this.cricketDataOrg.getSeriesInfo(seriesId);
      return { source: 'cricketdata.org', data: data.data };
    } catch (error) {
      throw new Error('Unable to fetch series info: ' + error.message);
    }
  }

  // Get fantasy squad
  async getFantasySquad(matchId) {
    try {
      const data = await this.cricketDataOrg.getFantasySquad(matchId);
      return { source: 'cricketdata.org', data: data.data };
    } catch (error) {
      throw new Error('Unable to fetch fantasy squad: ' + error.message);
    }
  }

  // Get comprehensive API usage statistics for CricketData.org
  getUsageStats() {
    return {
      cricketdata: this.cricketDataOrg.getUsageStats(),
      cache: {
        size: this.cache.size,
        keys: Array.from(this.cache.keys())
      }
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Health check for CricketData.org API
  async healthCheck() {
    const health = {
      cricketdata: { status: 'unknown', error: null }
    };

    try {
      const healthResult = await this.cricketDataOrg.healthCheck();
      health.cricketdata = healthResult;
    } catch (error) {
      health.cricketdata.status = 'error';
      health.cricketdata.error = error.message;
    }

    return health;
  }
}

// Create and export a singleton instance
const cricketDataService = new CricketDataService();
export default cricketDataService;
