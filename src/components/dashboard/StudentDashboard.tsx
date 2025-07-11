import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import Categories from "./Categories";
import CoursesList from "./CoursesList";
import { useCourseStore, Course } from "../../stores/courseStore";
import { mockCategories, mockCourses } from "../../data/mockData";
import CourseSearch from "./CourseSearch";

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

    const handleCourseClick = (course: Course) => {
        console.log("Curso clicado:", course);
        // Aqui você pode navegar para a página do curso
    };

    return (
        <div className="flex">
            <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
            <div className="flex h-screen w-full overflow-y-auto bg-white">
                <div className="flex-1">
                    <DashboardHeader />

                    <main className="w-full">
                        <CourseSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                        <Categories
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategorySelect={setSelectedCategory}
                        />

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
                                subtitle={searchQuery ? `Busca por: "${searchQuery}"` : undefined}
                                showResults={true}
                                onCourseClick={handleCourseClick}
                            />
                        ) : (
                            <CoursesList
                                courses={developmentCourses}
                                title="Cursos Disponíveis"
                                subtitle="Explore nossos cursos mais populares para uma jornada de aprendizado incrível"
                                onCourseClick={handleCourseClick}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
