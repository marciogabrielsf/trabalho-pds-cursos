import React, { useState } from "react";
import { MessageSquare, Clock, User, Send } from "lucide-react";
import { Comment } from "@/types/comment";
import { motion } from "framer-motion";
import { formatDateBR, formatTimeBR } from "@/lib/dateUtils";

interface ClassroomPostProps {
    comment: Comment;
    onAddComment?: (postId: string, comment: string) => void;
}

const ClassroomPost: React.FC<ClassroomPostProps> = ({ comment, onAddComment }) => {
    const [newComment, setNewComment] = useState("");

    const getPostIcon = (userRole: string) => {
        switch (userRole) {
            case "teacher":
                return <User className="w-5 h-5 text-highlight" />;
            case "student":
                return <User className="w-5 h-5 text-secondary" />;
            default:
                return <MessageSquare className="w-5 h-5 text-gray-600" />;
        }
    };

    const handleAddComment = () => {
        if (newComment.trim() && onAddComment) {
            onAddComment(comment.id.toString(), newComment);
            setNewComment("");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
            <div className="bg-white rounded-3xl shadow-sm border-2 border-gray-200 transition-all duration-200 hover:shadow-md">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{getPostIcon(comment.user_info?.role)}</div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                    {comment.user_info.name}
                                </h3>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                        comment.user_info?.role === "teacher"
                                            ? "bg-highlight"
                                            : "bg-secondary"
                                    } text-white`}
                                >
                                    {comment.user_info?.role === "teacher" ? "Professor" : "Aluno"}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {formatDateBR(comment.created_at)} às{" "}
                                        {formatTimeBR(comment.created_at)}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-700 mt-3 leading-relaxed">{comment.content}</p>
                        </div>
                    </div>

                    {onAddComment && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Adicionar um comentário..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-highlight focus:border-transparent"
                                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                    className="px-4 py-2 bg-highlight text-white rounded-lg  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ClassroomPost;
