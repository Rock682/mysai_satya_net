import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MockExam, Question, UserAnswer } from '../types';
import { AcademicCapIcon, ArrowLeftIcon, ClockIcon } from './IconComponents';
import { mockExamsData, questionsData } from '../data/mockExams';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const MockTestsPage: React.FC = () => {
    const [selectedExam, setSelectedExam] = useState<MockExam | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTestFinished, setIsTestFinished] = useState(false);
    const timerRef = useRef<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categorizedExams = useMemo(() => {
        return mockExamsData
            .filter(exam => exam.published === 'TRUE')
            .reduce((acc, exam) => {
                const type = exam.examType || 'Other';
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(exam);
                return acc;
            }, {} as Record<string, MockExam[]>);
    }, []);
    
    const activeQuestions = useMemo(() => {
        if (!selectedExam) return [];
        return questionsData.filter(q => q.examId === selectedExam.examId);
    }, [selectedExam]);

    const handleTestSubmit = useCallback(() => {
        setIsTestFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (selectedExam && !isTestFinished) {
            setTimeLeft(selectedExam.durationMinutes * 60);
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        handleTestSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [selectedExam, isTestFinished, handleTestSubmit]);

    const handleSelectExam = (exam: MockExam) => {
        setSelectedExam(exam);
        setActiveQuestionIndex(0);
        setIsTestFinished(false);
        const initialAnswers: Record<number, UserAnswer> = {};
        questionsData.filter(q => q.examId === exam.examId).forEach(q => {
            initialAnswers[q.questionId] = { questionId: q.questionId, selectedOption: null, status: 'unanswered' };
        });
        setUserAnswers(initialAnswers);
    };

    const handleAnswerSelect = (questionId: number, selectedOption: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: { ...prev[questionId], selectedOption, status: 'answered' }
        }));
    };
    
    const handleBackToExamList = () => {
        setSelectedExam(null);
        setIsTestFinished(false);
        setUserAnswers({});
        setActiveQuestionIndex(0);
        setTimeLeft(0);
        // Do not reset selectedCategory, so user returns to the test list
    };

    if (isTestFinished && selectedExam) {
        const results = activeQuestions.reduce((acc, q) => {
            const userAnswer = userAnswers[q.questionId];
            if (userAnswer?.selectedOption === q.correctAnswer) {
                acc.correct++;
            } else if (userAnswer?.status === 'answered') {
                acc.incorrect++;
            } else {
                acc.unanswered++;
            }
            return acc;
        }, { correct: 0, incorrect: 0, unanswered: 0 });

        const score = results.correct - (results.incorrect * selectedExam.negativeMarking);

        return (
            <div className="bg-white dark:bg-slate-800 max-w-4xl mx-auto p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm animate-fade-in-up">
                <h1 className="text-2xl font-bold text-center mb-4">Test Results: {selectedExam.examName}</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                    <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{score.toFixed(2)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                    </div>
                     <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{results.correct}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                    </div>
                     <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">{results.incorrect}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
                    </div>
                     <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{results.unanswered}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Unanswered</div>
                    </div>
                </div>
                <div className="text-center">
                    <button onClick={handleBackToExamList} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700">Back to Exam List</button>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Review Answers</h2>
                    {activeQuestions.map((q, index) => {
                        const userAnswer = userAnswers[q.questionId];
                        const isCorrect = userAnswer?.selectedOption === q.correctAnswer;
                        return (
                            <div key={q.questionId} className="mb-6 p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                                <p className="font-semibold mb-2">{index + 1}. {q.questionText}</p>
                                {q.imageUrl && <img src={q.imageUrl} alt="Question figure" className="my-2 rounded-md border dark:border-slate-700 max-h-60" loading="lazy" />}
                                <p className="mt-2"><strong>Your Answer:</strong> <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{userAnswer?.selectedOption ? `${userAnswer.selectedOption} (${q[`option${userAnswer.selectedOption}` as keyof Question]})` : 'Not Answered'}</span></p>
                                <p className="mt-1 text-green-600 dark:text-green-400"><strong>Correct Answer:</strong> {q.correctAnswer} ({q[`option${q.correctAnswer}` as keyof Question]})</p>
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md border border-gray-200 dark:border-slate-600">
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">Explanation:</p>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{q.explanation || 'No explanation available.'}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (selectedExam) {
        const currentQuestion = activeQuestions[activeQuestionIndex];

        if (!currentQuestion) {
            return (
                <div className="bg-white dark:bg-slate-800 max-w-4xl mx-auto p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm animate-fade-in-up text-center">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Exam Unavailable</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        We're sorry, but the questions for this exam could not be loaded. Please try another test.
                    </p>
                    <button 
                        onClick={handleBackToExamList} 
                        className="mt-6 inline-flex items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Exam List
                    </button>
                </div>
            );
        }
        
        return (
            <div className="bg-white dark:bg-slate-800 max-w-7xl mx-auto p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2 border-b dark:border-slate-700 pb-2 mb-3">
                    <h1 className="text-base font-bold flex-1 min-w-0">{selectedExam.examName}</h1>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                         <div className="flex items-center text-sm text-red-600 dark:text-red-400 font-semibold">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                        <button onClick={handleTestSubmit} className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-red-700">Submit</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                        <h2 className="font-semibold mb-2">Question {activeQuestionIndex + 1} of {activeQuestions.length}</h2>
                        <p className="mb-4 whitespace-pre-wrap">{currentQuestion.questionText}</p>
                        {currentQuestion.imageUrl && <img src={currentQuestion.imageUrl} alt="Question figure" className="my-4 rounded-md border dark:border-slate-700 max-h-60" loading="lazy" />}
                        <div className="space-y-3">
                            {['A', 'B', 'C', 'D'].map(opt => (
                                <label key={opt} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 dark:border-slate-700">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.questionId}`}
                                        value={opt}
                                        checked={userAnswers[currentQuestion.questionId]?.selectedOption === opt}
                                        onChange={() => handleAnswerSelect(currentQuestion.questionId, opt)}
                                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                                    />
                                    <span className="ml-3 text-gray-700 dark:text-gray-300">{currentQuestion[`option${opt}` as keyof Question]}</span>
                                </label>
                            ))}
                        </div>

                         <div className="flex justify-between mt-6">
                            <button onClick={() => setActiveQuestionIndex(p => Math.max(0, p - 1))} disabled={activeQuestionIndex === 0} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md disabled:opacity-50">Previous</button>
                            <button onClick={() => setActiveQuestionIndex(p => Math.min(activeQuestions.length - 1, p + 1))} disabled={activeQuestionIndex === activeQuestions.length - 1} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md disabled:opacity-50">Next</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Question Palette</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {activeQuestions.map((q, index) => (
                                <button
                                    key={q.questionId}
                                    onClick={() => setActiveQuestionIndex(index)}
                                    className={`w-10 h-10 rounded text-sm flex items-center justify-center 
                                        ${index === activeQuestionIndex ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 
                                        userAnswers[q.questionId]?.status === 'answered' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-slate-700'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCategory) {
        const examsForCategory = categorizedExams[selectedCategory] || [];
        return (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <div className="mb-6">
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        aria-label="Back to exam categories"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Categories
                    </button>
                </div>

                <section>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-green-200 dark:border-green-800 pb-3">
                        {selectedCategory} Mock Tests
                    </h2>
                    {examsForCategory.length > 0 ? (
                        <div className="space-y-4">
                            {examsForCategory.map(exam => (
                                <div key={exam.examId} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{exam.examName}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            <span>{exam.totalQuestions} Questions</span>
                                            <span>{exam.durationMinutes} Minutes</span>
                                            <span>Negative Marking: {exam.negativeMarking}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleSelectExam(exam)} className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 transition-colors flex-shrink-0 w-full sm:w-auto">Start Test</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-center text-gray-500 dark:text-gray-400 py-8">No mock tests available for this category yet.</p>
                    )}
                </section>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center mb-12">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-green-600" />
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">Online Mock Tests</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                    Select a category to begin your practice session.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {Object.keys(categorizedExams).sort().map(category => (
                    <div 
                        key={category} 
                        onClick={() => setSelectedCategory(category)}
                        className="group relative bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm text-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:border-green-400 dark:hover:border-green-500 hover:-translate-y-2 overflow-hidden"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedCategory(category)}
                        aria-label={`Select ${category} exams`}
                    >
                        <div className="absolute top-0 right-0 h-16 w-16 bg-green-50 dark:bg-green-900/20 rounded-bl-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-in-out"></div>
                        <div className="relative">
                            <AcademicCapIcon className="mx-auto h-10 w-10 text-green-500 mb-4 transition-transform group-hover:scale-110" />
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{category} Exams</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Practice tests for {category} competitive exams.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MockTestsPage;