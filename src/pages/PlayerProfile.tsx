import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, HeartOff } from 'lucide-react';
import PlayerDetails from '../components/PlayerDetails';
import { usePlayers } from '../hooks/usePlayers';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPlayerById, loading: playersLoading } = usePlayers();
  const { isFavorite, addFavorite, removeFavorite, loading: favoritesLoading } = useFavorites();
  const { user } = useAuth();

  const player = getPlayerById(id || '');

  const toggleFavorite = async () => {
    if (!player) return;

    if (isFavorite(player.id)) {
      await removeFavorite(player.id);
    } else {
      await addFavorite(player.id);
    }
  };

  if (playersLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="w-full h-64 md:h-96 bg-gray-300"></div>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded mb-6 w-1/2"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🏏</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Player Not Found</h2>
          <p className="text-gray-600 mb-8">The player you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4 sm:mb-0 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Players
        </Link>

        {user && (
          <button
            onClick={toggleFavorite}
            disabled={favoritesLoading}
            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              isFavorite(player.id)
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            } ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isFavorite(player.id) ? (
              <>
                <HeartOff size={20} className="mr-2" />
                Remove from Favorites
              </>
            ) : (
              <>
                <Heart size={20} className="mr-2" />
                Add to Favorites
              </>
            )}
          </button>
        )}
      </div>

      <PlayerDetails player={player} />
    </div>
  );
};

export default PlayerProfile;