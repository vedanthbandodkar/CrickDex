import { useState, useEffect, useCallback } from 'react';
import cricketDataService from '../services/CricketDataService.js';

// Custom hook for fetching live cricket data (FREE TIER OPTIMIZED)
export const useLiveMatches = (refreshInterval = 120000) => { // 2 minutes default for free tier
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLiveMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cricketDataService.getLiveMatches();
      setLiveMatches(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching live matches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveMatches();
    
    // Set up auto-refresh
    const interval = setInterval(fetchLiveMatches, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchLiveMatches, refreshInterval]);

  return {
    liveMatches,
    loading,
    error,
    lastUpdated,
    refresh: fetchLiveMatches
  };
};

// Custom hook for fetching player statistics
export const usePlayerStats = (playerId) => {
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayerStats = useCallback(async () => {
    if (!playerId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await cricketDataService.getPlayerStats(playerId);
      setPlayerStats(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching player stats:', err);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    fetchPlayerStats();
  }, [fetchPlayerStats]);

  return {
    playerStats,
    loading,
    error,
    refresh: fetchPlayerStats
  };
};

// Custom hook for fetching rankings
export const useRankings = (format = 'odi') => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRankings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cricketDataService.getRankings(format);
      setRankings(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
    }
  }, [format]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  return {
    rankings,
    loading,
    error,
    refresh: fetchRankings
  };
};

// Custom hook for fetching recent matches
export const useRecentMatches = () => {
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cricketDataService.getRecentMatches();
      setRecentMatches(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recent matches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentMatches();
  }, [fetchRecentMatches]);

  return {
    recentMatches,
    loading,
    error,
    refresh: fetchRecentMatches
  };
};

// Custom hook for API health monitoring
export const useAPIHealth = () => {
  const [healthStatus, setHealthStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      const health = await cricketDataService.healthCheck();
      setHealthStatus(health);
    } catch (err) {
      console.error('Error checking API health:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsageStats = useCallback(() => {
    return cricketDataService.getUsageStats();
  }, []);

  return {
    healthStatus,
    loading,
    checkHealth,
    getUsageStats
  };
};
