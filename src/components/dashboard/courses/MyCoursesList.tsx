import React from "react";
import MyCourseCard from "./MyCourseCard";
import { Course } from "@/types/course";

interface MyCoursesListProps {
    courses: Course[];
    onCourseClick?: (course: Course) => void;
}

const MyCoursesList: React.FC<MyCoursesListProps> = ({ courses }) => {
    return (
        <div className="px-6 py-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Meus Cursos</h2>
                <p className="text-gray-600">Continue de onde parou e conclua seus cursos</p>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum curso encontrado
                    </h3>
                    <p className="text-gray-600">Você ainda não se inscreveu em nenhum curso.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {courses.map((course) => (
                        <MyCourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCoursesList;
