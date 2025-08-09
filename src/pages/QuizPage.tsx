import React from 'react';
import { BookOpen } from 'lucide-react';
import Quiz from '../components/Quiz';

const QuizPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <BookOpen size={32} className="text-purple-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Cricket Quiz
        </h1>
        <p className="text-xl text-gray-600">
          Test your knowledge of cricket history, records, and players
        </p>
      </div>

      <Quiz />
    </div>
  );
};

export default QuizPage;