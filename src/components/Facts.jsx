import React, { useState, useEffect } from 'react';
import { RefreshCw, Lightbulb, Wifi, WifiOff, Clock, TrendingUp, Users } from 'lucide-react';
import factsData from '../data/facts.json';
import { useCricketData } from '../hooks/useCricketData';

const Facts = () => {
  const [currentFact, setCurrentFact] = useState('');
  const [previousFact, setPreviousFact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isRealTimeFact, setIsRealTimeFact] = useState(false);

  // Get real-time data to generate live facts
  const { data: liveMatches, loading: matchesLoading } = useCricketData.useLiveMatches();
  const { data: rankings, loading: rankingsLoading } = useCricketData.useRankings();

  useEffect(() => {
    // Combine static facts with real-time facts
    const generateEnhancedFacts = () => {
      let enhancedFacts = [...factsData];

      // Add real-time facts based on live data
      if (liveMatches && liveMatches.length > 0) {
        const liveMatchFacts = [
          `Right now, there are ${liveMatches.length} live cricket matches being played around the world!`,
          `${liveMatches[0]?.team1} is currently playing against ${liveMatches[0]?.team2} in a live match.`,
          `Cricket fans are following ${liveMatches.length} different matches simultaneously today.`
        ];
        enhancedFacts.push(...liveMatchFacts);
      }

      if (rankings && rankings.length > 0) {
        const rankingFacts = [
          `The current #1 ranked cricket team is ${rankings[0]?.team || 'Australia'} according to latest rankings.`,
          `There are ${rankings.length} teams currently active in international cricket rankings.`,
          `Cricket rankings are updated regularly based on recent match performances and series results.`
        ];
        enhancedFacts.push(...rankingFacts);
      }

      // Add some general real-time facts
      const currentTime = new Date();
      const timeBasedFacts = [
        `Cricket is being played somewhere in the world right now - it's currently ${currentTime.toLocaleTimeString()} in your timezone!`,
        `The cricket world never sleeps - while you're reading this, matches could be happening in different time zones.`,
        `Did you know? Cricket matches can span multiple days, with Test matches lasting up to 5 days!`
      ];
      enhancedFacts.push(...timeBasedFacts);

      setFacts(enhancedFacts);
    };

    generateEnhancedFacts();
  }, [liveMatches, rankings]);

  const getRandomFact = () => {
    setIsLoading(true);
    
    // Filter out the previous fact to avoid repetition
    const availableFacts = facts.filter(fact => fact !== previousFact);
    const randomIndex = Math.floor(Math.random() * availableFacts.length);
    const newFact = availableFacts[randomIndex];
    
    // Check if this is a real-time fact (not from original static data)
    const isRealTime = !factsData.includes(newFact);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setPreviousFact(currentFact);
      setCurrentFact(newFact);
      setIsRealTimeFact(isRealTime);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    // Load initial fact
    getRandomFact();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <Lightbulb size={32} className="text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cricket Facts</h1>
        <p className="text-gray-600">Discover amazing facts about cricket history and records</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-center">
            <Lightbulb size={24} className="mr-2" />
            <h2 className="text-xl font-semibold">Did You Know?</h2>
            {isRealTimeFact && (
              <span className="ml-3 inline-flex items-center px-2 py-1 bg-green-400 rounded-full text-xs">
                <Wifi size={12} className="mr-1" />
                Live
              </span>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <blockquote className="text-lg md:text-xl text-gray-800 leading-relaxed text-center font-medium">
              "{currentFact}"
            </blockquote>
            
            {isRealTimeFact && (
              <div className="flex items-center justify-center mt-4">
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <TrendingUp size={14} className="mr-1" />
                  Enhanced with Real-time Data
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={getRandomFact}
              disabled={isLoading}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              <RefreshCw size={20} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Get Another Fact'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Facts Counter */}
        <div className="text-center bg-white rounded-lg p-4 shadow-md">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
            <Lightbulb size={20} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{facts.length}</p>
          <p className="text-sm text-gray-600">Total Facts Available</p>
        </div>

        {/* Live Data Counter */}
        {liveMatches && liveMatches.length > 0 && (
          <div className="text-center bg-white rounded-lg p-4 shadow-md">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2">
              <Wifi size={20} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{liveMatches.length}</p>
            <p className="text-sm text-gray-600">Live Matches Now</p>
          </div>
        )}

        {/* Enhanced Content */}
        <div className="text-center bg-white rounded-lg p-4 shadow-md">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Real-time</p>
          <p className="text-sm text-gray-600">Enhanced Facts</p>
        </div>
      </div>
    </div>
  );
};

export default Facts;
