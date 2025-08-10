import React, { useState } from 'react';
import APIStatusDashboard from '../components/APIStatusDashboard.jsx';
import APIIntegrationSummary from '../components/APIIntegrationSummary.jsx';
import useCricketData from '../hooks/useCricketData.js';
import { Settings, Database, Activity, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const { recentMatches, loading, error, refresh } = useCricketData.useRecentMatches();
  const [activeTab, setActiveTab] = useState('status');

  const tabs = [
    { id: 'status', label: 'API Status', icon: Activity },
    { id: 'data', label: 'Data Sources', icon: Database },
    { id: 'matches', label: 'Recent Matches', icon: Calendar },
    { id: 'config', label: 'Configuration', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor API usage, data sources, and system health</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          <APIIntegrationSummary />
          <APIStatusDashboard />
        </div>
      )}

      {activeTab === 'data' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Database className="mr-2" size={24} />
            Data Sources Configuration
          </h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">CricketData.org (FREE TIER)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    https://api.cricapi.com/v1
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FREE Tier Features</label>
                  <div className="text-sm text-gray-600">
                    <div>• 100 requests/day</div>
                    <div>• Live Matches</div>
                    <div>• Player Search & Info</div>
                    <div>• Series Information</div>
                    <div>• Match Details</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Calendar className="mr-2" size={24} />
              Recent Matches
            </h2>
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading recent matches...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Failed to load recent matches</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : recentMatches && recentMatches.length > 0 ? (
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-800">
                      {match.teamA || match.team1 || 'Team 1'} vs {match.teamB || match.team2 || 'Team 2'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {match.date || 'Date TBD'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {match.series || match.competition || 'Cricket Match'}
                  </div>
                  {match.venue && (
                    <div className="text-sm text-gray-500 mt-1">
                      📍 {match.venue}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent matches data available
            </div>
          )}
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Settings className="mr-2" size={24} />
            System Configuration
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Rate Limiting (FREE TIER)</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  <div className="font-medium mb-2">FREE Tier Limits:</div>
                  <div>• CricketData.org: 25 requests/minute, 100/day</div>
                  <div>• Cache timeout: 10 minutes (longer to save requests)</div>
                  <div>• Auto-refresh interval: 2 minutes (slower to conserve)</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">FREE API Key Setup</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-2">To add your FREE API key:</div>
                  <div className="space-y-1">
                    <div>1. Sign up FREE at <code className="bg-blue-100 px-2 py-1 rounded">cricketdata.org/member.aspx</code></div>
                    <div>2. Get your FREE API key (100 requests/day)</div>
                    <div>3. Add to <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code> or <code className="bg-blue-100 px-2 py-1 rounded">apiKeys.js</code></div>
                    <div>4. Only 1 key needed for FREE tier</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Environment Variables</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-700">
                  <div className="font-medium mb-2">FREE tier environment setup:</div>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# .env.local (FREE TIER)
VITE_CRICKETDATA_FREE_KEY=your_free_cricketdata_key_here`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
