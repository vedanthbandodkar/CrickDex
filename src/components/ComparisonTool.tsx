import React from 'react';
import { TrendingUp, Target, Award, Activity } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  country: string;
  role: string;
  matches: number;
  runs: number;
  average: number;
  hundreds?: number;
  wickets?: number;
  image: string;
}

interface ComparisonToolProps {
  player1: Player | null;
  player2: Player | null;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ player1, player2 }) => {
  if (!player1 || !player2) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Select two players to compare their statistics</p>
      </div>
    );
  }

  const ComparisonCard: React.FC<{ player: Player; isLeft?: boolean }> = ({ player, isLeft }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${isLeft ? 'text-left' : 'text-right'}`}>
      <div className={`flex items-center gap-4 mb-6 ${isLeft ? '' : 'flex-row-reverse'}`}>
        <img
          src={player.image}
          alt={player.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className={isLeft ? 'text-left' : 'text-right'}>
          <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
          <p className="text-gray-600">{player.country}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {player.role}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`flex items-center gap-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <Activity size={18} className="text-blue-500" />
          <div className={isLeft ? 'text-left' : 'text-right'}>
            <div className="text-2xl font-bold text-blue-600">{player.matches}</div>
            <div className="text-sm text-gray-500">Matches</div>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <TrendingUp size={18} className="text-green-500" />
          <div className={isLeft ? 'text-left' : 'text-right'}>
            <div className="text-2xl font-bold text-green-600">{player.runs.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Runs</div>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <Target size={18} className="text-purple-500" />
          <div className={isLeft ? 'text-left' : 'text-right'}>
            <div className="text-2xl font-bold text-purple-600">{player.average.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Average</div>
          </div>
        </div>

        {player.hundreds !== undefined && (
          <div className={`flex items-center gap-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
            <Award size={18} className="text-yellow-500" />
            <div className={isLeft ? 'text-left' : 'text-right'}>
              <div className="text-2xl font-bold text-yellow-600">{player.hundreds}</div>
              <div className="text-sm text-gray-500">Centuries</div>
            </div>
          </div>
        )}

        {player.wickets !== undefined && (
          <div className={`flex items-center gap-2 ${isLeft ? '' : 'flex-row-reverse'}`}>
            <Target size={18} className="text-red-500" />
            <div className={isLeft ? 'text-left' : 'text-right'}>
              <div className="text-2xl font-bold text-red-600">{player.wickets}</div>
              <div className="text-sm text-gray-500">Wickets</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <ComparisonCard player={player1} isLeft={true} />
      <ComparisonCard player={player2} isLeft={false} />
    </div>
  );
};

export default ComparisonTool;