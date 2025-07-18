import React from "react";
import { Course } from "@/types/course";
import TeacherCourseCard from "./TeacherCourseCard";
import { Skeleton } from "@/components/ui";

interface TeacherCoursesListProps {
    courses: Course[];
    isLoading?: boolean;
    onEditCourse?: (course: Course) => void;
    onDeleteCourse?: (course: Course) => void;
}

const TeacherCoursesList: React.FC<TeacherCoursesListProps> = ({
    courses,
    isLoading = false,
    onEditCourse,
    onDeleteCourse,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} className="h-80 rounded-3xl" />
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum curso encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                    Você ainda não criou nenhum curso. Que tal começar agora?
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
                <TeacherCourseCard
                    key={course.id}
                    course={course}
                    onEdit={onEditCourse}
                    onDelete={onDeleteCourse}
                />
            ))}
        </div>
    );
};

export default TeacherCoursesList;
