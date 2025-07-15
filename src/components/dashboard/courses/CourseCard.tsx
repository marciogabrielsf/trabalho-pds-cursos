import React from "react";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Course } from "@/types/course";
import Image from "next/image";

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    console.log("CourseCard component rendered with course:", course);

    const cardContent = (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-200 cursor-pointer group">
            {/* Imagem do curso */}
            <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Image
                        src={course.thumbnail_url || "/placeholder.png"}
                        alt={course.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition duration-200 group-hover:scale-110"
                    />
                </div>

                {/* Badge da categoria */}
                <div
                    className={`absolute capitalize  top-3 left-3 px-3 py-2 rounded-md text-xs font-semibold text-white bg-gray-800`}
                >
                    {course.category}
                </div>

                {/* Progresso (se inscrito) */}
                {/* {course.isEnrolled && course.progress !== undefined && (
                    <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white bg-opacity-90 rounded-full p-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )} */}
            </div>

            {/* Conteúdo do card */}
            <div className="p-4">
                {/* Instrutor */}
                <p className="text-sm text-gray-600 mb-2">Por: Prof. {course.teacher_name}</p>

                {/* Título */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-highlight transition-colors">
                    {course.title}
                </h3>

                {/* Rating e estatísticas */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-highlight" />
                            <span className="text-sm text-gray-600">
                                {course.studentsCount} Alunos
                            </span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-highlight" />
                            <span className="text-sm text-gray-600">
                                {course.lessonsCount} Aulas
                            </span>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-gray-100" />

                {/* Preço */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {course.value && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(course.value)}
                            </span>
                        )}
                        <span className="text-lg  text-[#9D9D9D]">
                            {formatPrice(course.value || 0)}
                        </span>
                    </div>
                    <button className="text-[#55BE24] font-bold cursor-pointer">
                        Comprar Curso
                    </button>
                </div>
            </div>
        </div>
    );

    return <Link href={`/dashboard/student/courses/${course.id}`}>{cardContent}</Link>;
};

export default CourseCard;
