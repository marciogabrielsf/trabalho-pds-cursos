import React from "react";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface CourseModule {
    id: string;
    title: string;
    moduleNumber: number;
    lessonsCount: number;
    duration: string;
    completed: number;
    total: number;
    lessons: CourseLesson[];
    expanded?: boolean;
}

interface CourseLesson {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    current?: boolean;
}

interface CourseContentsProps {
    modules: CourseModule[];
    progress: number;
    onLessonClick: (moduleId: string, lessonId: string) => void;
    onToggleModule: (moduleId: string) => void;
    onLessonComplete?: (moduleId: string, lessonId: string) => void;
}

const CourseContents: React.FC<CourseContentsProps> = ({
    modules,
    progress,
    onLessonClick,
    onToggleModule,
    onLessonComplete,
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Course Contents</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600 font-medium">
                        {progress}% Completed
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Modules */}
            <div>
                {modules.map((module, index) => (
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
                            onClick={() => onToggleModule(module.id)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    animate={{ rotate: module.expanded ? 180 : 0 }}
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
                                    <span>Módulo {module.moduleNumber}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-500">
                                    <Clock className="text-secondary" size={14} />
                                    <span className="text-xs">{module.lessonsCount} Aulas</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-500">
                                    <CheckCircle className="text-green-600" size={14} />
                                    <span className="text-xs">
                                        ({module.completed}/{module.total})
                                    </span>
                                </div>
                            </div>
                        </button>

                        {/* Module Content */}
                        <motion.div
                            initial={false}
                            animate={{ height: module.expanded ? "auto" : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 space-y-2">
                                {module.lessons.map((lesson, lessonIndex) => (
                                    <div
                                        key={lesson.id}
                                        className={`flex items-center space-x-3 p-3  transition-all duration-200 cursor-pointer ${
                                            lesson.current
                                                ? "bg-orange-50 border border-orange-200"
                                                : "hover:bg-gray-50"
                                        }`}
                                        onClick={() => onLessonClick(module.id, lesson.id)}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={lesson.completed}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    onLessonComplete?.(module.id, lesson.id);
                                                }}
                                                className="w-4 h-4 text-orange-500 border-gray-300  focus:ring-orange-500 focus:ring-2"
                                            />
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className={`text-sm font-medium ${
                                                        lesson.current
                                                            ? "text-orange-600"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {lessonIndex + 1}. {lesson.title}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {lesson.duration}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default CourseContents;
