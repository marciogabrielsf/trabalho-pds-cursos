import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useCourseByIdQuery, useCourseModulesQuery } from "@/hooks/useCourseQuery";
import { CourseWizardData } from "@/types/courseWizard";
import { Lesson } from "@/types/lesson";

export function useCourseEdit(courseId: number) {
    const { user } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [wizardData, setWizardData] = useState<CourseWizardData>({
        title: "",
        description: "",
        value: 0,
        trailer_url: "",
        thumbnail_url: "",
        difficulty: "BEGINNER",
        category: "PROGRAMMING",
        selectedModules: [],
        newModules: [],
        moduleOrder: [],
    });

    // Buscar dados básicos do curso
    const {
        data: courseInfo,
        isLoading: courseInfoLoading,
        error: courseInfoError,
    } = useCourseByIdQuery(courseId);

    // Buscar módulos existentes do curso
    const {
        data: courseModules = [],
        isLoading: courseModulesLoading,
        error: courseModulesError,
    } = useCourseModulesQuery(courseId);

    // Carregar dados do curso quando disponível
    useEffect(() => {
        if (courseInfo && courseModules && !courseInfoLoading && !courseModulesLoading) {
            // Mapear módulos existentes do curso como "new" para permitir edição
            const newModules = courseModules.map((m) => ({
                id: `course-module-${m.id}`,
                title: m.title,
                description: m.description,
                lessons:
                    m.lessons?.map((lesson) => {
                        // Usar o conteúdo real da aula se disponível
                        let content: Record<string, unknown> = {};

                        // Verificar se a aula tem conteúdo
                        const lessonWithContent = lesson as Lesson & {
                            content?: Record<string, unknown>;
                        };
                        if (lessonWithContent.content) {
                            content = lessonWithContent.content;
                        } else {
                            // Fallback para conteúdo padrão se não houver conteúdo
                            switch (lesson.type) {
                                case "VIDEO":
                                    content = { videoUrl: "" };
                                    break;
                                case "QUIZ":
                                    content = { questions: [] };
                                    break;
                                case "TEXT":
                                    content = { text: "" };
                                    break;
                            }
                        }

                        return {
                            id: `lesson-${lesson.id}`,
                            title: lesson.title,
                            type: lesson.type as "VIDEO" | "QUIZ" | "TEXT",
                            description: lesson.description || "",
                            content: content,
                            order: lesson.order,
                        };
                    }) || [],
            }));

            const moduleOrder = courseModules.map((m) => ({
                id: `course-module-${m.id}`,
                type: "new" as const,
            }));

            const existingModuleIds = courseModules.map((m) => m.id);

            setWizardData({
                title: courseInfo.title || "",
                description: courseInfo.description || "",
                value: courseInfo.value || 0,
                trailer_url: courseInfo.trailer_url || "",
                thumbnail_url: courseInfo.thumbnail_url || "",
                difficulty: (courseInfo.difficulty as CourseWizardData["difficulty"]) || "BEGINNER",
                category: (courseInfo.category as CourseWizardData["category"]) || "PROGRAMMING",
                selectedModules: existingModuleIds,
                newModules: newModules,
                moduleOrder: moduleOrder,
            });

            setIsLoading(false);
        }
    }, [courseInfo, courseModules, courseInfoLoading, courseModulesLoading]);

    const updateWizardData = (data: Partial<CourseWizardData>) => {
        setWizardData((prev: CourseWizardData) => ({ ...prev, ...data }));
    };

    const navigateBack = () => {
        router.push(`/dashboard/teacher/course/${courseId}`);
    };

    const navigateToTeacherDashboard = () => {
        router.push("/dashboard/teacher");
    };

    return {
        wizardData,
        updateWizardData,
        isLoading: isLoading || courseInfoLoading || courseModulesLoading,
        error: courseInfoError || courseModulesError,
        courseInfo,
        courseModules,
        navigateBack,
        navigateToTeacherDashboard,
        user,
    };
}
