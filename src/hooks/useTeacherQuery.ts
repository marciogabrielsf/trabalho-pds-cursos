import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@/services/teacherService";
import { Course } from "@/types/course";

interface CreateCourseData {
    title: string;
    description: string;
    value: number;
    teacher_id: number;
    trailer_url: string;
    thumbnail_url: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    category: "PROGRAMMING" | "DESIGN" | "BUSINESS" | "MARKETING" | "PHOTOGRAPHY" | "MUSIC";
}

interface TeacherCourseQueryParams {
    search?: string;
    limit?: number;
    offset?: number;
}

export const useTeacherCourses = (teacherId: number, params: TeacherCourseQueryParams = {}) => {
    return useQuery({
        queryKey: ["teacher-courses", teacherId, params],
        queryFn: () => teacherService.getTeacherCourses(teacherId, params),
        enabled: !!teacherId,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
    });
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseData: CreateCourseData) => teacherService.createCourse(courseData),
        onSuccess: (newCourse: Course) => {
            // Invalidar query dos cursos do professor
            queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });

            // Adicionar curso otimisticamente ao cache
            queryClient.setQueryData(["teacher-courses"], (old: Course[] | undefined) => {
                return old ? [newCourse, ...old] : [newCourse];
            });
        },
    });
};

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            courseId,
            courseData,
        }: {
            courseId: number;
            courseData: Partial<CreateCourseData>;
        }) => teacherService.updateCourse(courseId, courseData),
        onSuccess: (updatedCourse: Course) => {
            // Invalidar query dos cursos do professor
            queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });

            // Atualizar curso específico no cache
            queryClient.setQueryData(["course", updatedCourse.id], updatedCourse);
        },
    });
};

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: number) => teacherService.deleteCourse(courseId),
        onSuccess: (_, courseId) => {
            // Invalidar query dos cursos do professor
            queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });

            // Remover curso do cache
            queryClient.removeQueries({ queryKey: ["course", courseId] });
        },
    });
};
