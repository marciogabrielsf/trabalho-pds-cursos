"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Clock, Star, Download, Eye, Calendar } from "lucide-react";
import { Task, TaskDelivery } from "@/types/activity";
import Button from "@/components/ui/Button";

interface TeacherActivityPageProps {
    activity: Task;
    submissions: TaskDelivery[];
    onBack: () => void;
}

const TeacherActivityPage: React.FC<TeacherActivityPageProps> = ({
    activity,
    submissions,
    onBack,
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="flex-1 max-w-6xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={onBack}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 w-auto py-2 px-4"
                            >
                                <ArrowLeft size={20} />
                                Voltar
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                Criado em {activity.created_at && formatDate(activity.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                Prazo:{" "}
                                {activity.max_delivery_time &&
                                    formatDate(activity.max_delivery_time)}
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{activity.title}</h1>
                        <p className="text-gray-600 mb-3">{activity.description}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Star className="text-yellow-500" size={16} />
                                <span className="font-medium">{activity.points} pontos</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="text-highlight" size={16} />
                                <span>{submissions.length} entrega(s)</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Lista de Entregas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm border"
                >
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Entregas dos Alunos</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {submissions.length} de {submissions.length} alunos entregaram
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {submissions.length > 0 ? (
                            submissions.map((submission) => (
                                <SubmissionCard
                                    key={submission.id}
                                    submission={submission}
                                    formatDateTime={formatDateTime}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>Nenhuma entrega recebida ainda</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

interface SubmissionCardProps {
    submission: TaskDelivery;
    formatDateTime: (date: string) => string;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, formatDateTime }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-highlight/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-highlight">
                            {(submission.student_name || "E")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">
                            {submission.student_name || "Estudante"}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span>Conteúdo: {submission.content}</span>
                            <span>•</span>
                            <span>
                                Entregue em{" "}
                                {submission.created_at && formatDateTime(submission.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                        Entregue
                    </span>

                    <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                            <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {submission.grade && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Nota:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {submission.grade}/10
                        </span>
                    </div>
                    {submission.feedback && (
                        <div className="mt-2">
                            <span className="text-sm text-gray-600">Feedback:</span>
                            <p className="text-sm text-gray-800 mt-1">{submission.feedback}</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default TeacherActivityPage;
