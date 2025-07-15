import { Lesson } from "./lesson";

export type Module = {
    id: number;
    title: string;
    description: string;
    courseId?: number;
    createdAt?: string;
    updatedAt?: string;
    order: number;
    lesson_quantity: number;
    lessons?: Lesson[];
};
