import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import CourseSearch from "./CourseSearch";
import MyCoursesList from "./MyCoursesList";
import { Course } from "../../stores/courseStore";

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

    const handleCourseClick = (course: Course) => {
        console.log("Continuar curso:", course);
        // Aqui você pode navegar para a página do curso
    };

    return (
        <div className="flex">
            <Sidebar activeItem="my-courses" onItemClick={() => {}} />
            <div className="flex h-screen w-full overflow-y-auto bg-white">
                <div className="flex-1">
                    <DashboardHeader />

                    <main className="w-full">
                        <CourseSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                        <MyCoursesList
                            courses={filteredCourses}
                            onCourseClick={handleCourseClick}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyCoursesPage;
