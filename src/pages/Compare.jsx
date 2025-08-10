import React, { useState } from 'react';
import { Users } from 'lucide-react';
import ComparisonTool from '../components/ComparisonTool.jsx';
import playersData from '../data/players.json';

const Compare = () => {
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');

  const player1 = playersData.find(p => p.id === parseInt(player1Id));
  const player2 = playersData.find(p => p.id === parseInt(player2Id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Users size={32} className="text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Player Comparison
        </h1>
        <p className="text-xl text-gray-600">
          Compare statistics between two cricket players
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="player1" className="block text-sm font-medium text-gray-700 mb-2">
              Select First Player
            </label>
            <select
              id="player1"
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Choose a player...</option>
              {playersData
                .filter(p => p.id.toString() !== player2Id)
                .map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.country})
                  </option>
                ))
              }
            </select>
          </div>

          <div>
            <label htmlFor="player2" className="block text-sm font-medium text-gray-700 mb-2">
              Select Second Player
            </label>
            <select
              id="player2"
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Choose a player...</option>
              {playersData
                .filter(p => p.id.toString() !== player1Id)
                .map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.country})
                  </option>
                ))
              }
            </select>
          </div>
        </div>
      </div>

      <ComparisonTool player1={player1 || null} player2={player2 || null} />
    </div>
  );
};

export default Compare;
