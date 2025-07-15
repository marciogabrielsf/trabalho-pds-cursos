import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { Categories, CoursesList, CourseSearch, CourseSkeleton } from "../courses";
import { useCourseQuery } from "../../../hooks/useCourseQuery";
import { mockCategories } from "../../../data/mockData";
import { Course } from "../../../types/course";

const StudentDashboard: React.FC = () => {
    const [activeMenuItem, setActiveMenuItem] = useState("courses");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const limit = 10;
    const offset = currentPage * limit;

    // Buscar cursos com TanStack Query
    const {
        data: courseData,
        isLoading,
        error,
        refetch,
    } = useCourseQuery({
        search: searchQuery || undefined,
        limit,
        offset,
    });

    const courses = useMemo(() => courseData || [], [courseData]);

    // Filtrar cursos por categoria e busca combinados
    const filteredCourses = useMemo(() => {
        let filtered = courses;

        // Aplicar filtro de categoria
        if (selectedCategory) {
            filtered = filtered.filter((course: Course) => course.category === selectedCategory);
        }

        // Aplicar filtro de busca (adicional ao filtro da API)
        if (searchQuery) {
            filtered = filtered.filter(
                (course: Course) =>
                    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [courses, selectedCategory, searchQuery]);

    const categories = mockCategories;

    // Função para lidar com mudanças na busca
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(0); // Reset para primeira página
    };

    // Função para lidar com mudanças na categoria
    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        setCurrentPage(0); // Reset para primeira página
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Erro ao carregar os cursos</p>
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

    return (
        <div className="flex bg-white">
            <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
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
                            <Categories
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategorySelect={handleCategoryChange}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            {isLoading ? (
                                <CourseSkeleton count={8} />
                            ) : searchQuery || selectedCategory ? (
                                <CoursesList
                                    courses={filteredCourses}
                                    title={
                                        selectedCategory
                                            ? `Cursos de ${
                                                  categories.find((c) => c.id === selectedCategory)
                                                      ?.name
                                              }`
                                            : "Resultados da busca"
                                    }
                                    subtitle={
                                        searchQuery ? `Busca por: "${searchQuery}"` : undefined
                                    }
                                    showResults={true}
                                />
                            ) : (
                                <CoursesList
                                    courses={courses}
                                    title="Cursos Disponíveis"
                                    subtitle="Explore nossos cursos mais populares para uma jornada de aprendizado incrível"
                                />
                            )}
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentDashboard;
