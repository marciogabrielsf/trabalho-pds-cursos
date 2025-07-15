import { Course } from "@/types/course";
import { api } from "./api";

interface CourseQueryParams {
    search?: string;
    limit?: number;
    offset?: number;
}

// interface CourseResponse {
//     courses: Course[];
//     total: number;
//     hasMore: boolean;
// }

class CourseService {
    async getCourses(params: CourseQueryParams = {}): Promise<Course[]> {
        const { search, limit = 10, offset = 0 } = params;

        const queryParams = new URLSearchParams();

        if (search) {
            queryParams.append("search", search);
        }

        queryParams.append("limit", limit.toString());
        queryParams.append("offset", offset.toString());

        const response = await api.get(`/course?${queryParams.toString()}`);
        return response.data;
    }

    async getCourseById(courseId: number): Promise<Course> {
        const response = await api.get(`/course/${courseId}`);
        return response.data;
    }

    async getStudentCourses(studentId: number, params: CourseQueryParams = {}): Promise<Course[]> {
        const { search, limit = 10, offset = 0 } = params;

        const queryParams = new URLSearchParams();

        if (search) {
            queryParams.append("search", search);
        }

        queryParams.append("limit", limit.toString());
        queryParams.append("offset", offset.toString());

        const response = await api.get(`/student/${studentId}/courses?${queryParams.toString()}`);
        return response.data;
    }
}

export const courseService = new CourseService();
