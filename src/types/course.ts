import { Teacher } from "./user";
import { Module } from "./module";

export type CourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CourseCategory =
    | "PROGRAMMING"
    | "DESIGN"
    | "BUSINESS"
    | "MARKETING"
    | "PHOTOGRAPHY"
    | "MUSIC";

export interface Course {
    id: number;
    title: string;
    description: string;
    value?: number;
    category: string;
    created_at: string;
    teacher?: Teacher;
    teacher_name?: string;
    thumbnail_url?: string;
    trailer_url?: string;
    difficulty?: string;
    studentsCount: number;
    lessonsCount: number;
    firstLessonId?: number;
}

export interface CourseLearningData {
    id: number;
    title: string;
    description: string;
    value: number;
    teacher_name: string;
    trailer_url: string;
    thumbnail_url: string;
    difficulty: string;
    category: string;
    course_data: {
        modules: Module[];
    };
}
