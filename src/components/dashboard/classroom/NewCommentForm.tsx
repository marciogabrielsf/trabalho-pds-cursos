import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import { useCreateComment } from "@/hooks/useCommentQuery";
import { useAuthStore } from "@/stores/authStore";

interface NewCommentFormProps {
    courseId: number;
}

const NewCommentForm: React.FC<NewCommentFormProps> = ({ courseId }) => {
    const [content, setContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    const { user } = useAuthStore();
    const createCommentMutation = useCreateComment();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() || !user) return;

        console.log("user type", user);

        try {
            await createCommentMutation.mutateAsync({
                content: content.trim(),
                created_by_type: user.role === "teacher" ? "teacher" : "student",
                created_by_id: user.id,
                course_id: courseId,
                parent_id: null,
            });

            setContent("");
            setIsExpanded(false);
        } catch (error) {
            console.error("Erro ao criar comentário:", error);
        }
    };

    const handleFocus = () => {
        setIsExpanded(true);
    };

    const handleCancel = () => {
        setContent("");
        setIsExpanded(false);
    };

    if (!user) return null;

    return (
        <motion.div
            className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <form onSubmit={handleSubmit}>
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-highlight/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-highlight" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onFocus={handleFocus}
                            placeholder="Compartilhe algo com a turma..."
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-highlight focus:border-transparent transition-all ${
                                isExpanded ? "min-h-[100px]" : "min-h-[40px]"
                            }`}
                            disabled={createCommentMutation.isPending}
                        />

                        {isExpanded && (
                            <motion.div
                                className="flex justify-end gap-2 mt-3"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!content.trim() || createCommentMutation.isPending}
                                    className="px-4 py-2 bg-highlight text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {createCommentMutation.isPending ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Publicar
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </form>

            {createCommentMutation.isError && (
                <motion.div
                    className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Erro ao publicar comentário. Tente novamente.
                </motion.div>
            )}
        </motion.div>
    );
};

export default NewCommentForm;
