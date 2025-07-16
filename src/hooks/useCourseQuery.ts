import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";
import { Course, CourseLearningData } from "@/types/course";
import { Module } from "@/types/module";

interface UseCourseQueryParams {
    search?: string;
    limit?: number;
    offset?: number;
}

// interface CourseQueryResponse {
//     courses: Course[];
//     total: number;
//     hasMore: boolean;
// }

export const useCourseQuery = (params: UseCourseQueryParams = {}) => {
    return useQuery<Course[], Error>({
        queryKey: ["courses", params],
        queryFn: () => courseService.getCourses(params),
        staleTime: 1000 * 60, // 1 minuto
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
    });
};

export const useCourseByIdQuery = (courseId: number) => {
    return useQuery<Course, Error>({
        queryKey: ["course", courseId],
        queryFn: () => courseService.getCourseById(courseId),
        staleTime: 1000 * 60, // 1 minuto
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
        enabled: !!courseId, // Só executa se courseId existir
    });
};

export const useCourseLearningQuery = (courseId: number) => {
    return useQuery<CourseLearningData, Error>({
        queryKey: ["course-learning", courseId],
        queryFn: () => courseService.getCourseForLearning(courseId),
        staleTime: 1000 * 60, // 1 minuto
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
        enabled: !!courseId, // Só executa se courseId existir
    });
};

export const useStudentCoursesQuery = (studentId: number, params: UseCourseQueryParams = {}) => {
    return useQuery<Course[], Error>({
        queryKey: ["student-courses", studentId, params],
        queryFn: () => courseService.getStudentCourses(studentId, params),
        staleTime: 1000 * 60, // 1 minuto
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
        enabled: !!studentId, // Só executa se studentId existir
    });
};

export const useCourseModulesQuery = (courseId: number) => {
    return useQuery<Module[], Error>({
        queryKey: ["course-modules", courseId],
        queryFn: () => courseService.getCourseModules(courseId),
        staleTime: 1000 * 60, // 1 minuto
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
        enabled: !!courseId, // Só executa se courseId existir
    });
};
