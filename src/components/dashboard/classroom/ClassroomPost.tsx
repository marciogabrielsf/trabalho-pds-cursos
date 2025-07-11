import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    FileText,
    Download,
    Calendar,
    Clock,
    User,
    Pin,
    BookOpen,
    Award,
    Send,
} from "lucide-react";

interface ClassroomPostProps {
    post: {
        id: string;
        type: "announcement" | "assignment" | "material";
        title: string;
        content: string;
        author: string;
        date: string;
        time: string;
        pinned?: boolean;
        attachments?: Array<{
            id: string;
            name: string;
            type: string;
            size: string;
        }>;
        comments?: Array<{
            id: string;
            author: string;
            content: string;
            date: string;
        }>;
    };
    onAddComment?: (postId: string, comment: string) => void;
    currentUserName?: string;
}

const ClassroomPost: React.FC<ClassroomPostProps> = ({ post, onAddComment, currentUserName }) => {
    const [expandedComments, setExpandedComments] = useState(false);

    const toggleComments = () => {
        setExpandedComments(!expandedComments);
    };

    const getPostIcon = (type: string) => {
        switch (type) {
            case "announcement":
                return <MessageSquare className="text-blue-500" size={20} />;
            case "assignment":
                return <Award className="text-green-500" size={20} />;
            case "material":
                return <BookOpen className="text-purple-500" size={20} />;
            default:
                return <FileText className="text-gray-500" size={20} />;
        }
    };

    const getPostTypeLabel = (type: string) => {
        switch (type) {
            case "announcement":
                return "Anúncio";
            case "assignment":
                return "Atividade";
            case "material":
                return "Material";
            default:
                return "Post";
        }
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                post.pinned ? "border-orange-200 bg-orange-50" : "border-gray-200"
            }`}
        >
            <div className="p-6">
                {/* Post Header */}
                <PostHeader
                    author={post.author}
                    type={post.type}
                    date={post.date}
                    time={post.time}
                    pinned={post.pinned}
                    icon={getPostIcon(post.type)}
                    typeLabel={getPostTypeLabel(post.type)}
                />

                {/* Post Content */}
                <PostContent title={post.title} content={post.content} />

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                    <PostAttachments attachments={post.attachments} />
                )}

                {/* Comments */}
                <PostComments
                    comments={post.comments || []}
                    isExpanded={expandedComments}
                    onToggle={toggleComments}
                    postId={post.id}
                    onAddComment={onAddComment}
                    currentUserName={currentUserName}
                />
            </div>
        </div>
    );
};

interface PostHeaderProps {
    author: string;
    type: string;
    date: string;
    time: string;
    pinned?: boolean;
    icon: React.ReactNode;
    typeLabel: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ author, date, time, pinned, icon, typeLabel }) => (
    <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
            </div>
            <div>
                <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{author}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {typeLabel}
                    </span>
                    {pinned && <Pin className="text-orange-500" size={14} />}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{date}</span>
                    <Clock size={14} />
                    <span>{time}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center space-x-2">{icon}</div>
    </div>
);

interface PostContentProps {
    title: string;
    content: string;
}

const PostContent: React.FC<PostContentProps> = ({ title, content }) => (
    <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-700 leading-relaxed">{content}</p>
    </div>
);

interface PostAttachmentsProps {
    attachments: Array<{
        id: string;
        name: string;
        type: string;
        size: string;
    }>;
}

const PostAttachments: React.FC<PostAttachmentsProps> = ({ attachments }) => (
    <div className="mb-4">
        <h5 className="font-medium text-gray-900 mb-2">Anexos:</h5>
        <div className="space-y-2">
            {attachments.map((attachment) => (
                <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                    <div className="flex items-center space-x-3">
                        <FileText className="text-gray-500" size={20} />
                        <div>
                            <p className="font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-sm text-gray-500">{attachment.size}</p>
                        </div>
                    </div>
                    <button className="flex items-center space-x-2 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
                        <Download size={16} />
                        <span className="text-sm">Baixar</span>
                    </button>
                </div>
            ))}
        </div>
    </div>
);

interface PostCommentsProps {
    comments: Array<{
        id: string;
        author: string;
        content: string;
        date: string;
    }>;
    isExpanded: boolean;
    onToggle: () => void;
    postId: string;
    onAddComment?: (postId: string, comment: string) => void;
    currentUserName?: string;
}

const PostComments: React.FC<PostCommentsProps> = ({
    comments,
    isExpanded,
    onToggle,
    postId,
    onAddComment,
    currentUserName,
}) => {
    const [newComment, setNewComment] = useState("");

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && onAddComment) {
            onAddComment(postId, newComment.trim());
            setNewComment("");
        }
    };

    return (
        <div className="border-t border-gray-200 pt-4">
            <button
                onClick={onToggle}
                className="text-sm text-highlight hover:text-orange-700 transition-colors mb-3"
            >
                {isExpanded ? "Ocultar" : "Ver"} comentários ({comments.length})
            </button>

            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                >
                    {/* Existing Comments */}
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="flex space-x-3 justify-center p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                                    <User className="text-white" size={16} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col space-x-2 mb-1">
                                        <span className="font-medium text-gray-900">
                                            {comment.author}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {comment.date}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            Seja o primeiro a comentar!
                        </p>
                    )}

                    {/* Add Comment Form */}
                    {onAddComment && currentUserName && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                                    <User className="text-white" size={16} />
                                </div>
                                <form onSubmit={handleSubmitComment} className="flex-1 space-y-3">
                                    <div className="flex gap-3 items-start">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmitComment(e);
                                                }
                                            }}
                                            placeholder="Escreva um comentário... (Enter para enviar, Shift+Enter para nova linha)"
                                            className="w-full placeholder:text-gray-500 text-gray-600 rounded-xl p-3 border border-gray-200 resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            rows={3}
                                            style={{ minHeight: "3rem" }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim()}
                                            className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default ClassroomPost;
