import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  country: string;
  role: string;
  image: string;
  runs?: number;
  wickets?: number;
}

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const getRoleBadgeColor = (role: string) => {
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
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(player.role)}`}>
            {player.role}
          </span>
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