import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, HeartOff, Loader, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import PlayerDetails from '../components/PlayerDetails.jsx';
import playersData from '../data/players.json';
import useCricketData from '../hooks/useCricketData';

const PlayerProfile = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [player, setPlayer] = useState(null);
  const [useRealTimeData, setUseRealTimeData] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get static player data
  const staticPlayer = playersData.find(p => p.id === parseInt(id || '0'));
  
  // Try to get real-time player data
  const { data: realTimePlayer, loading: apiLoading, error: apiError } = useCricketData.usePlayerInfo(staticPlayer?.name);

  useEffect(() => {
    if (realTimePlayer && !apiError) {
      // Merge real-time data with static data
      const enrichedPlayer = {
        ...staticPlayer,
        realTimeStats: realTimePlayer,
        isLive: true
      };
      setPlayer(enrichedPlayer);
      setUseRealTimeData(true);
    } else {
      setPlayer(staticPlayer);
      setUseRealTimeData(false);
    }
    setLoading(false);
  }, [staticPlayer, realTimePlayer, apiError]);

  useEffect(() => {
    if (player) {
      const favorites = JSON.parse(localStorage.getItem('cricket-favorites') || '[]');
      setIsFavorite(favorites.includes(player.id));
    }
  }, [player]);

  const toggleFavorite = () => {
    if (!player) return;

    const favorites = JSON.parse(localStorage.getItem('cricket-favorites') || '[]');
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((favId) => favId !== player.id);
    } else {
      updatedFavorites = [...favorites, player.id];
    }

    localStorage.setItem('cricket-favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading player data...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🏏</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Player Not Found</h2>
          <p className="text-gray-600">Sorry, we couldn't find the player you're looking for.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button and live status */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        <div className="flex items-center space-x-3">
          {/* Live Data Status Indicator */}
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            useRealTimeData 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {useRealTimeData ? (
              <>
                <Wifi size={14} className="mr-1" />
                Live Data
              </>
            ) : (
              <>
                <WifiOff size={14} className="mr-1" />
                Static Data
              </>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <Heart size={20} fill="currentColor" /> : <HeartOff size={20} />}
          </button>
        </div>
      </div>

      {/* API Error Notice */}
      {apiError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-yellow-600 mr-2" />
            <div>
              <p className="text-yellow-800 font-medium">Using Static Data</p>
              <p className="text-yellow-700 text-sm">
                Real-time data is currently unavailable. Showing cached player information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Player Details Component */}
      <PlayerDetails 
        player={player} 
        showLiveData={useRealTimeData}
        realTimeStats={player?.realTimeStats}
      />
    </div>
  );
};

export default PlayerProfile;
