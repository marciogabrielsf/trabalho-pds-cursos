import React from "react";
import { Users, Clock, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Course } from "@/types/course";
import Image from "next/image";

interface TeacherCourseCardProps {
    course: Course;
    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;
}

const TeacherCourseCard: React.FC<TeacherCourseCardProps> = ({ course, onEdit, onDelete }) => {
    const [showActions, setShowActions] = React.useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
            {/* Imagem do curso */}
            <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Image
                        src={course.thumbnail_url || "/placeholder.png"}
                        alt={course.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition duration-200 group-hover:scale-105"
                    />
                </div>

                {/* Badge da categoria */}
                <div className="absolute top-3 left-3 px-3 py-2 rounded-md text-xs font-semibold text-white bg-gray-800 capitalize">
                    {course.category.toLowerCase()}
                </div>

                {/* Menu de ações */}
                <div className="absolute top-3 right-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors"
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {showActions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                    onClick={() => {
                                        onEdit?.(course);
                                        setShowActions(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                    <Edit size={16} />
                                    <span>Editar Curso</span>
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.(course);
                                        setShowActions(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                    <Trash2 size={16} />
                                    <span>Excluir Curso</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Conteúdo do card */}
            <div className="p-4">
                {/* Título */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>

                {/* Estatísticas */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-600">
                                {course.studentsCount || 0} Alunos
                            </span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-600">
                                {course.lessonsCount || 0} Aulas
                            </span>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-gray-100" />

                {/* Preço e ações */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(course.value || 0)}
                        </span>
                    </div>
                    <button className="text-green-600 font-bold cursor-pointer hover:text-green-700">
                        Entrar No Curso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherCourseCard;
