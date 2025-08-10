import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, Wifi, WifiOff, Loader, AlertCircle } from 'lucide-react';
import { quizData } from '../data/quizData';
import useCricketData from '../hooks/useCricketData';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [useRealTimeQuiz, setUseRealTimeQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get real-time data for enhanced quiz questions
  const { data: liveMatches, loading: matchesLoading } = useCricketData.useLiveMatches();
  const { data: rankings, loading: rankingsLoading } = useCricketData.useRankings();

  useEffect(() => {
    // Generate enhanced quiz with real-time data
    const generateEnhancedQuiz = () => {
      let enhancedQuestions = [...quizData];

      // Add real-time questions if data is available
      if (liveMatches && liveMatches.length > 0) {
        const liveMatchQuestion = {
          question: `Which teams are currently playing in one of today's live matches?`,
          options: [
            `${liveMatches[0]?.team1} vs ${liveMatches[0]?.team2}`,
            "Australia vs England",
            "India vs Pakistan", 
            "South Africa vs New Zealand"
          ],
          correctAnswer: 0,
          explanation: `This is based on current live cricket matches happening today.`,
          isRealTime: true
        };
        enhancedQuestions.push(liveMatchQuestion);
        setUseRealTimeQuiz(true);
      }

      if (rankings && rankings.length > 0) {
        const rankingQuestion = {
          question: "Which team is currently ranked #1 in recent cricket rankings?",
          options: [
            rankings[0]?.team || "Australia",
            "India",
            "England",
            "Pakistan"
          ],
          correctAnswer: 0,
          explanation: "This is based on the latest cricket team rankings.",
          isRealTime: true
        };
        enhancedQuestions.push(rankingQuestion);
        setUseRealTimeQuiz(true);
      }

      setQuestions(enhancedQuestions);
      setAnsweredQuestions(new Array(enhancedQuestions.length).fill(false));
      setLoading(false);
    };

    if (!matchesLoading && !rankingsLoading) {
      generateEnhancedQuiz();
    }
  }, [liveMatches, rankings, matchesLoading, rankingsLoading]);

  useEffect(() => {
    // Load saved quiz score from localStorage
    const savedScore = localStorage.getItem('cricket-quiz-best-score');
    if (savedScore) {
      console.log('Best score:', savedScore);
    }
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    if (answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
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
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Loader className="animate-spin h-8 w-8 mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Preparing your cricket quiz...</p>
          <p className="text-sm text-gray-500 mt-2">
            {useRealTimeQuiz ? 'Adding live cricket questions...' : 'Loading questions...'}
          </p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const bestScore = localStorage.getItem('cricket-quiz-best-score');
    
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <div className="text-6xl font-bold text-green-600 mb-2">{score}/{questions.length}</div>
            <div className="text-xl text-gray-600 mb-4">{percentage}% Correct</div>
            
            {useRealTimeQuiz && (
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-3">
                <Wifi size={14} className="mr-1" />
                Enhanced with Live Data
              </div>
            )}
            
            {bestScore && (
              <div className="inline-flex items-center px-4 py-2 bg-yellow-50 rounded-lg">
                <Trophy size={16} className="text-yellow-500 mr-2" />
                <span className="text-sm text-yellow-700">
                  Best Score: {bestScore}/{questions.length}
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

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <AlertCircle size={64} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Available</h2>
          <p className="text-gray-600">Unable to load quiz questions. Please try again later.</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              {useRealTimeQuiz && question.isRealTime && (
                <span className="ml-2 inline-flex items-center px-2 py-1 bg-green-500 rounded-full text-xs">
                  <Wifi size={10} className="mr-1" />
                  Live
                </span>
              )}
            </div>
            <span className="text-sm font-medium">Score: {score}/{questions.length}</span>
          </div>
          <div className="w-full bg-green-500 rounded-full h-2 mt-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
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
                {question.isRealTime && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    <Wifi size={10} className="mr-1" />
                    Live Data
                  </span>
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
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Quiz Notice */}
      {useRealTimeQuiz && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Wifi size={20} className="text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Enhanced Quiz Experience</span>
          </div>
          <p className="text-blue-700 text-sm">
            This quiz includes real-time cricket questions based on current matches and rankings!
          </p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
