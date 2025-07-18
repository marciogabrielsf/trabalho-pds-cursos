import { api } from "./api";
import { Comment } from "@/types/comment";

interface CreateCommentRequest {
    content: string;
    created_by_type: "teacher" | "student";
    created_by_id: number;
    course_id: number;
    parent_id?: number | null;
}

export const commentService = {
    async getCommentsByCourse(courseId: number): Promise<Comment[]> {
        const response = await api.get(`/comments/course/${courseId}`);
        return response.data;
    },

    async createComment(comment: CreateCommentRequest): Promise<Comment> {
        const response = await api.post("/comments/", comment);
        return response.data;
    },
};
