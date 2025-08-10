import React, { useState } from 'react';
import cricketDataService from '../services/CricketDataService.js';
import { Trophy, TrendingUp, RefreshCw, Calendar } from 'lucide-react';

const LiveSeriesWidget = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cricketDataService.getAllSeries(0);
      setSeries(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching series:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSeries();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="text-yellow-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Cricket Series</h2>
        </div>
        <button
          onClick={fetchSeries}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin h-6 w-6 text-green-600 mr-2" />
          <span className="text-gray-600">Loading series...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Failed to load series</div>
          <div className="text-sm text-gray-500 mb-4">{error}</div>
          <button
            onClick={fetchSeries}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Try again
          </button>
        </div>
      ) : series && series.length > 0 ? (
        <div className="space-y-3">
          {series.slice(0, 10).map((seriesItem, index) => (
            <div key={seriesItem.id || index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                index === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-blue-50 text-blue-600'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {seriesItem.name || `Series ${index + 1}`}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {seriesItem.startDate && seriesItem.endDate ? (
                    <span>{seriesItem.startDate} - {seriesItem.endDate}</span>
                  ) : (
                    <span>Dates TBD</span>
                  )}
                  {(seriesItem.odi > 0 || seriesItem.t20 > 0 || seriesItem.test > 0) && (
                    <span className="ml-3">
                      {seriesItem.test > 0 && `${seriesItem.test} Test`}
                      {seriesItem.odi > 0 && `${seriesItem.odi} ODI`}
                      {seriesItem.t20 > 0 && `${seriesItem.t20} T20`}
                    </span>
                  )}
                </div>
              </div>
              
              {seriesItem.squads && (
                <div className="flex items-center text-sm text-blue-600">
                  <TrendingUp size={14} className="mr-1" />
                  {seriesItem.squads} teams
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No series data available
        </div>
      )}
    </div>
  );
};

export default LiveSeriesWidget;
