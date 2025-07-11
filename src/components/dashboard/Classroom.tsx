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
    Users,
} from "lucide-react";

interface ClassroomPost {
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
}

interface ClassroomProps {
    courseTitle: string;
    instructor: string;
}

const mockPosts: ClassroomPost[] = [
    {
        id: "1",
        type: "announcement",
        title: "Bem-vindos ao curso!",
        content:
            "Olá pessoal! Sejam muito bem-vindos ao nosso curso de Design com Webflow. Estou muito animado para compartilhar conhecimento com vocês. Lembrem-se de sempre participar ativamente das discussões e não hesitem em fazer perguntas.",
        author: "Paulo Henrique",
        date: "15 de Janeiro",
        time: "09:30",
        pinned: true,
        comments: [
            {
                id: "c1",
                author: "Maria Silva",
                content: "Muito obrigada professor! Estou ansiosa para começar.",
                date: "15 de Janeiro",
            },
        ],
    },
    {
        id: "2",
        type: "material",
        title: "Slides da Aula 1 - Introdução ao Webflow",
        content:
            "Compartilho com vocês os slides da nossa primeira aula. Façam download e usem como material de apoio para os estudos.",
        author: "Paulo Henrique",
        date: "16 de Janeiro",
        time: "14:20",
        attachments: [
            {
                id: "a1",
                name: "Aula01-Introducao-Webflow.pdf",
                type: "pdf",
                size: "2.5 MB",
            },
            {
                id: "a2",
                name: "Exercicios-Praticos.zip",
                type: "zip",
                size: "850 KB",
            },
        ],
    },
    {
        id: "3",
        type: "assignment",
        title: "Atividade 1 - Criar conta no Webflow",
        content:
            "Para a próxima aula, todos devem criar uma conta gratuita no Webflow e explorar a interface. Façam capturas de tela das principais seções que encontrarem.",
        author: "Paulo Henrique",
        date: "17 de Janeiro",
        time: "10:15",
        comments: [
            {
                id: "c2",
                author: "João Santos",
                content: "Professor, consegui criar a conta! A interface é bem intuitiva.",
                date: "17 de Janeiro",
            },
            {
                id: "c3",
                author: "Ana Costa",
                content:
                    "Tenho uma dúvida sobre o plano gratuito. Ele tem todas as funcionalidades?",
                date: "17 de Janeiro",
            },
        ],
    },
];

const Classroom: React.FC<ClassroomProps> = ({ courseTitle, instructor }) => {
    const [posts] = useState<ClassroomPost[]>(mockPosts);
    const [expandedComments, setExpandedComments] = useState<string[]>([]);

    const toggleComments = (postId: string) => {
        setExpandedComments((prev) =>
            prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
        );
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
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
                <h1 className="text-2xl font-bold mb-2">{courseTitle}</h1>
                <p className="text-orange-100">Professor: {instructor}</p>
                <div className="flex items-center space-x-4 mt-4 text-orange-100">
                    <div className="flex items-center space-x-1">
                        <Users size={16} />
                        <span className="text-sm">89 alunos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span className="text-sm">Janeiro 2025</span>
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                            post.pinned ? "border-orange-200 bg-orange-50" : "border-gray-200"
                        }`}
                    >
                        <div className="p-6">
                            {/* Post Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                                        <User className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {post.author}
                                            </h3>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {getPostTypeLabel(post.type)}
                                            </span>
                                            {post.pinned && (
                                                <Pin className="text-orange-500" size={14} />
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Calendar size={14} />
                                            <span>{post.date}</span>
                                            <Clock size={14} />
                                            <span>{post.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getPostIcon(post.type)}
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                                <p className="text-gray-700 leading-relaxed">{post.content}</p>
                            </div>

                            {/* Attachments */}
                            {post.attachments && post.attachments.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="font-medium text-gray-900 mb-2">Anexos:</h5>
                                    <div className="space-y-2">
                                        {post.attachments.map((attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <FileText className="text-gray-500" size={20} />
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {attachment.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {attachment.size}
                                                        </p>
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
                            )}

                            {/* Comments */}
                            {post.comments && post.comments.length > 0 && (
                                <div className="border-t border-gray-200 pt-4">
                                    <button
                                        onClick={() => toggleComments(post.id)}
                                        className="text-sm text-gray-600 hover:text-gray-900 mb-3"
                                    >
                                        {expandedComments.includes(post.id) ? "Ocultar" : "Ver"}{" "}
                                        comentários ({post.comments.length})
                                    </button>

                                    {expandedComments.includes(post.id) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-3"
                                        >
                                            {post.comments.map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="flex space-x-3 p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                                                        <User className="text-white" size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="font-medium text-gray-900">
                                                                {comment.author}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {comment.date}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Classroom;
