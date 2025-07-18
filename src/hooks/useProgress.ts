import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressService } from "@/services/progressService";
import { useAuthStore } from "@/stores/authStore";
import { Module } from "@/types/module";

interface ProgressResponse {
    course_title: string;
    modules: Array<{
        module_id: number;
        module_title: string;
        lessons: Array<{
            lesson_id: number;
            lesson_title: string;
            completed: boolean;
        }>;
    }>;
}

interface UseProgressOptions {
    courseId: number;
    modules: Module[];
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useProgress = (options: UseProgressOptions) => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

    // Buscar progresso do estudante
    const { data: progressData } = useQuery({
        queryKey: ["student-progress", user?.id, options.courseId],
        queryFn: () => {
            if (!user) throw new Error("Usuário não autenticado");
            return progressService.getStudentProgress(user.id, options.courseId);
        },
        enabled: !!user && !!options.courseId,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    // Atualizar lições completadas quando os dados chegarem
    useEffect(() => {
        if (progressData) {
            console.log("Dados de progresso recebidos:", progressData);
            console.log("Tipo:", typeof progressData);

            // Verificar se progressData tem a estrutura esperada da API
            if (progressData && typeof progressData === "object" && "modules" in progressData) {
                const apiResponse = progressData as unknown as ProgressResponse;
                const completedLessonIds = new Set<number>();

                // Extrair as lições completadas de todos os módulos
                apiResponse.modules.forEach((module) => {
                    module.lessons.forEach((lesson) => {
                        if (lesson.completed) {
                            completedLessonIds.add(lesson.lesson_id);
                        }
                    });
                });

                console.log("Lições completadas extraídas:", Array.from(completedLessonIds));
                setCompletedLessons(completedLessonIds);
            } else if (Array.isArray(progressData)) {
                // Fallback para formato array simples
                setCompletedLessons(new Set(progressData));
            } else {
                console.warn("Formato de progressData inesperado:", progressData);
                setCompletedLessons(new Set());
            }
        }
    }, [progressData]);

    // Mutation para completar uma lição
    const completeLessonMutation = useMutation({
        mutationFn: async (lessonId: number) => {
            if (!user) throw new Error("Usuário não autenticado");
            return progressService.completeLesson(user.id, lessonId);
        },
        onSuccess: (data) => {
            // Atualizar o cache local
            setCompletedLessons((prev) => new Set([...prev, data.lesson_id]));

            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: ["student-progress", user?.id, options.courseId],
            });

            options.onSuccess?.();
        },
        onError: (error) => {
            options.onError?.(error as Error);
        },
    });

    // Verificar se uma lição está completa
    const isLessonCompleted = (lessonId: number): boolean => {
        return completedLessons.has(lessonId);
    };

    // Verificar se uma lição pode ser acessada (Chain of Responsibility pattern)
    const canAccessLesson = (moduleId: number, lessonId: number): boolean => {
        // Encontrar o módulo e a lição
        const targetModule = options.modules.find((m) => m.id === moduleId);
        if (!targetModule?.lessons) return false;

        const lesson = targetModule.lessons.find((l) => l.id === lessonId);
        if (!lesson) return false;

        // Primeira lição do primeiro módulo sempre pode ser acessada
        const firstModule = options.modules.sort((a, b) => a.order - b.order)[0];
        const firstLesson = firstModule?.lessons?.sort((a, b) => a.order - b.order)[0];

        if (lesson.id === firstLesson?.id) {
            return true;
        }

        // Para outras lições, verificar se a anterior foi completada
        const allLessons: Array<{ lessonId: number; moduleOrder: number; lessonOrder: number }> =
            [];

        // Criar lista ordenada de todas as lições
        options.modules
            .sort((a, b) => a.order - b.order)
            .forEach((mod) => {
                if (mod.lessons) {
                    mod.lessons
                        .sort((a, b) => a.order - b.order)
                        .forEach((les) => {
                            allLessons.push({
                                lessonId: les.id,
                                moduleOrder: mod.order,
                                lessonOrder: les.order,
                            });
                        });
                }
            });

        // Encontrar o índice da lição atual
        const currentIndex = allLessons.findIndex((l) => l.lessonId === lessonId);
        if (currentIndex <= 0) return true; // Primeira lição ou não encontrada

        // Verificar se a lição anterior foi completada
        const previousLesson = allLessons[currentIndex - 1];
        return isLessonCompleted(previousLesson.lessonId);
    };

    // Calcular progresso geral do curso
    const calculateProgress = (): number => {
        // Primeiro, tentar usar os módulos locais
        const localTotalLessons = options.modules.reduce((total, module) => {
            return total + (module.lessons?.length || 0);
        }, 0);

        if (localTotalLessons > 0) {
            const completedCount = completedLessons.size;
            return Math.round((completedCount / localTotalLessons) * 100);
        }

        // Se não há módulos locais, usar os dados da API
        if (progressData && typeof progressData === "object" && "modules" in progressData) {
            const apiResponse = progressData as unknown as ProgressResponse;
            let totalApiLessons = 0;
            let completedApiLessons = 0;

            apiResponse.modules.forEach((module) => {
                totalApiLessons += module.lessons.length;
                completedApiLessons += module.lessons.filter((lesson) => lesson.completed).length;
            });

            if (totalApiLessons === 0) return 0;
            return Math.round((completedApiLessons / totalApiLessons) * 100);
        }

        return 0;
    };

    return {
        completeLesson: completeLessonMutation.mutate,
        isCompletingLesson: completeLessonMutation.isPending,
        isLessonCompleted,
        canAccessLesson,
        progress: calculateProgress(),
        completedLessons: Array.from(completedLessons),
    };
};
