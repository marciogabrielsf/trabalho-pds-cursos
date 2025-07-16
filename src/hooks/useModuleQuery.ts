import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moduleService } from "@/services/moduleService";
import { lessonService } from "@/services/lessonService";
import { Lesson, LessonType } from "@/types/lesson";

interface CreateModuleData {
    title: string;
    description: string;
    teacher_id: number;
}

interface CreateLessonData {
    title: string;
    type: LessonType;
    description: string;
    content: Record<string, unknown>;
    order: number;
    id_module: number;
}

interface AddModuleToCourseData {
    course_id: number;
    module_id: number;
    order: number;
}

// Module hooks
export const useTeacherModules = (teacherId: number) => {
    return useQuery({
        queryKey: ["teacher-modules", teacherId],
        queryFn: () => moduleService.getTeacherModules(teacherId),
        enabled: !!teacherId,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
    });
};

export const useCreateModule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (moduleData: CreateModuleData) => moduleService.createModule(moduleData),
        onSuccess: () => {
            // Invalidar query dos módulos do professor
            queryClient.invalidateQueries({ queryKey: ["teacher-modules"] });
        },
    });
};

export const useAddModuleToCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddModuleToCourseData) => moduleService.addModuleToCourse(data),
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
            queryClient.invalidateQueries({ queryKey: ["course"] });
        },
    });
};

export const useUpdateModule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            moduleId,
            moduleData,
        }: {
            moduleId: number;
            moduleData: Partial<CreateModuleData>;
        }) => moduleService.updateModule(moduleId, moduleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher-modules"] });
        },
    });
};

export const useDeleteModule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (moduleId: number) => moduleService.deleteModule(moduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher-modules"] });
        },
    });
};

// Lesson hooks
export const useModuleLessons = (moduleId: number) => {
    return useQuery({
        queryKey: ["module-lessons", moduleId],
        queryFn: () => lessonService.getModuleLessons(moduleId),
        enabled: !!moduleId,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
    });
};

export const useCreateLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonData: CreateLessonData) => lessonService.createLesson(lessonData),
        onSuccess: (newLesson) => {
            // Invalidar query das aulas do módulo
            queryClient.invalidateQueries({ queryKey: ["module-lessons", newLesson.id_module] });

            // Adicionar aula otimisticamente ao cache
            queryClient.setQueryData(
                ["module-lessons", newLesson.id_module],
                (old: Lesson[] | undefined) => {
                    return old ? [...old, newLesson as Lesson] : [newLesson as Lesson];
                }
            );
        },
    });
};

export const useUpdateLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            lessonId,
            lessonData,
        }: {
            lessonId: number;
            lessonData: Partial<CreateLessonData>;
        }) => lessonService.updateLesson(lessonId, lessonData),
        onSuccess: (updatedLesson) => {
            queryClient.invalidateQueries({
                queryKey: ["module-lessons", updatedLesson.id_module],
            });
            queryClient.setQueryData(["lesson", updatedLesson.id], updatedLesson);
        },
    });
};

export const useDeleteLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonId: number) => lessonService.deleteLesson(lessonId),
        onSuccess: (_, lessonId) => {
            queryClient.invalidateQueries({ queryKey: ["module-lessons"] });
            queryClient.removeQueries({ queryKey: ["lesson", lessonId] });
        },
    });
};
