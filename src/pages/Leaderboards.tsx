import React, { useState } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import LeaderboardTable from '../components/LeaderboardTable';
import playersData from '../data/players.json';

const Leaderboards: React.FC = () => {
  const [sortBy, setSortBy] = useState<'runs' | 'wickets'>('runs');

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

      <LeaderboardTable players={playersData} sortBy={sortBy} />

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Statistics based on international career performances</p>
      </div>
    </div>
  );
};

export default Leaderboards;