import React, { useState } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import LeaderboardTable from '../components/LeaderboardTable';
import { usePlayers } from '../hooks/usePlayers';

const Leaderboards: React.FC = () => {
  const { players, loading, error } = usePlayers();
  const [sortBy, setSortBy] = useState<'runs' | 'wickets'>('runs');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Player Statistics
          </h1>
          <p className="text-xl text-gray-600">
            Loading player statistics...
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="animate-pulse">
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded w-20"></div>
                ))}
              </div>
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-300 rounded w-8"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Statistics</h2>
          <p className="text-gray-600 mb-8">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Player Statistics
        </h1>
        <p className="text-xl text-gray-600">
          Compare players based on their career performance
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-8">
        <button
          onClick={() => setSortBy('runs')}
          className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            sortBy === 'runs'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <TrendingUp size={20} className="mr-2" />
          Sort by Runs
        </button>

        <button
          onClick={() => setSortBy('wickets')}
          className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            sortBy === 'wickets'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Target size={20} className="mr-2" />
          Sort by Wickets
        </button>
      </div>

      <LeaderboardTable players={players} sortBy={sortBy} />

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Statistics based on international career performances</p>
      </div>
    </div>
  );
};

export default Leaderboards;