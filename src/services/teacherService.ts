import { Course } from "@/types/course";
import { api } from "./api";

export interface CreateCourseData {
    title: string;
    description: string;
    value: number;
    teacher_id: number;
    trailer_url: string;
    thumbnail_url: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    category: "PROGRAMMING" | "DESIGN" | "BUSINESS" | "MARKETING" | "PHOTOGRAPHY" | "MUSIC";
}

export interface CreateCompleteCourseData {
    courseData: CreateCourseData;
    existingModulesData: Array<{
        module_id: number;
        order: number;
    }>;
    newModulesData: Array<{
        title: string;
        description: string;
        order: number;
        lessons: Array<{
            id: string;
            title: string;
            type: "VIDEO" | "QUIZ" | "TEXT";
            description: string;
            content: Record<string, unknown>;
            order: number;
        }>;
    }>;
}

export interface UpdateCompleteCourseData {
    courseData: CreateCourseData;
    existingModulesData: Array<{
        module_id: number;
        order: number;
    }>;
    newModulesData: Array<{
        title: string;
        description: string;
        order: number;
        lessons: Array<{
            id: string;
            title: string;
            type: "VIDEO" | "QUIZ" | "TEXT";
            description: string;
            content: Record<string, unknown>;
            order: number;
        }>;
    }>;
    courseModulesData: Array<{
        id: number;
        title: string;
        description: string;
        order: number;
        lessons: Array<{
            id: string;
            title: string;
            type: "VIDEO" | "QUIZ" | "TEXT";
            description: string;
            content: Record<string, unknown>;
            order: number;
        }>;
    }>;
}

export interface TeacherCourseQueryParams {
    search?: string;
    limit?: number;
    offset?: number;
}

class TeacherService {
    async createCourse(courseData: CreateCourseData): Promise<Course> {
        const response = await api.post("/course/", courseData);
        return response.data;
    }

    async createCompleteCourse(courseData: CreateCompleteCourseData): Promise<Course> {
        const response = await api.post("/course/create-complete", courseData);
        return response.data;
    }

    async updateCompleteCourse(
        courseId: number,
        courseData: UpdateCompleteCourseData
    ): Promise<Course> {
        const response = await api.put(`/course/${courseId}/update-complete`, courseData);
        return response.data;
    }

    async getTeacherCourses(
        teacherId: number,
        params: TeacherCourseQueryParams = {}
    ): Promise<Course[]> {
        const { search, limit = 10, offset = 0 } = params;

        const queryParams = new URLSearchParams();

        if (search) {
            queryParams.append("search", search);
        }

        queryParams.append("limit", limit.toString());
        queryParams.append("offset", offset.toString());

        const response = await api.get(`/teacher/${teacherId}/courses?${queryParams}`);
        return response.data;
    }

    async updateCourse(courseId: number, courseData: Partial<CreateCourseData>): Promise<Course> {
        const response = await api.put(`/course/${courseId}`, courseData);
        return response.data;
    }

    async deleteCourse(courseId: number): Promise<void> {
        await api.delete(`/course/${courseId}`);
    }
}

export const teacherService = new TeacherService();
