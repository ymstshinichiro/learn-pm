'use client';

import { useState, useEffect } from 'react';

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  order: number;
};

type QuizProgress = {
  score: number;
  answeredQuestions: number[];
  incorrectQuestions: number[];
  currentQuestionIndex: number;
  lastUpdated: string;
};

export default function QuizSection({
  questions,
  lessonId
}: {
  questions: Question[];
  lessonId: number;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<Question[]>([]);

  const storageKey = `quiz-progress-lesson-${lessonId}`;

  // Load progress from LocalStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      const progress: QuizProgress = JSON.parse(savedProgress);
      setScore(progress.score);
      setAnsweredQuestions(progress.answeredQuestions);
      setIncorrectQuestions(progress.incorrectQuestions);
      // Restore question index, but cap it to valid range
      const validIndex = Math.min(progress.currentQuestionIndex || 0, questions.length - 1);
      setCurrentQuestionIndex(validIndex);
    }
  }, [storageKey, questions.length]);

  // Save progress to LocalStorage
  const saveProgress = (newScore: number, newAnswered: number[], newIncorrect: number[], questionIndex: number) => {
    const progress: QuizProgress = {
      score: newScore,
      answeredQuestions: newAnswered,
      incorrectQuestions: newIncorrect,
      currentQuestionIndex: questionIndex,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(progress));
  };

  const currentQuestions = reviewMode ? reviewQuestions : questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
  const totalQuestions = questions.length;
  const correctRate = answeredQuestions.length > 0
    ? Math.round((score / answeredQuestions.length) * 100)
    : 0;

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    let newScore = score;
    let newAnswered = [...answeredQuestions];
    let newIncorrect = [...incorrectQuestions];

    if (!answeredQuestions.includes(currentQuestion.id)) {
      newAnswered.push(currentQuestion.id);
      if (isCorrect) {
        newScore = score + 1;
      } else {
        if (!incorrectQuestions.includes(currentQuestion.id)) {
          newIncorrect.push(currentQuestion.id);
        }
      }
      setScore(newScore);
      setAnsweredQuestions(newAnswered);
      setIncorrectQuestions(newIncorrect);
      saveProgress(newScore, newAnswered, newIncorrect, currentQuestionIndex);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setShowResult(false);
      // Save the new index when moving to next question
      saveProgress(score, answeredQuestions, incorrectQuestions, nextIndex);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setIncorrectQuestions([]);
    setReviewMode(false);
    localStorage.removeItem(storageKey);
  };

  const handleStartReview = () => {
    const incorrects = questions.filter(q => incorrectQuestions.includes(q.id));
    setReviewQuestions(incorrects);
    setReviewMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleExitReview = () => {
    setReviewMode(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Stats Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-600">正解数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">{answeredQuestions.length}</div>
            <div className="text-xs text-gray-600">回答済み</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{correctRate}%</div>
            <div className="text-xs text-gray-600">正答率</div>
          </div>
        </div>
      </div>

      {/* Review Mode Banner */}
      {reviewMode && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <div className="font-semibold text-orange-900">復習モード</div>
            <div className="text-sm text-orange-700">間違えた問題を再チャレンジ</div>
          </div>
          <button
            onClick={handleExitReview}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
          >
            通常モードに戻る
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          問題 {currentQuestionIndex + 1} / {currentQuestions.length}
          {reviewMode && ` (復習)`}
        </span>
        <span>
          全体: {answeredQuestions.length} / {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            reviewMode ? 'bg-orange-600' : 'bg-blue-600'
          }`}
          style={{
            width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;

            let optionClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';

            if (!showResult) {
              optionClass += isSelected
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50';
            } else {
              if (isCorrectOption) {
                optionClass += 'border-green-500 bg-green-50';
              } else if (isSelected && !isCorrect) {
                optionClass += 'border-red-500 bg-red-50';
              } else {
                optionClass += 'border-gray-200 bg-gray-50 opacity-50';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={optionClass}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3">
                    {showResult && isCorrectOption ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : showResult && isSelected && !isCorrect ? (
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{String.fromCharCode(65 + index)}</span>
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result & Explanation */}
      {showResult && (
        <div
          className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {isCorrect ? (
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <h4 className={`font-semibold mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '正解！' : '不正解'}
              </h4>
              {currentQuestion.explanation && (
                <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            回答する
          </button>
        ) : !isLastQuestion ? (
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            次の問題へ
          </button>
        ) : (
          <div className="flex-1 space-y-3">
            {/* Completion Stats */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center mb-3">
                <p className="text-2xl font-bold text-blue-900">
                  {reviewMode ? '復習完了！' : 'クイズ完了！'}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  スコア: {score} / {answeredQuestions.length} ({correctRate}%)
                </p>
              </div>

              {/* Detailed Stats */}
              {!reviewMode && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white rounded p-2 text-center">
                    <div className="font-semibold text-green-600">{score}</div>
                    <div className="text-xs text-gray-600">正解</div>
                  </div>
                  <div className="bg-white rounded p-2 text-center">
                    <div className="font-semibold text-red-600">{incorrectQuestions.length}</div>
                    <div className="text-xs text-gray-600">不正解</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {!reviewMode && incorrectQuestions.length > 0 && (
                <button
                  onClick={handleStartReview}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  間違えた問題を復習 ({incorrectQuestions.length}問)
                </button>
              )}
              <button
                onClick={handleReset}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                最初からやり直す
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
