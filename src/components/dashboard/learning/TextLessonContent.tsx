import React from "react";
import { motion } from "framer-motion";
import { TextLesson } from "@/types/lesson";

interface TextLessonContentProps {
    lesson: TextLesson;
    onLessonComplete: (moduleId: string, lessonId: string) => void;
}

const TextLessonContent: React.FC<TextLessonContentProps> = ({ lesson, onLessonComplete }) => {
    const handleMarkComplete = () => {
        onLessonComplete(lesson.moduleId?.toString() || "", lesson.id.toString());
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {lesson.order}. {lesson.title}
                </h2>
                {lesson.description && <p className="text-gray-600 mb-4">{lesson.description}</p>}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                        <span className="mr-2">📝</span>
                        Tipo: Conteúdo Textual
                    </span>
                    <button
                        onClick={handleMarkComplete}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        Marcar como concluído
                    </button>
                </div>
            </div>

            {/* Text Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="prose max-w-none">
                    {lesson.content?.text ? (
                        <div className="text-gray-700 leading-relaxed">
                            {lesson.content.text.split("\n").map((paragraph, index) => (
                                <p key={index} className="mb-4 text-justify">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">📄</div>
                            <p className="text-gray-600">Conteúdo textual não disponível</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reading Progress */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Leitura em progresso</span>
                    </div>
                    <span className="text-xs text-gray-500">
                        {lesson.content?.text
                            ? `${lesson.content.text.split(" ").length} palavras`
                            : "Sem conteúdo"}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default TextLessonContent;
