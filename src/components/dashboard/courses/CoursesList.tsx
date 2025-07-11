import React from "react";
import CourseCard from "./CourseCard";
import { Course } from "../../stores/courseStore";

interface CoursesListProps {
    courses: Course[];
    title: string;
    subtitle?: string;
    showResults?: boolean;
}

const CoursesList: React.FC<CoursesListProps> = ({
    courses,
    title,
    subtitle,
    showResults = false,
}) => {
    return (
        <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                </div>

                {showResults && (
                    <div className="text-sm text-gray-500 font-medium">
                        <span className="text-black">{courses.length}</span> resultado
                        {courses.length !== 1 ? "s" : ""} para {title}
                    </div>
                )}
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum curso encontrado
                    </h3>
                    <p className="text-gray-600">
                        Tente ajustar seus filtros ou buscar por outros termos.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesList;
