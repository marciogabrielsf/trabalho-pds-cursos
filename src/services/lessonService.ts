import { Lesson, VideoLesson, QuizLesson, TextLesson } from "@/types/lesson";
import { api } from "./api";

class LessonService {
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
}

export const lessonService = new LessonService();
