export type LessonType = "VIDEO" | "QUIZ" | "TEXT";

export type Lesson = {
    id: number;
    title: string;
    description?: string;
    moduleId?: number;
    createdAt?: string;
    updatedAt?: string;
    type: LessonType;
    order: number;
};

export type VideoLesson = Lesson & {
    type: "VIDEO";
    content?: {
        videoUrl: string;
    };
};

export type QuizLesson = Lesson & {
    type: "QUIZ";
    content?: {
        questions: {
            question: string;
            options: string[];
            correctAnswer: string;
        }[];
    };
};

export type TextLesson = Lesson & {
    type: "TEXT";
    content?: {
        text: string;
    };
};
