import React, { useState } from 'react';
import { useAPIHealth } from '../hooks/useCricketData.js';
import { Activity, CheckCircle, XCircle, Clock, Key, Database } from 'lucide-react';

const APIStatusDashboard = () => {
  const { healthStatus, loading, checkHealth, getUsageStats } = useAPIHealth();
  const [showDetails, setShowDetails] = useState(false);
  const [usageStats, setUsageStats] = useState(null);

  const handleCheckHealth = async () => {
    await checkHealth();
    const stats = getUsageStats();
    setUsageStats(stats);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">API Status</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          <button
            onClick={handleCheckHealth}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </div>
      </div>

      {/* API Health Status */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {Object.entries(healthStatus).map(([apiName, status]) => (
          <div key={apiName} className={`border rounded-lg p-4 ${getStatusColor(status.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {getStatusIcon(status.status)}
                <span className="ml-2 font-semibold capitalize">{apiName}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status.status)}`}>
                {status.status.toUpperCase()}
              </div>
            </div>
            {status.error && (
              <div className="text-sm mt-2 text-red-600">
                {status.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Usage Statistics */}
      {showDetails && usageStats && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Database className="mr-2" size={20} />
            Usage Statistics
          </h3>
          
          {Object.entries(usageStats).map(([apiName, stats]) => (
            <div key={apiName} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 capitalize mb-3 flex items-center">
                <Key className="mr-2" size={16} />
                {apiName} API Keys
              </h4>
              
              {Array.isArray(stats) ? (
                <div className="space-y-2">
                  {stats.map((keyStat, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Key {keyStat.keyIndex + 1}:</span>
                        <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                          {keyStat.key}
                        </span>
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <span className={keyStat.isBlocked ? 'text-red-600' : 'text-green-600'}>
                          {keyStat.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                        <span className="text-gray-600">
                          {keyStat.requestsThisMinute}/min
                        </span>
                        <span className="text-gray-600">
                          {keyStat.requestsToday}/day
                        </span>
                        {keyStat.errors > 0 && (
                          <span className="text-red-600">
                            {keyStat.errors} errors
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : apiName === 'cache' ? (
                <div className="text-sm text-gray-600">
                  <div>Cache entries: {stats.size}</div>
                  <div className="mt-2">
                    <details className="cursor-pointer">
                      <summary className="font-medium">Cache Keys ({stats.keys.length})</summary>
                      <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                        {stats.keys.map((key, index) => (
                          <div key={index} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {key}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No usage data available</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">System Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-700">Total APIs</div>
            <div className="text-blue-600">{Object.keys(healthStatus).length}</div>
          </div>
          <div>
            <div className="font-medium text-green-700">Healthy</div>
            <div className="text-green-600">
              {Object.values(healthStatus).filter(s => s.status === 'healthy').length}
            </div>
          </div>
          <div>
            <div className="font-medium text-red-700">Errors</div>
            <div className="text-red-600">
              {Object.values(healthStatus).filter(s => s.status === 'error').length}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Cache Size</div>
            <div className="text-gray-600">
              {usageStats?.cache?.size || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIStatusDashboard;
