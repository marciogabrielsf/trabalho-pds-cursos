import React from "react";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Course } from "@/types/course";
import Image from "next/image";

interface MyCourseCardProps {
    course: Course;
}

const MyCourseCard: React.FC<MyCourseCardProps> = ({ course }) => {
    // Progress mock - será implementado quando tiver essa informação na API
    const progress = 0; // Temporário até ter o progresso real

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 50) return "bg-secondary";
        if (progress >= 20) return "bg-secondary";
        return "bg-purple-500";
    };

    return (
        <Link href={`/dashboard/student/my-courses/${course.id}`} className="block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex min-h-52">
                    {/* Imagem do curso */}
                    <div className="relative  w-1/5">
                        <Image
                            src={course.thumbnail_url || "/placeholder.png"}
                            alt={course.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition duration-200 group-hover:scale-110"
                        />
                    </div>

                    {/* Conteúdo do card */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            {/* Instrutor */}
                            <p className="text-sm text-gray-600 mb-2">
                                Por: Prof. {course.teacher_name}
                            </p>

                            {/* Título */}
                            <h3 className="font-bold text-lg text-highlight mb-3 line-clamp-2">
                                {course.title}
                            </h3>

                            {/* Categoria e valor */}
                            <div className="flex items-center space-x-6 mb-4">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-highlight" />
                                    <span className="capitalize text-sm text-gray-600">
                                        {course.category}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-highlight" />
                                    <span className="text-sm text-gray-600">
                                        R$ {course.value?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progresso */}
                        <div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                        progress
                                    )}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                                {progress}% completo
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MyCourseCard;
