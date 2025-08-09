import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { useQuiz } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';

const Quiz: React.FC = () => {
  const { questions, loading: questionsLoading, saveQuizScore, getBestScore } = useQuiz();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    if (questions.length > 0) {
      setAnsweredQuestions(new Array(questions.length).fill(false));
    }
  }, [questions]);

  useEffect(() => {
    if (user) {
      loadBestScore();
    }
  }, [user]);

  const loadBestScore = async () => {
    const best = await getBestScore();
    setBestScore(best?.score || null);
  };

  if (questionsLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600">No quiz questions available.</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (answerIndex === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      
      // Save score to database if user is authenticated
      if (user) {
        await saveQuizScore(score, questions.length);
        if (!bestScore || score > bestScore) {
          setBestScore(score);
        }
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

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <div className="text-6xl font-bold text-green-600 mb-2">{score}/{questions.length}</div>
            <div className="text-xl text-gray-600 mb-4">{percentage}% Correct</div>
            
            {bestScore !== null && (
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

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
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
                if (index === question.correct_answer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (index === selectedAnswer && selectedAnswer !== question.correct_answer) {
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
                        {index === question.correct_answer && (
                          <CheckCircle size={20} className="text-green-600" />
                        )}
                        {index === selectedAnswer && selectedAnswer !== question.correct_answer && (
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
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;