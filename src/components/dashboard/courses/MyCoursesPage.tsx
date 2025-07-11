import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CourseSearch from "./CourseSearch";
import MyCoursesList from "./MyCoursesList";
import { Course } from "@/stores/courseStore";
import { DashboardHeader, Sidebar } from "@/components";

// Dados mockados dos cursos inscritos
const myEnrolledCourses: Course[] = [
    {
        id: "1",
        title: "Design A Website With ThinkPress",
        description: "Crie designs incríveis e funcionais para websites modernos",
        instructor: "Paulo Henrique",
        rating: 4.9,
        studentsCount: 89,
        lessonsCount: 156,
        duration: "10 horas",
        price: 79.9,
        thumbnail: "/course1.jpg",
        category: "Design",
        level: "Beginner",
        isEnrolled: true,
        progress: 45,
    },
    {
        id: "2",
        title: "Design A Website With ThinkPress",
        description: "Versão avançada do curso de design web",
        instructor: "Paulo Henrique",
        rating: 4.8,
        studentsCount: 124,
        lessonsCount: 156,
        duration: "12 horas",
        price: 89.9,
        thumbnail: "/course2.jpg",
        category: "Design",
        level: "Intermediate",
        isEnrolled: true,
        progress: 78,
    },
    {
        id: "3",
        title: "Design A Website With ThinkPress",
        description: "Curso completo de design para iniciantes",
        instructor: "Paulo Henrique",
        rating: 4.7,
        studentsCount: 95,
        lessonsCount: 156,
        duration: "8 horas",
        price: 69.9,
        thumbnail: "/course3.jpg",
        category: "Design",
        level: "Beginner",
        isEnrolled: true,
        progress: 100,
    },
    {
        id: "4",
        title: "Design A Website With ThinkPress",
        description: "Especialização em design responsivo",
        instructor: "Paulo Henrique",
        rating: 4.6,
        studentsCount: 67,
        lessonsCount: 156,
        duration: "15 horas",
        price: 99.9,
        thumbnail: "/course4.jpg",
        category: "Design",
        level: "Advanced",
        isEnrolled: true,
        progress: 32,
    },
];

const MyCoursesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(myEnrolledCourses);

    // Filtrar cursos baseado na busca
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCourses(myEnrolledCourses);
        } else {
            const filtered = myEnrolledCourses.filter(
                (course) =>
                    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    }, [searchQuery]);

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
                                setSearchQuery={setSearchQuery}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <MyCoursesList
                                courses={filteredCourses}
                                onCourseClick={handleCourseClick}
                            />
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </div>
    );
};

export default MyCoursesPage;
