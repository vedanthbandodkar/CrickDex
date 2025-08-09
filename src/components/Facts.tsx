import React, { useState, useEffect } from 'react';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { useFacts } from '../hooks/useFacts';

const Facts: React.FC = () => {
  const { facts, loading, getRandomFact } = useFacts();
  const [currentFact, setCurrentFact] = useState<string>('');
  const [previousFactId, setPreviousFactId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRandomFact = () => {
    setIsLoading(true);
    
    const randomFact = getRandomFact(previousFactId);
    
    // Simulate loading for better UX
    setTimeout(() => {
      if (randomFact) {
        setPreviousFactId(randomFact.id);
        setCurrentFact(randomFact.fact);
      }
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (facts.length > 0 && !currentFact) {
      handleGetRandomFact();
    }
  }, [facts]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <Lightbulb size={32} className="text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cricket Facts</h1>
          <p className="text-gray-600">Loading amazing cricket facts...</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

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
          </div>
        </div>

        <div className="p-8">
          <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <blockquote className="text-lg md:text-xl text-gray-800 leading-relaxed text-center font-medium">
              "{currentFact}"
            </blockquote>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleGetRandomFact}
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

      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
          <Lightbulb size={16} className="text-blue-500 mr-2" />
          <span className="text-sm text-blue-700">
            Total facts available: {facts.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Facts;