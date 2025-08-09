import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, HeartOff } from 'lucide-react';
import PlayerDetails from '../components/PlayerDetails';
import playersData from '../data/players.json';

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  const player = playersData.find(p => p.id === parseInt(id || '0'));

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
      updatedFavorites = favorites.filter((favId: number) => favId !== player.id);
    } else {
      updatedFavorites = [...favorites, player.id];
    }

    localStorage.setItem('cricket-favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

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

        <button
          onClick={toggleFavorite}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
            isFavorite
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {isFavorite ? (
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
      </div>

      <PlayerDetails player={player} />
    </div>
  );
};

export default PlayerProfile;