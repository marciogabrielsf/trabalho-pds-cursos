import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import CourseContents from "./CourseContents";
import VideoLessonContent from "./VideoLessonContent";
import TextLessonContent from "./TextLessonContent";
import QuizLessonContent from "./QuizLessonContent";
import {
    Classroom,
    CourseDetailsHorizontal,
    DashboardHeader,
    Sidebar,
    TabNavigator,
} from "@/components";
import { useCourseLearningQuery } from "@/hooks/useCourseQuery";
import { useLessonQuery } from "@/hooks/useLessonQuery";
import { TextLesson, VideoLesson, QuizLesson } from "@/types/lesson";

const CourseLearningPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("videos");

    const courseId = Number(params.id);
    const {
        data: courseLearningData,
        isLoading,
        error,
        isError,
    } = useCourseLearningQuery(courseId);

    // Estados para controlar UI
    const [expandedModules, setExpandedModules] = useState<string[]>(["1"]);
    const currentLessonId = Number(useParams().lessonId?.toString());
    const {
        data: lessonData,
        isLoading: isLessonLoading,
        error: lessonError,
    } = useLessonQuery(currentLessonId);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar activeItem="my-courses" onItemClick={() => {}} />
                <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                    <DashboardHeader />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Carregando curso...
                            </h1>
                            <p className="text-gray-600">
                                Aguarde enquanto carregamos as informações do curso.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !courseLearningData) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar activeItem="my-courses" onItemClick={() => {}} />
                <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                    <DashboardHeader />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {error?.message || "Curso não encontrado"}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {error?.message
                                    ? "Ocorreu um erro ao carregar o curso."
                                    : "O curso que você está procurando não existe."}
                            </p>
                            <button
                                onClick={() => router.back()}
                                className="text-orange-500 hover:text-orange-600"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Configurações de animação
    const springConfig = {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
    };

    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: springConfig,
        },
    };

    const handleToggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
        );
    };

    const handleLessonClick = (moduleId: string, lessonId: string) => {
        console.log(`Clicked lesson ${lessonId} in module ${moduleId}`);
    };

    const handleLessonComplete = (moduleId: string, lessonId: string) => {
        console.log(`Complete lesson ${lessonId} in module ${moduleId}`);
    };

    const renderLessonContent = () => {
        if (isLessonLoading) {
            return (
                <div className="max-w-4xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded-md mb-6"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded-md"></div>
                            <div className="h-4 bg-gray-200 rounded-md"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                        </div>
                    </div>
                </div>
            );
        }

        if (lessonError) {
            return (
                <div className="max-w-4xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar aula</h2>
                    <p className="text-red-600">
                        {lessonError.message || "Ocorreu um erro ao carregar o conteúdo da aula."}
                    </p>
                </div>
            );
        }

        if (!lessonData) {
            return (
                <div className="max-w-4xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Selecione uma aula</h2>
                    <p className="text-gray-600">
                        Escolha uma aula na barra lateral para visualizar o conteúdo.
                    </p>
                </div>
            );
        }

        // Renderizar componente baseado no tipo da aula
        switch (lessonData.type) {
            case "VIDEO":
                return (
                    <VideoLessonContent
                        lesson={lessonData as VideoLesson}
                        onLessonComplete={handleLessonComplete}
                    />
                );
            case "TEXT":
                return (
                    <TextLessonContent
                        lesson={lessonData as TextLesson}
                        onLessonComplete={handleLessonComplete}
                    />
                );
            case "QUIZ":
                return (
                    <QuizLessonContent
                        lesson={lessonData as QuizLesson}
                        onLessonComplete={handleLessonComplete}
                    />
                );
            default:
                return (
                    <div className="max-w-4xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Tipo de aula não suportado
                        </h2>
                        <p className="text-gray-600">
                            Este tipo de aula não é suportado pelo sistema.
                        </p>
                    </div>
                );
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "videos":
                return (
                    <div className="flex-1 flex">
                        {/* Main Content */}
                        <div className="flex-[0.7] flex flex-col">
                            {/* Lesson Content based on type */}
                            <motion.div className="flex-1 p-6" variants={itemVariants}>
                                {renderLessonContent()}
                            </motion.div>
                        </div>

                        {/* Sidebar - Course Contents */}
                        <motion.div
                            className="w-96 flex-[0.3] bg-white border-l border-gray-200 p-6"
                            variants={itemVariants}
                        >
                            <CourseContents
                                modules={courseLearningData.course_data.modules}
                                progress={15}
                                onLessonClick={handleLessonClick}
                                onToggleModule={handleToggleModule}
                                onLessonComplete={handleLessonComplete}
                                expandedModules={expandedModules}
                                currentLesson={lessonData}
                            />
                        </motion.div>
                    </div>
                );
            case "classroom":
                return (
                    <div className="flex-1 ">
                        <Classroom
                            courseTitle={courseLearningData.title}
                            instructor={courseLearningData.teacher_name}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeItem="my-courses" onItemClick={() => {}} />

            <motion.div
                className="flex-1 flex flex-col  h-screen overflow-y-auto"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                <DashboardHeader />

                <div className="px-6">
                    <CourseDetailsHorizontal courseLearningData={courseLearningData} />

                    {/* Tab Navigator */}
                    <motion.div variants={itemVariants}>
                        <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
                    </motion.div>

                    {/* Tab Content */}
                    {renderTabContent()}
                </div>
            </motion.div>
        </div>
    );
};

export default CourseLearningPage;
