import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { quizData } from '../data/quizData';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(quizData.length).fill(false)
  );

  useEffect(() => {
    // Load saved quiz score from localStorage
    const savedScore = localStorage.getItem('cricket-quiz-best-score');
    if (savedScore) {
      console.log('Best score:', savedScore);
    }
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (answerIndex === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      // Save best score to localStorage
      const bestScore = localStorage.getItem('cricket-quiz-best-score');
      if (!bestScore || score > parseInt(bestScore)) {
        localStorage.setItem('cricket-quiz-best-score', score.toString());
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setAnsweredQuestions(new Array(quizData.length).fill(false));
  };

  if (quizCompleted) {
    const percentage = Math.round((score / quizData.length) * 100);
    const bestScore = localStorage.getItem('cricket-quiz-best-score');
    
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <div className="text-6xl font-bold text-green-600 mb-2">{score}/{quizData.length}</div>
            <div className="text-xl text-gray-600 mb-4">{percentage}% Correct</div>
            
            {bestScore && (
              <div className="inline-flex items-center px-4 py-2 bg-yellow-50 rounded-lg">
                <Trophy size={16} className="text-yellow-500 mr-2" />
                <span className="text-sm text-yellow-700">
                  Best Score: {bestScore}/{quizData.length}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={resetQuiz}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RotateCcw size={20} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const question = quizData[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quizData.length}
            </span>
            <span className="text-sm font-medium">Score: {score}/{quizData.length}</span>
          </div>
          <div className="w-full bg-green-500 rounded-full h-2 mt-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all ";
              
              if (!showResult) {
                buttonClass += "border-gray-200 hover:border-green-300 hover:bg-green-50";
              } else {
                if (index === question.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <span>
                        {index === question.correctAnswer && (
                          <CheckCircle size={20} className="text-green-600" />
                        )}
                        {index === selectedAnswer && selectedAnswer !== question.correctAnswer && (
                          <XCircle size={20} className="text-red-600" />
                        )}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className={`flex items-center mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    <span className="font-medium">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="mr-2" />
                    <span className="font-medium">Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          )}

          {showResult && (
            <div className="mt-6 text-center">
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {currentQuestion < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;