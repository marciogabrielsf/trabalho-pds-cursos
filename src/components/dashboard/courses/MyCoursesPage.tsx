import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import CourseSearch from "./CourseSearch";
import MyCoursesList from "./MyCoursesList";
import { DashboardHeader, Sidebar } from "@/components";
import { useStudentCoursesQuery } from "@/hooks/useCourseQuery";
import { useAuthStore } from "@/stores/authStore";
import { Course } from "@/types/course";
import { CourseSkeleton } from "./index";

const MyCoursesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);

    const { user } = useAuthStore();
    const limit = 10;
    const offset = currentPage * limit;

    // Buscar cursos do estudante com TanStack Query
    const {
        data: courseData,
        isLoading,
        error,
        refetch,
    } = useStudentCoursesQuery(user?.id || 0, {
        search: searchQuery || undefined,
        limit,
        offset,
    });

    const courses = useMemo(() => courseData || [], [courseData]);

    // Filtrar cursos baseado na busca (filtro adicional local se necessário)
    const filteredCourses = useMemo(() => {
        if (!searchQuery.trim()) return courses;
        return courses.filter(
            (course) =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [courses, searchQuery]);

    // Função para lidar com mudanças na busca
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(0); // Reset para primeira página
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Erro ao carregar seus cursos</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/80"
                    >
                        Tentar novamente
                    </button>
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

    const slideInVariants = {
        initial: { opacity: 0, x: -30 },
        animate: {
            opacity: 1,
            x: 0,
            transition: springConfig,
        },
    };

    const handleCourseClick = (course: Course) => {
        console.log("Continuar curso:", course);
        // Aqui você pode navegar para a página do curso
    };

    return (
        <div className="flex bg-white">
            <Sidebar activeItem="my-courses" onItemClick={() => {}} />
            <motion.div
                className="flex h-screen w-full overflow-y-auto bg-white"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                <div className="flex-1">
                    <motion.div variants={slideInVariants}>
                        <DashboardHeader />
                    </motion.div>

                    <main className="w-full">
                        <motion.div variants={itemVariants}>
                            <CourseSearch
                                searchQuery={searchQuery}
                                setSearchQuery={handleSearchChange}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            {isLoading ? (
                                <CourseSkeleton count={8} />
                            ) : (
                                <MyCoursesList
                                    courses={filteredCourses}
                                    onCourseClick={handleCourseClick}
                                />
                            )}
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </div>
    );
};

export default MyCoursesPage;
