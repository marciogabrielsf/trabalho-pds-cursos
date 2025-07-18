import { User } from "./user";

export interface Comment {
    id: number;
    content: string;
    created_by_type: "teacher" | "student";
    created_by_id: number;
    course_id: number;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    user_info: User & { role: "teacher" | "student" };
}
