import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { useCricketData } from '../hooks/useCricketData';

const PlayerCard = ({ player, showLiveData = false }) => {
  const [liveStats, setLiveStats] = useState(null);
  const [hasRealTimeData, setHasRealTimeData] = useState(false);

  // Try to get real-time player information if enabled
  const { data: playerInfo, loading: playerLoading, error: playerError } = 
    showLiveData ? useCricketData.usePlayerInfo(player?.name) : { data: null, loading: false, error: null };

  useEffect(() => {
    if (playerInfo && !playerError && showLiveData) {
      setLiveStats(playerInfo);
      setHasRealTimeData(true);
    } else {
      setHasRealTimeData(false);
    }
  }, [playerInfo, playerError, showLiveData]);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Batsman':
        return 'bg-blue-100 text-blue-800';
      case 'Bowler':
        return 'bg-red-100 text-red-800';
      case 'All-rounder':
        return 'bg-purple-100 text-purple-800';
      case 'Wicket-keeper':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link 
      to={`/player/${player.id}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(player.role)}`}>
            {player.role}
          </span>
          {showLiveData && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              hasRealTimeData ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {hasRealTimeData ? (
                <>
                  <Wifi size={10} className="mr-1" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff size={10} className="mr-1" />
                  Static
                </>
              )}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
          {player.name}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 mt-1 mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{player.country}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          {player.runs !== undefined && (
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{player.runs}</div>
              <div className="text-gray-500">Runs</div>
            </div>
          )}
          
          {player.wickets !== undefined && player.wickets > 0 && (
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{player.wickets}</div>
              <div className="text-gray-500">Wickets</div>
            </div>
          )}

          <div className="flex items-center text-green-600">
            <User size={14} className="mr-1" />
            <span className="text-xs">View Profile</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlayerCard;
