import React from "react";
import { TeacherSidebar } from "@/components/dashboard/layout";

interface CourseEditLoadingProps {
    message?: string;
}

export function CourseEditLoading({ message = "Carregando curso..." }: CourseEditLoadingProps) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <TeacherSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{message}</h1>
                        <p className="text-gray-600">
                            Aguarde enquanto carregamos as informações do curso.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface CourseEditErrorProps {
    onRetry: () => void;
}

export function CourseEditError({ onRetry }: CourseEditErrorProps) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <TeacherSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Erro ao carregar curso
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Não foi possível carregar as informações do curso.
                        </p>
                        <button onClick={onRetry} className="text-orange-500 hover:text-orange-600">
                            Voltar para o Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
