import React from "react";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Course } from "../../stores/courseStore";

interface MyCourseCardProps {
    course: Course;
}

const MyCourseCard: React.FC<MyCourseCardProps> = ({ course }) => {
    const getProgressColor = (progress: number) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 50) return "bg-secondary";
        if (progress >= 20) return "bg-secondary";
        return "bg-purple-500";
    };

    return (
        <Link href={`/dashboard/student/courses/${course.id}`} className="block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex min-h-52">
                    {/* Imagem do curso */}
                    <div className="relative  w-1/5">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"></div>
                    </div>

                    {/* Conteúdo do card */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            {/* Instrutor */}
                            <p className="text-sm text-gray-600 mb-2">
                                Por: Prof. {course.instructor}
                            </p>

                            {/* Título */}
                            <h3 className="font-bold text-lg text-highlight mb-3 line-clamp-2">
                                {course.title}
                            </h3>

                            {/* Estatísticas */}
                            <div className="flex items-center space-x-6 mb-4">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-highlight" />
                                    <span className="text-sm text-gray-600">
                                        {course.studentsCount} Alunos
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-highlight" />
                                    <span className="text-sm text-gray-600">
                                        {course.lessonsCount} Aulas
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progresso */}
                        <div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                        course.progress || 0
                                    )}`}
                                    style={{ width: `${course.progress || 0}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                                {course.progress}% completo
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MyCourseCard;
