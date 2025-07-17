import React from "react";
import { Edit, Book, DollarSign, PlayCircle, FileText, HelpCircle } from "lucide-react";
import { CourseWizardData } from "@/types/courseWizard";
import { useTeacherModules } from "@/hooks/useModuleQuery";
import { useAuthStore } from "@/stores/authStore";

type ModuleOrderItem = CourseWizardData["moduleOrder"][0];

interface CourseEditSummaryProps {
    wizardData: CourseWizardData;
    apiData: {
        stats: {
            totalModules: number;
            existingModules: number;
            newModules: number;
            courseModules: number;
            totalLessons: number;
            moduleOrder: ModuleOrderItem[];
        };
    };
}

export default function CourseEditSummary({ wizardData, apiData }: CourseEditSummaryProps) {
    const { user } = useAuthStore();
    const { data: existingModules = [] } = useTeacherModules(user?.id || 0);

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Edit className="w-6 h-6 mr-2 text-orange-500" />
                Resumo das Alterações
            </h3>

            {/* Informações Básicas */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    Informações Básicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Título</p>
                        <p className="font-medium">{wizardData.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Categoria</p>
                        <p className="font-medium">{wizardData.category}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Dificuldade</p>
                        <p className="font-medium">{wizardData.difficulty}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Valor
                        </p>
                        <p className="font-medium">R$ {wizardData.value.toFixed(2)}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Descrição</p>
                    <p className="text-gray-800">{wizardData.description}</p>
                </div>
            </div>

            {/* Estatísticas */}

            {/* Estrutura do Curso */}
            <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Estrutura Atualizada do Curso</h4>
                <div className="space-y-3">
                    {apiData.stats.moduleOrder.map((item: ModuleOrderItem, index: number) => {
                        const moduleData =
                            item.type === "existing"
                                ? existingModules.find((m) => m.id === item.originalId)
                                : wizardData.newModules.find((m) => m.id === item.id);

                        if (!moduleData) return null;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h5 className="font-medium text-gray-900">
                                            {moduleData.title}
                                        </h5>
                                        {item.type === "existing" && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Existente
                                            </span>
                                        )}
                                        {item.type === "new" &&
                                            item.id.startsWith("course-module-") && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    Curso
                                                </span>
                                            )}
                                        {item.type === "new" &&
                                            !item.id.startsWith("course-module-") && (
                                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                    Novo
                                                </span>
                                            )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {moduleData.description}
                                    </p>
                                    {item.type === "new" && (
                                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                            <span className="flex items-center">
                                                <PlayCircle className="w-3 h-3 mr-1" />
                                                {moduleData.lessons?.filter(
                                                    (l) => l.type === "VIDEO"
                                                ).length || 0}{" "}
                                                vídeos
                                            </span>
                                            <span className="flex items-center">
                                                <HelpCircle className="w-3 h-3 mr-1" />
                                                {moduleData.lessons?.filter(
                                                    (l) => l.type === "QUIZ"
                                                ).length || 0}{" "}
                                                quizzes
                                            </span>
                                            <span className="flex items-center">
                                                <FileText className="w-3 h-3 mr-1" />
                                                {moduleData.lessons?.filter(
                                                    (l) => l.type === "TEXT"
                                                ).length || 0}{" "}
                                                textos
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
