export interface LessonProgress {
    id: number;
    student_id: number;
    lesson_id: number;
    completed_at: string;
    created_at: string;
}

export interface CompleteLessonRequest {
    student_id: number;
    lesson_id: number;
}

export interface CompleteLessonResponse {
    id: number;
    student_id: number;
    lesson_id: number;
    completed_at: string;
    created_at: string;
}
