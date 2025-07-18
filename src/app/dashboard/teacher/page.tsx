"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { TeacherSidebar } from "@/components/dashboard/layout";
import { TeacherCoursesList, CreateCourseModal } from "@/components/dashboard/courses";
import SimpleSearch from "@/components/dashboard/courses/SimpleSearch";
import { useTeacherCourses, useCreateCourse, useDeleteCourse } from "@/hooks/useTeacherQuery";
import { CourseFormData } from "@/components/dashboard/courses/CreateCourseModal";
import { Course } from "@/types/course";
import { GraduationCap, AlertTriangle } from "lucide-react";
import ImgPH from "@/../public/img_ph.jpeg";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function TeacherDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    // Queries
    const { data: courses = [], isLoading } = useTeacherCourses(user?.id || 0);

    // Filtrar cursos localmente com base no termo de busca
    const filteredCourses = useMemo(() => {
        if (!searchTerm.trim()) {
            return courses;
        }

        return courses.filter(
            (course) =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [courses, searchTerm]);

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
        setCourseToDelete(course);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteCourse = async () => {
        if (!courseToDelete) return;

        try {
            await deleteCourseMutation.mutateAsync(courseToDelete.id);
            setIsDeleteModalOpen(false);
            setCourseToDelete(null);
        } catch (error) {
            alert("Erro ao excluir curso. Tente novamente.");
            console.error("Error deleting course:", error);
        }
    };

    const cancelDeleteCourse = () => {
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
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
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Seus Cursos</h2>
                                {searchTerm && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {filteredCourses.length} resultado(s) encontrado(s) para
                                        &ldquo;{searchTerm}&rdquo;
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mb-6 flex justify-between items-center gap-4">
                            <div className="flex-1 max-w-md">
                                <SimpleSearch
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Pesquise seu curso aqui..."
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
                                    >
                                        Limpar busca
                                    </button>
                                )}
                            </div>
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
                            courses={filteredCourses}
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

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmar Exclusão
                        </DialogTitle>
                        <DialogDescription className="text-left">
                            Tem certeza que deseja excluir o curso{" "}
                            <span className="font-semibold">
                                &ldquo;{courseToDelete?.title}&rdquo;
                            </span>
                            ?
                            <br />
                            <br />
                            Esta ação não pode ser desfeita. Todos os dados do curso, incluindo
                            módulos, aulas e progresso dos alunos serão permanentemente removidos.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            onClick={cancelDeleteCourse}
                            disabled={deleteCourseMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={confirmDeleteCourse}
                            disabled={deleteCourseMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {deleteCourseMutation.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Excluindo...
                                </>
                            ) : (
                                "Excluir Curso"
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
