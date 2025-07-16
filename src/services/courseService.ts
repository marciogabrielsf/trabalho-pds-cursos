import { Course, CourseLearningData } from "@/types/course";
import { Module } from "@/types/module";
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

    async getCourseForLearning(courseId: number): Promise<CourseLearningData> {
        const response = await api.get(`/course/${courseId}/learn`);
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

    async getCourseModules(courseId: number): Promise<Module[]> {
        const response = await api.get(`/course/${courseId}/modules`);
        return response.data;
    }
}

export const courseService = new CourseService();
