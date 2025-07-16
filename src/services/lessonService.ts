import { Lesson, VideoLesson, QuizLesson, TextLesson, LessonType } from "@/types/lesson";
import { api } from "./api";

interface CreateLessonData {
    title: string;
    type: LessonType;
    description: string;
    content: Record<string, unknown>;
    order: number;
    id_module: number;
}

interface LessonResponse {
    id: number;
    title: string;
    type: LessonType;
    description: string;
    content: Record<string, unknown>;
    order: number;
    id_module: number;
}

class LessonService {
    async createLesson(lessonData: CreateLessonData): Promise<LessonResponse> {
        const response = await api.post("/lessons", lessonData);
        return response.data;
    }

    async getLessonById(lessonId: number): Promise<Lesson> {
        const response = await api.get(`/lessons/${lessonId}`);
        return response.data;
    }

    async getVideoLesson(lessonId: number): Promise<VideoLesson> {
        const response = await api.get(`/lessons/${lessonId}`);
        return response.data;
    }

    async getQuizLesson(lessonId: number): Promise<QuizLesson> {
        const response = await api.get(`/lessons/${lessonId}`);
        return response.data;
    }

    async getTextLesson(lessonId: number): Promise<TextLesson> {
        const response = await api.get(`/lessons/${lessonId}`);
        return response.data;
    }

    async getModuleLessons(moduleId: number): Promise<Lesson[]> {
        const response = await api.get(`/modules/${moduleId}/lessons`);
        return response.data;
    }

    async updateLesson(
        lessonId: number,
        lessonData: Partial<CreateLessonData>
    ): Promise<LessonResponse> {
        const response = await api.put(`/lessons/${lessonId}`, lessonData);
        return response.data;
    }

    async deleteLesson(lessonId: number): Promise<void> {
        await api.delete(`/lessons/${lessonId}`);
    }
}

export const lessonService = new LessonService();
