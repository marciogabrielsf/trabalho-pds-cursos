import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { Categories, CoursesList, CourseSearch } from "../courses";
import { useCourseStore } from "../../../stores/courseStore";
import { mockCategories, mockCourses } from "../../../data/mockData";

const StudentDashboard: React.FC = () => {
    const [activeMenuItem, setActiveMenuItem] = useState("courses");

    const {
        categories,
        courses,
        searchQuery,
        selectedCategory,
        setCategories,
        setCourses,
        setSearchQuery,
        setSelectedCategory,
        getFilteredCourses,
    } = useCourseStore();

    // Simular carregamento de dados
    useEffect(() => {
        setCategories(mockCategories);
        setCourses(mockCourses);
    }, [setCategories, setCourses]);

    const filteredCourses = getFilteredCourses();
    const developmentCourses = courses.filter((course) => course.category === "Development");

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
                                setSearchQuery={setSearchQuery}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Categories
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategorySelect={setSelectedCategory}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            {searchQuery || selectedCategory ? (
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
                                    courses={developmentCourses}
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
