import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";
import { Course } from "@/types/course";

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
