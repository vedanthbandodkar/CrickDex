// API Keys Configuration for CricketData.org
// This file supports both environment variables and direct configuration
// For production, use environment variables. For development, you can set keys directly.

// Helper function to get environment variables or fallback to direct config
const getEnvKeys = (prefix, fallbackKeys = []) => {
  // For free tier, only get the first key
  const key = import.meta.env[`VITE_${prefix}_KEY_1`] || import.meta.env[`VITE_${prefix}_FREE_KEY`];
  
  if (key && key !== `your_${prefix.toLowerCase()}_key_1_here` && key !== `your_${prefix.toLowerCase()}_free_key`) {
    return [key]; // Return only one key for free tier
  }
  
  // If no environment key found, use fallback keys (for development)
  return fallbackKeys;
};

export const API_KEYS = {
  // CricketData.org FREE API Key (only 1 key needed for free tier)
  cricketdata: getEnvKeys('CRICKETDATA', [
    'YOUR_CRICKETDATA_FREE_KEY' // Only one key needed for free tier
  ])
};

// API Endpoints for CricketData.org
export const API_ENDPOINTS = {
  cricketdata: {
    base: 'https://api.cricapi.com/v1',
    endpoints: {
      // List APIs
      countries: '/countries',
      series: '/series', 
      matches: '/matches',
      currentMatches: '/currentMatches',
      players: '/players',
      
      // Info APIs  
      seriesInfo: '/series_info',
      matchInfo: '/match_info',
      playerInfo: '/players_info',
      
      // Fantasy APIs
      fantasySquad: '/fantasy_squad',
      fantasyScorecard: '/fantasy_scorecard',
      fantasyBallByBall: '/fantasy_ball_by_ball',
      fantasyPoints: '/fantasy_points'
    }
  }
};

// Rate Limiting Configuration for CricketData.org FREE TIER
export const RATE_LIMITS = {
  cricketdata: {
    requestsPerMinute: 25, // Conservative limit for free tier
    requestsPerDay: 100,   // Free tier: 100 requests per day
    cooldownTime: 120000   // 2 minute cooldown to be extra safe
  }
};

// Development mode helper
export const isDevelopmentMode = () => {
  return import.meta.env.VITE_ENABLE_DEVELOPMENT_MODE === 'true' || import.meta.env.DEV;
};

// Configuration validation for CricketData.org FREE TIER
export const validateConfig = () => {
  const issues = [];
  
  const { cricketdata } = API_KEYS;
  
  if (!cricketdata || cricketdata.length === 0) {
    issues.push('No CricketData.org API key configured');
  } else {
    const placeholderKeys = cricketdata.filter(key => 
      key.startsWith('YOUR_') || key === 'your_cricketdata_free_key'
    );
    if (placeholderKeys.length > 0) {
      issues.push(`Please replace the placeholder with your actual FREE API key from cricketdata.org`);
    }
    
    if (cricketdata.length > 1) {
      issues.push('Free tier only needs 1 API key (additional keys will be ignored)');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    keyCount: cricketdata ? cricketdata.length : 0,
    tier: 'FREE',
    dailyLimit: 100
  };
};
