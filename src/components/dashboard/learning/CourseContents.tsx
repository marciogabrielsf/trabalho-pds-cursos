import React from "react";
import { BookOpen, CheckCircle, Clock, Play, FileText, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Module } from "@/types/module";
import { Lesson, LessonType } from "@/types/lesson";

interface CourseContentsProps {
    modules: Module[];
    progress?: number;
    onLessonClick: (moduleId: string, lessonId: string) => void;
    onToggleModule: (moduleId: string) => void;
    onLessonComplete?: (moduleId: string, lessonId: string) => void;
    expandedModules?: string[];
    currentLesson?: Lesson;
    isTeacher?: boolean;
}

const getLessonURL = (moduleId: string, lessonId: string, isTeacher: boolean) => {
    if (isTeacher) {
        return `/dashboard/teacher/course/${moduleId}/lesson/${lessonId}`;
    }

    return `/dashboard/student/my-courses/${moduleId}/lesson/${lessonId}`;
};

const getLessonIcon = (type: LessonType) => {
    switch (type) {
        case "VIDEO":
            return <Play className="w-4 h-4 text-highlight" />;
        case "QUIZ":
            return <HelpCircle className="w-4 h-4 text-secondary" />;
        case "TEXT":
            return <FileText className="w-4 h-4 text-gray-600" />;
        default:
            return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
};

const CourseContents: React.FC<CourseContentsProps> = ({
    modules,
    progress = 0,
    onToggleModule,
    onLessonComplete,
    expandedModules = [],
    currentLesson,
    isTeacher = false,
}) => {
    const itemVariants = {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20,
            },
        },
    };

    return (
        <motion.div
            className="bg-white rounded-lg sticky top-5 shadow-sm border border-gray-200 p-6"
            variants={itemVariants}
        >
            {/* Progress Bar */}

            {!isTeacher && (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Course Contents</h2>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-green-600 font-medium">
                                {progress}% Completed
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Modules */}
            <div>
                {modules.map((module, index) => {
                    const isExpanded = expandedModules.includes(module.id.toString());

                    return (
                        <motion.div
                            key={module.id}
                            className="-mx-6 overflow-hidden"
                            variants={itemVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Module Header */}
                            <button
                                onClick={() => onToggleModule(module.id.toString())}
                                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            className="text-gray-400"
                                        >
                                            <path
                                                d="M4 6L8 10L12 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </motion.div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {module.title}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                        <BookOpen size={14} className="text-highlight" />
                                        <span>Módulo {module.order}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-500">
                                        <Clock className="text-secondary" size={14} />
                                        <span className="text-xs">
                                            {module.lesson_quantity} Aulas
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-500">
                                        <CheckCircle className="text-green-600" size={14} />
                                        <span className="text-xs">
                                            (0/{module.lesson_quantity})
                                        </span>
                                    </div>
                                </div>
                            </button>

                            {/* Module Content */}
                            <motion.div
                                initial={false}
                                animate={{ height: isExpanded ? "auto" : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 space-y-2">
                                    {module.lessons?.map((lesson) => {
                                        const isCurrentLesson = currentLesson?.id === lesson.id;

                                        return (
                                            <a
                                                href={getLessonURL(
                                                    module.id.toString(),
                                                    lesson.id.toString(),
                                                    isTeacher
                                                )}
                                                key={lesson.id}
                                                className={`flex items-center space-x-3 p-3 transition-all duration-200   ${
                                                    isCurrentLesson
                                                        ? "bg-orange-50 border border-orange-200"
                                                        : "hover:bg-gray-50"
                                                }`}
                                            >
                                                {!isTeacher && (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={false} // Será baseado no progresso do usuário
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                onLessonComplete?.(
                                                                    module.id.toString(),
                                                                    lesson.id.toString()
                                                                );
                                                            }}
                                                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500 focus:ring-2"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`text-sm font-medium ${
                                                                isCurrentLesson
                                                                    ? "text-orange-600"
                                                                    : "text-gray-900"
                                                            }`}
                                                        >
                                                            {lesson.order}. {lesson.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {getLessonIcon(lesson.type)}
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default CourseContents;
