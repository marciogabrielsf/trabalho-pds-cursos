"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { TeacherSidebar } from "@/components/dashboard/layout";
import { TeacherCoursesList, CreateCourseModal } from "@/components/dashboard/courses";
import SimpleSearch from "@/components/dashboard/courses/SimpleSearch";
import { useTeacherCourses, useCreateCourse, useDeleteCourse } from "@/hooks/useTeacherQuery";
import { CourseFormData } from "@/components/dashboard/courses/CreateCourseModal";
import { Course } from "@/types/course";
import { GraduationCap } from "lucide-react";
import ImgPH from "@/../public/img_ph.jpeg";
import Image from "next/image";

export default function TeacherDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Queries
    const { data: courses = [], isLoading } = useTeacherCourses(user?.id || 0, {
        search: searchTerm,
    });

    const createCourseMutation = useCreateCourse();
    const deleteCourseMutation = useDeleteCourse();

    const handleCreateCourse = async (courseData: CourseFormData) => {
        try {
            await createCourseMutation.mutateAsync({
                ...courseData,
                teacher_id: user?.id || 1,
            });
            setIsCreateModalOpen(false);
            alert("Curso criado com sucesso!");
        } catch (error) {
            alert("Erro ao criar curso. Tente novamente.");
            console.error("Error creating course:", error);
        }
    };

    const handleEditCourse = (course: Course) => {
        router.push(`/dashboard/teacher/course/${course.id}/edit`);
    };

    const handleDeleteCourse = async (course: Course) => {
        if (window.confirm(`Tem certeza que deseja excluir o curso "${course.title}"?`)) {
            try {
                await deleteCourseMutation.mutateAsync(course.id);
                alert("Curso excluído com sucesso!");
            } catch (error) {
                alert("Erro ao excluir curso. Tente novamente.");
                console.error("Error deleting course:", error);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <TeacherSidebar activeItem="courses" />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b flex gap-3 items-center border-gray-200 px-6 py-4">
                    <Image src={ImgPH} alt="Logo" className="w-16 h-16 rounded-full" />
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Bem-Vindo, Prof. {user?.name}
                            </h1>
                            <p className="text-gray-600 text-sm">Terça, 15 de Julho de 2025</p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Courses Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Seus Cursos</h2>
                        </div>

                        {/* Search */}
                        <div className="mb-6 flex justify-between">
                            <SimpleSearch
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Pesquise seu curso aqui..."
                            />
                            <a
                                href="/dashboard/teacher/create-course"
                                className="bg-secondary font-bold text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition-colors flex items-center space-x-2"
                            >
                                <GraduationCap size={20} />
                                <span>CRIAR NOVO CURSO</span>
                            </a>
                        </div>

                        {/* Courses List */}
                        <TeacherCoursesList
                            courses={courses}
                            isLoading={isLoading}
                            onEditCourse={handleEditCourse}
                            onDeleteCourse={handleDeleteCourse}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                                ←
                            </button>
                            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded">
                                01
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                                02
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                                03
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                                04
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                                05
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                                →
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Create Course Modal */}
            <CreateCourseModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateCourse}
                isLoading={createCourseMutation.isPending}
            />
        </div>
    );
}
