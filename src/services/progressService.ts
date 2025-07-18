import { CompleteLessonResponse } from "@/types/progress";
import { api } from "./api";

interface ProgressResponse {
    lesson_ids?: number[];
    completed_lessons?: number[];
    [key: string]: unknown;
}

export const progressService = {
    async completeLesson(studentId: number, lessonId: number): Promise<CompleteLessonResponse> {
        try {
            const response = await api.post(`/student/${studentId}/lessons/${lessonId}/complete`);
            return response.data;
        } catch (error) {
            console.error("Erro ao completar lição:", error);
            throw error;
        }
    },

    async getStudentProgress(
        studentId: number,
        courseId: number
    ): Promise<number[] | ProgressResponse> {
        try {
            const response = await api.get(`/student/${studentId}/courses/${courseId}/progress`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar progresso do estudante:", error);
            return [];
        }
    },
};
