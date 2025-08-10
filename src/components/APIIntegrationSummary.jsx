import React from 'react';
import { Wifi, Users, TrendingUp, Clock, Target, CheckCircle } from 'lucide-react';

const APIIntegrationSummary = () => {
  const integrations = [
    {
      feature: 'Player Profiles',
      icon: Users,
      status: 'Enhanced',
      description: 'Static player data enriched with real-time statistics and career updates',
      color: 'green'
    },
    {
      feature: 'Quiz System',
      icon: Target,
      status: 'Enhanced',
      description: 'Dynamic questions based on current matches and team rankings',
      color: 'blue'
    },
    {
      feature: 'Cricket Facts',
      icon: TrendingUp,
      status: 'Enhanced',
      description: 'Live cricket facts including current match information and statistics',
      color: 'purple'
    },
    {
      feature: 'Player Search',
      icon: Users,
      status: 'Enhanced',
      description: 'Real-time player search with live suggestions and autocomplete',
      color: 'indigo'
    },
    {
      feature: 'Live Matches',
      icon: Clock,
      status: 'Live',
      description: 'Real-time cricket matches happening now around the world',
      color: 'red'
    },
    {
      feature: 'Team Rankings',
      icon: TrendingUp,
      status: 'Live',
      description: 'Current cricket team rankings and series information',
      color: 'yellow'
    }
  ];

  const getStatusColor = (color, status) => {
    const colors = {
      green: status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-700',
      blue: status === 'Live' ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-700',
      purple: status === 'Live' ? 'bg-purple-100 text-purple-800' : 'bg-purple-50 text-purple-700',
      indigo: status === 'Live' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-50 text-indigo-700',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800'
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600'
    };
    return colors[color] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
          <Wifi className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">API Integration Status</h2>
          <p className="text-sm text-gray-600">CrickDex features enhanced with CricketData.org API</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map((integration, index) => {
          const Icon = integration.icon;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                  integration.status === 'Live' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-4 w-4 ${getIconColor(integration.color)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{integration.feature}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.color, integration.status)}`}>
                      {integration.status === 'Live' && <div className="w-2 h-2 bg-current rounded-full mr-1 animate-pulse"></div>}
                      {integration.status === 'Enhanced' && <CheckCircle size={12} className="mr-1" />}
                      {integration.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Wifi className="h-4 w-4 text-blue-600 mr-2" />
          <span className="font-medium text-blue-900">API Usage Optimized</span>
        </div>
        <p className="text-sm text-blue-700">
          Using CricketData.org FREE tier with smart caching (10-minute cache) and conservative rate limiting 
          to ensure reliable service within the 100 requests/day limit.
        </p>
      </div>
    </div>
  );
};

export default APIIntegrationSummary;
