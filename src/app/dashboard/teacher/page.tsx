"use client";

import { useAuthStore } from "@/stores/authStore";
import { DashboardHeader } from "@/components/dashboard/layout";

export default function TeacherDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />
            <main className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dashboard do Professor
                    </h1>
                    <p className="text-gray-600">
                        Bem-vindo, {user?.name}! Gerencie seus cursos e alunos aqui.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Meus Cursos</h3>
                        <p className="text-gray-600 text-sm">Gerencie e crie novos cursos</p>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-purple-600">0</span>
                            <span className="text-gray-500 ml-2">cursos ativos</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Alunos</h3>
                        <p className="text-gray-600 text-sm">Veja o progresso dos seus alunos</p>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-blue-600">0</span>
                            <span className="text-gray-500 ml-2">alunos matriculados</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Receita</h3>
                        <p className="text-gray-600 text-sm">Acompanhe seus ganhos</p>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-green-600">R$ 0,00</span>
                            <span className="text-gray-500 ml-2">este mês</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                            <div className="text-purple-600 font-medium">Criar Novo Curso</div>
                            <div className="text-sm text-gray-500 mt-1">
                                Comece um novo curso do zero
                            </div>
                        </button>
                        <button className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                            <div className="text-blue-600 font-medium">Gerenciar Módulos</div>
                            <div className="text-sm text-gray-500 mt-1">
                                Organize o conteúdo dos seus cursos
                            </div>
                        </button>
                        <button className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                            <div className="text-green-600 font-medium">Ver Relatórios</div>
                            <div className="text-sm text-gray-500 mt-1">
                                Analise o desempenho dos alunos
                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
