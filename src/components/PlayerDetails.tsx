import React from 'react';
import { MapPin, Activity, TrendingUp, Award, Target } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  country: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  matches: number;
  runs: number;
  average: number;
  hundreds?: number;
  wickets?: number;
  image: string;
}

interface PlayerDetailsProps {
  player: Player;
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({ player }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={player.image}
            alt={player.name}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{player.name}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {player.role}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-6">
            <MapPin size={20} className="mr-2" />
            <span className="text-lg">{player.country}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Playing Style
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Activity size={16} className="mr-2 text-blue-500" />
                  <span className="text-gray-900">Batting: {player.battingStyle}</span>
                </div>
                <div className="flex items-center">
                  <Target size={16} className="mr-2 text-red-500" />
                  <span className="text-gray-900">Bowling: {player.bowlingStyle}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Career Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{player.matches}</div>
                  <div className="text-sm text-gray-500">Matches</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{player.runs}</div>
                  <div className="text-sm text-gray-500">Runs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp size={20} className="text-green-500" />
              </div>
              <div className="text-xl font-bold text-gray-900">{player.average.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Average</div>
            </div>

            {player.hundreds !== undefined && (
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Award size={20} className="text-yellow-500" />
                </div>
                <div className="text-xl font-bold text-gray-900">{player.hundreds}</div>
                <div className="text-sm text-gray-500">Centuries</div>
              </div>
            )}

            {player.wickets !== undefined && (
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Target size={20} className="text-red-500" />
                </div>
                <div className="text-xl font-bold text-gray-900">{player.wickets}</div>
                <div className="text-sm text-gray-500">Wickets</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;