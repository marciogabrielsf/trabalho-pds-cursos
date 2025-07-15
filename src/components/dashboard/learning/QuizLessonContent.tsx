import React, { useState } from "react";
import { motion } from "framer-motion";
import { QuizLesson } from "@/types/lesson";
import { CheckCircle, XCircle, Clock, Award, RotateCcw } from "lucide-react";

interface QuizLessonContentProps {
    lesson: QuizLesson;
    onLessonComplete: (moduleId: string, lessonId: string) => void;
}

const QuizLessonContent: React.FC<QuizLessonContentProps> = ({ lesson, onLessonComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const questions = lesson.content?.questions || [];
    const totalQuestions = questions.length;

    const handleAnswerSelect = (answer: string) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answer;
        setSelectedAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calcular pontuação
            const correctAnswers = questions.filter(
                (q, index) => q.correctAnswer === selectedAnswers[index]
            ).length;
            setScore(correctAnswers);
            setShowResults(true);

            // Marcar como concluído se passou (70% ou mais)
            if (correctAnswers / totalQuestions >= 0.7) {
                onLessonComplete(lesson.moduleId?.toString() || "", lesson.id.toString());
            }
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setScore(0);
    };

    const getScoreColor = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage >= 70) return "text-green-600";
        if (percentage >= 50) return "text-highlight";
        return "text-red-500";
    };

    const getScoreMessage = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage >= 70) return "Excelente! Você demonstrou um ótimo conhecimento!";
        if (percentage >= 50) return "Bom trabalho! Com mais estudo você pode melhorar ainda mais.";
        return "Continue estudando! O conhecimento é uma jornada contínua.";
    };

    if (totalQuestions === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-highlight to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {lesson.order}. {lesson.title}
                </h2>
                <p className="text-gray-600">Este quiz não possui questões disponíveis.</p>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            {lesson.order}. {lesson.title}
                        </h2>
                        {lesson.description && (
                            <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                {lesson.description}
                            </p>
                        )}
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-highlight to-secondary rounded-full flex items-center justify-center ml-6">
                        <Clock className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="flex items-center justify-between text-highlight bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-secondary">
                        <Award className="w-5 h-5 mr-2" />
                        <span className="font-medium">Quiz Interativo</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <span className="text-sm font-medium">{totalQuestions} questões</span>
                    </div>
                </div>
            </div>

            {/* Quiz Content */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-8">
                {!showResults ? (
                    <>
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-800">
                                    Questão {currentQuestion + 1} de {totalQuestions}
                                </span>
                                <div className="flex items-center bg-gray-200 text-black rounded-full px-4 py-2">
                                    <span className="text-sm font-medium text-secondary">
                                        {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}
                                        %
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-highlight to-secondary h-3 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                                    }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="mb-8">
                            <div className="bg-gradient-to-r from-secondary/10 to-highlight/10 rounded-lg p-6 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 leading-relaxed">
                                    {questions[currentQuestion].question}
                                </h3>
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                                            selectedAnswers[currentQuestion] === option
                                                ? "border-highlight bg-gradient-to-r from-highlight/10 to-secondary/10 shadow-lg"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                                                    selectedAnswers[currentQuestion] === option
                                                        ? "border-highlight bg-highlight"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                {selectedAnswers[currentQuestion] === option && (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <span className="text-gray-700 font-medium">
                                                {option}
                                            </span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                            <button
                                onClick={handlePrevQuestion}
                                disabled={currentQuestion === 0}
                                className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                            >
                                Anterior
                            </button>
                            <motion.button
                                onClick={handleNextQuestion}
                                disabled={!selectedAnswers[currentQuestion]}
                                className="flex items-center px-8 py-3 bg-gradient-to-r from-highlight to-secondary text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {currentQuestion === totalQuestions - 1
                                    ? "Finalizar Quiz"
                                    : "Próxima Questão"}
                            </motion.button>
                        </div>
                    </>
                ) : (
                    /* Results */
                    <motion.div
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-highlight to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                {score / totalQuestions >= 0.7 ? (
                                    <Award className="w-12 h-12 text-white" />
                                ) : (
                                    <XCircle className="w-12 h-12 text-white" />
                                )}
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                {score / totalQuestions >= 0.7 ? "Parabéns!" : "Não foi desta vez"}
                            </h3>
                            <p className="text-lg text-gray-600 mb-6">
                                Quiz finalizado com sucesso
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-secondary/10 to-highlight/10 rounded-xl p-6 mb-6">
                            <div className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
                                {score}/{totalQuestions}
                            </div>
                            <div className="text-lg text-gray-600 mb-2">
                                {Math.round((score / totalQuestions) * 100)}% de acertos
                            </div>
                            <p className="text-gray-700 font-medium">{getScoreMessage()}</p>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <motion.button
                                onClick={handleRestartQuiz}
                                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RotateCcw className="w-5 h-5 mr-2" />
                                Tentar Novamente
                            </motion.button>
                            {score / totalQuestions >= 0.7 && (
                                <motion.button
                                    onClick={() =>
                                        onLessonComplete(
                                            lesson.moduleId?.toString() || "",
                                            lesson.id.toString()
                                        )
                                    }
                                    className="flex items-center px-8 py-3 bg-gradient-to-r from-highlight to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Continuar Curso
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default QuizLessonContent;
