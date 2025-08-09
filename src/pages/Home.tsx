import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import PlayerCard from '../components/PlayerCard';
import { usePlayers } from '../hooks/usePlayers';

const Home: React.FC = () => {
  const { players, loading, error } = usePlayers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    return players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cricket Pokédex
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Loading cricket players...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4 w-2/3"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Players</h2>
          <p className="text-gray-600 mb-8">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Cricket Pokédex
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover and explore the world's greatest cricket players. Search, compare, and learn about cricket legends.
        </p>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by player name, country, or role..."
      />

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏏</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No players found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredPlayers.length} of {players.length} players
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;