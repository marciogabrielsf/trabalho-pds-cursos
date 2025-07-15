import { useQuery } from "@tanstack/react-query";
import { lessonService } from "@/services/lessonService";
import { Lesson, VideoLesson, QuizLesson, TextLesson } from "@/types/lesson";

export const useLessonQuery = (lessonId: number) => {
    return useQuery<Lesson, Error>({
        queryKey: ["lesson", lessonId],
        queryFn: () => lessonService.getLessonById(lessonId),
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
        enabled: !!lessonId, // Só executa se lessonId existir
    });
};

export const useVideoLessonQuery = (lessonId: number) => {
    return useQuery<VideoLesson, Error>({
        queryKey: ["video-lesson", lessonId],
        queryFn: () => lessonService.getVideoLesson(lessonId),
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
        enabled: !!lessonId,
    });
};

export const useQuizLessonQuery = (lessonId: number) => {
    return useQuery<QuizLesson, Error>({
        queryKey: ["quiz-lesson", lessonId],
        queryFn: () => lessonService.getQuizLesson(lessonId),
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
        enabled: !!lessonId,
    });
};

export const useTextLessonQuery = (lessonId: number) => {
    return useQuery<TextLesson, Error>({
        queryKey: ["text-lesson", lessonId],
        queryFn: () => lessonService.getTextLesson(lessonId),
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
        enabled: !!lessonId,
    });
};
