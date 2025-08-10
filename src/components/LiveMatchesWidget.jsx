import React from 'react';
import { useLiveMatches } from '../hooks/useCricketData.js';
import { Clock, Wifi, AlertCircle, RefreshCw } from 'lucide-react';

const LiveMatchesWidget = () => {
  const { liveMatches, loading, error, lastUpdated, refresh } = useLiveMatches(30000);

  if (loading && !liveMatches.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
          <span className="ml-2 text-gray-600">Loading live matches...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle size={20} className="mr-2" />
          <span>Error loading live matches</span>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Wifi className="text-green-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Live Matches</h2>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={16} className="mr-1" />
          {lastUpdated && (
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button
            onClick={refresh}
            className="ml-3 p-1 hover:bg-gray-100 rounded"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {liveMatches.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <span>No live matches at the moment</span>
        </div>
      ) : (
        <div className="space-y-4">
          {liveMatches.map((match, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-gray-800">
                  {match.teamA || match.team1 || 'Team 1'} vs {match.teamB || match.team2 || 'Team 2'}
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-red-600 font-medium">LIVE</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                {match.series || match.competition || 'Cricket Match'}
              </div>
              
              {match.status && (
                <div className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                  {match.status}
                </div>
              )}
              
              {match.venue && (
                <div className="text-xs text-gray-500 mt-2">
                  📍 {match.venue}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMatchesWidget;
