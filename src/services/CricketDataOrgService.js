import APIKeyManager from './APIKeyManager.js';
import { API_KEYS, API_ENDPOINTS, RATE_LIMITS } from '../config/apiKeys.js';

// CricketData.org Service for Cricket Data
class CricketDataOrgService {
  constructor() {
    this.keyManager = new APIKeyManager(API_KEYS.cricketdata, RATE_LIMITS.cricketdata);
    this.baseURL = API_ENDPOINTS.cricketdata.base;
    this.endpoints = API_ENDPOINTS.cricketdata.endpoints;
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const { key, index } = this.keyManager.getNextAvailableKey();
      
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      // Add API key as a parameter (CricketData.org uses apikey param)
      url.searchParams.append('apikey', key);
      
      // Add other parameters
      Object.keys(params).forEach(param => {
        if (params[param] !== undefined && params[param] !== null) {
          url.searchParams.append(param, params[param]);
        }
      });

      console.log(`Making CricketData.org request with key ${index + 1}:`, url.toString());
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if the response indicates success (CricketData.org specific)
      if (data.status === 'failure') {
        throw new Error(data.reason || 'API request failed');
      }
      
      this.keyManager.recordUsage(index, true);
      return data;
      
    } catch (error) {
      if (this.keyManager.currentKeyIndex !== undefined) {
        this.keyManager.recordUsage(this.keyManager.currentKeyIndex, false);
      }
      throw error;
    }
  }

  // === LIST APIs ===

  // Get countries with flags
  async getCountries(offset = 0) {
    return await this.makeRequest(this.endpoints.countries, { offset });
  }

  // Get cricket series list
  async getSeries(offset = 0, search = null) {
    const params = { offset };
    if (search) params.search = search;
    return await this.makeRequest(this.endpoints.series, params);
  }

  // Get all matches
  async getAllMatches(offset = 0) {
    return await this.makeRequest(this.endpoints.matches, { offset });
  }

  // Get current/live matches
  async getCurrentMatches(offset = 0) {
    return await this.makeRequest(this.endpoints.currentMatches, { offset });
  }

  // Get all players
  async getAllPlayers(offset = 0, search = null) {
    const params = { offset };
    if (search) params.search = search;
    return await this.makeRequest(this.endpoints.players, params);
  }

  // === INFO APIs ===

  // Get series information
  async getSeriesInfo(seriesId) {
    return await this.makeRequest(this.endpoints.seriesInfo, { id: seriesId });
  }

  // Get match information
  async getMatchInfo(matchId) {
    return await this.makeRequest(this.endpoints.matchInfo, { id: matchId });
  }

  // Get player information
  async getPlayerInfo(playerId) {
    return await this.makeRequest(this.endpoints.playerInfo, { id: playerId });
  }

  // === FANTASY APIs ===

  // Get fantasy squad for a match
  async getFantasySquad(matchId) {
    return await this.makeRequest(this.endpoints.fantasySquad, { id: matchId });
  }

  // Get fantasy scorecard for a match
  async getFantasyScorecard(matchId) {
    return await this.makeRequest(this.endpoints.fantasyScorecard, { id: matchId });
  }

  // Get fantasy ball by ball for a match
  async getFantasyBallByBall(matchId) {
    return await this.makeRequest(this.endpoints.fantasyBallByBall, { id: matchId });
  }

  // Get fantasy points for a match
  async getFantasyPoints(matchId) {
    return await this.makeRequest(this.endpoints.fantasyPoints, { id: matchId });
  }

  // === CONVENIENCE METHODS ===

  // Get live matches (alias for current matches)
  async getLiveMatches() {
    return await this.getCurrentMatches();
  }

  // Get recent matches (get first page of all matches)
  async getRecentMatches() {
    return await this.getAllMatches(0);
  }

  // Search series by name
  async searchSeries(searchTerm) {
    return await this.getSeries(0, searchTerm);
  }

  // Search players by name
  async searchPlayers(searchTerm) {
    return await this.getAllPlayers(0, searchTerm);
  }

  // Get match details with scorecard
  async getFullMatchDetails(matchId) {
    try {
      const [matchInfo, scorecard] = await Promise.all([
        this.getMatchInfo(matchId),
        this.getFantasyScorecard(matchId).catch(() => null) // Scorecard might not be available
      ]);
      
      return {
        matchInfo: matchInfo.data,
        scorecard: scorecard?.data || null
      };
    } catch (error) {
      console.error('Error fetching full match details:', error);
      throw error;
    }
  }

  // Get usage statistics
  getUsageStats() {
    return this.keyManager.getUsageStats();
  }

  // Health check
  async healthCheck() {
    try {
      // Try to get countries as a simple health check
      const result = await this.getCountries(0);
      return {
        status: 'healthy',
        message: 'CricketData.org API is working',
        responseTime: Date.now(),
        sampleData: result.data ? result.data.slice(0, 2) : null
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        error: error
      };
    }
  }
}

export default CricketDataOrgService;
