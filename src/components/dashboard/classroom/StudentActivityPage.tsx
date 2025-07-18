"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    Clock,
    Star,
    Calendar,
    FileText,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";
import { Task } from "@/types/activity";
import Button from "@/components/ui/Button";
import { useCreateDelivery } from "@/hooks/useTaskQuery";
import { useAuthStore } from "@/stores/authStore";

interface StudentActivityPageProps {
    activity: Task;
    onBack: () => void;
    hasSubmitted?: boolean;
    submissionFile?: string;
    submittedAt?: string;
    grade?: number;
    feedback?: string;
}

const StudentActivityPage: React.FC<StudentActivityPageProps> = ({
    activity,
    onBack,
    hasSubmitted = false,
    submissionFile,
    submittedAt,
    grade,
    feedback,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submissionText, setSubmissionText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuthStore();
    const createDeliveryMutation = useCreateDelivery();

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

    const isOverdue = () => {
        if (!activity.max_delivery_time) return false;
        return new Date() > new Date(activity.max_delivery_time);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile || !user?.id) return;

        setIsSubmitting(true);

        try {
            // Por enquanto, vamos simular um upload e usar o nome do arquivo
            // Em uma implementação real, você faria upload do arquivo primeiro
            const fileUrl = `/uploads/${selectedFile.name}`;

            await createDeliveryMutation.mutateAsync({
                deliveryData: {
                    content: submissionText || `Entrega do arquivo: ${selectedFile.name}`,
                    file_url: fileUrl,
                    task_id: activity.id,
                },
                studentId: user.id,
            });

            // Após sucesso, voltar para a página principal para atualizar os dados
            onBack();
        } catch (error) {
            console.error("Erro ao enviar entrega:", error);
            alert("Erro ao enviar entrega. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getActivityTypeIcon = (type?: string) => {
        switch (type) {
            case "assignment":
                return <Star className="text-green-500" size={20} />;
            case "presentation":
                return <FileText className="text-blue-500" size={20} />;
            case "project":
                return <FileText className="text-orange-500" size={20} />;
            default:
                return <FileText className="text-gray-500" size={20} />;
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="flex-1 max-w-4xl mx-auto p-6">
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
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900  py-2 px-4"
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
                        <div className="flex items-center gap-3 mb-3">
                            {getActivityTypeIcon()}
                            <h1 className="text-2xl font-bold text-gray-900">{activity.title}</h1>
                        </div>
                        <p className="text-gray-600 mb-4">{activity.description}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Star className="text-yellow-500" size={16} />
                                <span className="font-medium">{activity.points} pontos</span>
                            </div>
                            {isOverdue() && !hasSubmitted && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertTriangle size={16} />
                                    <span>Prazo expirado</span>
                                </div>
                            )}
                            {hasSubmitted && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle size={16} />
                                    <span>Entregue</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Status da Entrega */}
                {hasSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="text-green-600" size={24} />
                            <h3 className="text-lg font-semibold text-green-800">
                                Atividade Entregue
                            </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p className="text-green-700">
                                <strong>Arquivo:</strong> {submissionFile}
                            </p>
                            <p className="text-green-700">
                                <strong>Entregue em:</strong>{" "}
                                {submittedAt && formatDateTime(submittedAt)}
                            </p>
                            {grade !== undefined && (
                                <p className="text-green-700">
                                    <strong>Nota:</strong> {grade}/{activity.points}
                                </p>
                            )}
                            {feedback && (
                                <div className="mt-3 p-3 bg-white rounded border">
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        Feedback do Professor:
                                    </p>
                                    <p className="text-gray-800">{feedback}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Área de Entrega */}
                {!hasSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sua Entrega</h3>

                        {!isOverdue() ? (
                            <div className="space-y-6">
                                {/* Upload de Arquivo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Arquivo da Entrega
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="file-upload"
                                            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload
                                                className="mx-auto text-gray-400 mb-3"
                                                size={48}
                                            />
                                            <p className="text-gray-600">
                                                Clique para selecionar um arquivo ou arraste aqui
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PDF, DOC, DOCX, TXT, ZIP, RAR (máx. 10MB)
                                            </p>
                                        </label>
                                    </div>
                                    {selectedFile && (
                                        <div className="mt-2 p-3 bg-blue-50 rounded border flex items-center gap-2">
                                            <FileText className="text-blue-600" size={16} />
                                            <span className="text-sm text-blue-800">
                                                {selectedFile.name}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Comentário Opcional */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comentário (opcional)
                                    </label>
                                    <textarea
                                        value={submissionText}
                                        onChange={(e) => setSubmissionText(e.target.value)}
                                        placeholder="Adicione um comentário sobre sua entrega..."
                                        className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Botão de Entrega */}
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!selectedFile || isSubmitting}
                                        className="w-auto py-2 px-6"
                                    >
                                        {isSubmitting ? "Enviando..." : "Entregar Atividade"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <AlertTriangle className="mx-auto text-red-400 mb-4" size={64} />
                                <h4 className="text-lg font-medium text-red-600 mb-2">
                                    Prazo Expirado
                                </h4>
                                <p className="text-gray-600">
                                    O prazo para entrega desta atividade já passou.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default StudentActivityPage;
