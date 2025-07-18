import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/commentService";
import { Comment } from "@/types/comment";

export const useCommentsByCourse = (courseId: number) => {
    return useQuery({
        queryKey: ["comments", "course", courseId],
        queryFn: () => commentService.getCommentsByCourse(courseId),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 10,
        retry: 1,
    });
};

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.createComment,
        onSuccess: (newComment) => {
            queryClient.setQueryData(
                ["comments", "course", newComment.course_id],
                (oldData: Comment[] | undefined) => {
                    if (!oldData) return [newComment];
                    return [newComment, ...oldData];
                }
            );
        },
    });
};
