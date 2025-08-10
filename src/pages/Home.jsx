import React, { useState, useMemo } from 'react';
import { Wifi } from 'lucide-react';
import SearchBar from '../components/SearchBar.jsx';
import PlayerCard from '../components/PlayerCard.jsx';
import LiveMatchesWidget from '../components/LiveMatchesWidget.jsx';
import LiveSeriesWidget from '../components/LiveRankingsWidget.jsx';
import playersData from '../data/players.json';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    return playersData.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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

      {/* Live Data Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        <LiveMatchesWidget />
        <LiveSeriesWidget />
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by player name, country, or role..."
        enableRealTimeSearch={true}
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
              Showing {filteredPlayers.length} of {playersData.length} players
            </p>
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <Wifi size={14} className="mr-1" />
              Enhanced with Live Data
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                showLiveData={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
