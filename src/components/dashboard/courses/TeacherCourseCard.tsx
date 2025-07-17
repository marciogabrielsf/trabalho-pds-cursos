import React from "react";
import { Users, Clock, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Course } from "@/types/course";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeacherCourseCardProps {
    course: Course;
    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;
}

const TeacherCourseCard: React.FC<TeacherCourseCardProps> = ({ course, onEdit, onDelete }) => {
    if (!course.thumbnail_url || !course.thumbnail_url.startsWith("http")) {
        course.thumbnail_url = "/placeholder.png";
    }

    return (
        <a
            href={`teacher/course/${course.id}/lesson/${course.firstLessonId || 0}`}
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
        >
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
            </div>

            {/* Conteúdo do card */}
            <div className="p-4">
                {/* Título */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>

                {/* Estatísticas */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-highlight" />
                            <span className="text-sm text-gray-600">
                                {course.studentsCount || 0} Alunos
                            </span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-highlight" />
                            <span className="text-sm text-gray-600">
                                {course.lessonsCount || 0} Aulas
                            </span>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-gray-100" />

                {/* Preço e ações */}
                <div className="flex items-center justify-center w-full relative">
                    <div className="absolute right-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-8 h-8 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors">
                                    <MoreHorizontal className="text-gray-600" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48" align="start">
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => onEdit?.(course)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Editar Curso</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => onDelete?.(course)}
                                    variant="destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Excluir Curso</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <button className="text-green-600 font-bold cursor-pointer hover:text-green-700">
                        Entrar No Curso
                    </button>
                </div>
            </div>
        </a>
    );
};

export default TeacherCourseCard;
