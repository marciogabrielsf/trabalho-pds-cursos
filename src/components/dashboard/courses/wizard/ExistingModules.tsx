import React, { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useTeacherModules } from "@/hooks/useModuleQuery";
import { CourseWizardData } from "@/types/courseWizard";
import { Skeleton } from "@/components/ui";
import { Pen, Trash2 } from "lucide-react";

interface ExistingModulesProps {
    data: CourseWizardData;
    onChange: (data: Partial<CourseWizardData>) => void;
}

export default function ExistingModules({ data, onChange }: ExistingModulesProps) {
    const { user } = useAuthStore();
    const { data: modules = [], isLoading } = useTeacherModules(user?.id || 0);
    const [selectedModuleId, setSelectedModuleId] = useState<string>("");

    // Obter IDs dos módulos que já estão no curso
    const courseModuleIds = data.newModules
        .filter((module) => module.id.startsWith("course-module-"))
        .map((module) => parseInt(module.id.replace("course-module-", "")));

    // Combinar com módulos selecionados externos
    const usedModuleIds = [...data.selectedModules, ...courseModuleIds];

    // Filtrar módulos disponíveis (excluir os que já estão no curso)
    const availableModules = modules.filter((module) => !usedModuleIds.includes(module.id));

    const handleModuleToggle = (moduleId: number) => {
        const selectedModules = data.selectedModules.includes(moduleId)
            ? data.selectedModules.filter((id) => id !== moduleId)
            : [...data.selectedModules, moduleId];

        onChange({ selectedModules });
    };

    const handleRemoveModule = (moduleId: number) => {
        const selectedModules = data.selectedModules.filter((id) => id !== moduleId);
        const moduleOrder = data.moduleOrder.filter(
            (order) => !(order.type === "existing" && order.originalId === moduleId)
        );
        onChange({ selectedModules, moduleOrder });
    };

    const handleAddModule = () => {
        if (!selectedModuleId) return;

        const moduleId = parseInt(selectedModuleId);

        // Verifica se o módulo já não está selecionado
        if (data.selectedModules.includes(moduleId)) {
            return;
        }

        // Adiciona o módulo à lista de selecionados
        const selectedModules = [...data.selectedModules, moduleId];

        // Adiciona à ordem
        const moduleOrder = [
            ...data.moduleOrder,
            {
                id: `existing-${moduleId}`,
                type: "existing" as const,
                originalId: moduleId,
            },
        ];

        onChange({ selectedModules, moduleOrder });

        // Limpa o dropdown
        setSelectedModuleId("");
    };

    console.log("data selected modules", data.selectedModules);

    if (isLoading) {
        return (
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Módulos Existentes</h3>
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <Skeleton key={index} className="h-20 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Adicionar módulos existentes</h3>

            <div className="mb-6">
                <select
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                    <option value="">Select...</option>
                    {availableModules.map((module) => (
                        <option key={module.id} value={module.id}>
                            {module.title}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleAddModule}
                disabled={!selectedModuleId}
                className="w-full bg-orange-100 text-orange-600 p-4 rounded-lg hover:bg-orange-200 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Add Módulo
            </button>

            {/* Selected Modules */}
            <div className="space-y-4">
                {data.selectedModules.map((moduleId) => {
                    const selectedModule = modules.find((m) => m.id === moduleId);
                    if (!selectedModule) return null;

                    return (
                        <div
                            key={moduleId}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm">
                                    {data.selectedModules.indexOf(moduleId) + 1}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {selectedModule.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {selectedModule.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleModuleToggle(moduleId)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Editar módulo"
                                >
                                    <Pen />
                                </button>
                                <button
                                    onClick={() => handleRemoveModule(moduleId)}
                                    className="text-red-400 hover:text-red-600"
                                    title="Remover módulo"
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {availableModules.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhum módulo disponível
                    </h3>
                    <p className="text-gray-600">
                        Todos os seus módulos já estão incluídos neste curso, ou você não possui
                        módulos criados ainda.
                    </p>
                </div>
            )}
        </div>
    );
}
