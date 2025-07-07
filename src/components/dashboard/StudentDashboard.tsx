import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import Categories from "./Categories";
import CoursesList from "./CoursesList";
import { useCourseStore, Course } from "../../stores/courseStore";
import { mockCategories, mockCourses } from "../../data/mockData";

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
                        <div className=" flex items-center justify-center bg-secondary mx-6 rounded-xl p-6 py-10 relative overflow-hidden">
                            <div className="relative z-10 flex items-center flex-col">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Aprimore suas habilidades com cursos profissionais
                                </h1>
                                <p className="text-purple-100 mb-6">CURSOS ONLINE</p>

                                <div className="w-full relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pesquise seu curso aqui"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-gray-500 bg-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

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
