import { useMemo } from "react";
import { CourseWizardData } from "@/types/courseWizard";

type ModuleOrderItem = CourseWizardData["moduleOrder"][0];
type NewModuleItem = CourseWizardData["newModules"][0];

export function useCourseEditAPI(wizardData: CourseWizardData, userId: number) {
    return useMemo(() => {
        return {
            // Dados básicos do curso
            courseData: {
                title: wizardData.title,
                description: wizardData.description,
                value: wizardData.value,
                teacher_id: userId,
                trailer_url: wizardData.trailer_url,
                thumbnail_url: wizardData.thumbnail_url,
                difficulty: wizardData.difficulty,
                category: wizardData.category,
            },

            // Módulos existentes com ordem sequencial
            existingModulesData: wizardData.moduleOrder
                .filter((item: ModuleOrderItem) => item.type === "existing")
                .map((item: ModuleOrderItem) => {
                    const orderIndex = wizardData.moduleOrder.findIndex(
                        (orderItem: ModuleOrderItem) => orderItem.id === item.id
                    );
                    return {
                        module_id: item.originalId!,
                        order: orderIndex + 1,
                    };
                }),

            // Novos módulos para criar com ordem sequencial
            newModulesData: wizardData.moduleOrder
                .filter((item: ModuleOrderItem) => item.type === "new")
                .filter((item: ModuleOrderItem) => !item.id.startsWith("course-module-")) // Só módulos realmente novos
                .map((item: ModuleOrderItem) => {
                    const orderIndex = wizardData.moduleOrder.findIndex(
                        (orderItem: ModuleOrderItem) => orderItem.id === item.id
                    );
                    const moduleData = wizardData.newModules.find(
                        (m: NewModuleItem) => m.id === item.id
                    );
                    return {
                        title: moduleData?.title || "",
                        description: moduleData?.description || "",
                        order: orderIndex + 1,
                        lessons: moduleData?.lessons || [],
                    };
                }),

            // Módulos do curso para atualizar
            courseModulesData: wizardData.moduleOrder
                .filter((item: ModuleOrderItem) => item.type === "new")
                .filter((item: ModuleOrderItem) => item.id.startsWith("course-module-")) // Módulos do curso
                .map((item: ModuleOrderItem) => {
                    const orderIndex = wizardData.moduleOrder.findIndex(
                        (orderItem: ModuleOrderItem) => orderItem.id === item.id
                    );
                    const moduleData = wizardData.newModules.find(
                        (m: NewModuleItem) => m.id === item.id
                    );
                    const originalId = parseInt(item.id.replace("course-module-", ""));
                    return {
                        id: originalId,
                        title: moduleData?.title || "",
                        description: moduleData?.description || "",
                        order: orderIndex + 1,
                        lessons: moduleData?.lessons || [],
                    };
                }),

            // Estatísticas do curso
            stats: {
                totalModules: wizardData.moduleOrder.length,
                existingModules: wizardData.selectedModules.length,
                newModules: wizardData.moduleOrder.filter(
                    (item: ModuleOrderItem) =>
                        item.type === "new" && !item.id.startsWith("course-module-")
                ).length,
                courseModules: wizardData.moduleOrder.filter(
                    (item: ModuleOrderItem) =>
                        item.type === "new" && item.id.startsWith("course-module-")
                ).length,
                totalLessons: wizardData.newModules.reduce(
                    (acc: number, module: NewModuleItem) => acc + module.lessons.length,
                    0
                ),
                moduleOrder: wizardData.moduleOrder,
            },
        };
    }, [wizardData, userId]);
}
