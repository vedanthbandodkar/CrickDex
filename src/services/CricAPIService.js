import APIKeyManager from './APIKeyManager.js';
import { API_KEYS, API_ENDPOINTS, RATE_LIMITS } from '../config/apiKeys.js';

// CricAPI Service for Cricket Data
class CricAPIService {
  constructor() {
    this.keyManager = new APIKeyManager(API_KEYS.cricapi, RATE_LIMITS.cricapi);
    this.baseURL = API_ENDPOINTS.cricapi.base;
    this.endpoints = API_ENDPOINTS.cricapi.endpoints;
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const { key, index } = this.keyManager.getNextAvailableKey();
      
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      // Add API key as a parameter
      url.searchParams.append('apikey', key);
      
      // Add other parameters
      Object.keys(params).forEach(param => {
        url.searchParams.append(param, params[param]);
      });

      console.log(`Making CricAPI request with key ${index + 1}:`, url.toString());
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if the response indicates success
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

  // Get current matches
  async getCurrentMatches() {
    return await this.makeRequest(this.endpoints.livescore);
  }

  // Get all matches
  async getAllMatches(offset = 0) {
    return await this.makeRequest(this.endpoints.matches, { offset });
  }

  // Get specific match info
  async getMatchInfo(matchId) {
    return await this.makeRequest(this.endpoints.matchinfo, { id: matchId });
  }

  // Get player information
  async getPlayerInfo(playerId) {
    return await this.makeRequest(this.endpoints.playerinfo, { pid: playerId });
  }

  // Get fantasy summary for a match
  async getFantasySummary(matchId) {
    return await this.makeRequest(this.endpoints.fantasysummary, { id: matchId });
  }

  // Get match squad
  async getMatchSquad(matchId) {
    return await this.makeRequest(this.endpoints.matchsquad, { id: matchId });
  }

  // Get usage statistics
  getUsageStats() {
    return this.keyManager.getUsageStats();
  }
}

export default CricAPIService;
