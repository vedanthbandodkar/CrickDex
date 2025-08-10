import APIKeyManager from './APIKeyManager.js';
import { API_KEYS, API_ENDPOINTS, RATE_LIMITS } from '../config/apiKeys.js';

// RapidAPI Service for Cricket Data
class RapidAPIService {
  constructor() {
    this.keyManager = new APIKeyManager(API_KEYS.rapidapi, RATE_LIMITS.rapidapi);
    this.baseURL = API_ENDPOINTS.rapidapi.base;
    this.endpoints = API_ENDPOINTS.rapidapi.endpoints;
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const { key, index } = this.keyManager.getNextAvailableKey();
      
      const url = new URL(`${this.baseURL}${endpoint}`);
      Object.keys(params).forEach(param => {
        url.searchParams.append(param, params[param]);
      });

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': API_ENDPOINTS.rapidapi.hosts[0]
        }
      };

      console.log(`Making request with key ${index + 1}:`, url.toString());
      
      const response = await fetch(url.toString(), options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.keyManager.recordUsage(index, true);
      
      return data;
    } catch (error) {
      if (this.keyManager.currentKeyIndex !== undefined) {
        this.keyManager.recordUsage(this.keyManager.currentKeyIndex, false);
      }
      throw error;
    }
  }

  // Get recent matches
  async getRecentMatches() {
    return await this.makeRequest(this.endpoints.matches);
  }

  // Get live matches
  async getLiveMatches() {
    return await this.makeRequest(this.endpoints.livematches);
  }

  // Get player statistics
  async getPlayerStats(playerId) {
    return await this.makeRequest(`${this.endpoints.playerStats}/${playerId}`);
  }

  // Get current rankings
  async getRankings(formatType = 'test') {
    return await this.makeRequest(`${this.endpoints.rankings}/${formatType}`);
  }

  // Get match details with live commentary
  async getMatchDetails(matchId) {
    return await this.makeRequest(`${this.endpoints.matchDetails}/${matchId}`);
  }

  // Get live commentary
  async getLiveCommentary(matchId) {
    return await this.makeRequest(`${this.endpoints.commentary}/${matchId}`);
  }

  // Get API usage statistics
  getUsageStats() {
    return this.keyManager.getUsageStats();
  }
}

export default RapidAPIService;
