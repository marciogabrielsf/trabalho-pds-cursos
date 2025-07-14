import { Teacher } from "./user";

export interface Course {
    id: number;
    title: string;
    description: string;
    value: number;
    category: string;
    created_at: string;
    teacher: Teacher;
}
