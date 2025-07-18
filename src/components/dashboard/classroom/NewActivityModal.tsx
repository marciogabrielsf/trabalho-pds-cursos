"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Star, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import { TaskCreate } from "@/types/activity";

interface NewActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (activity: TaskCreate) => void;
    courseId: number;
}

const NewActivityModal: React.FC<NewActivityModalProps> = ({
    isOpen,
    onClose,
    onSave,
    courseId,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        points: 100,
        max_delivery_time: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title && formData.description && formData.points) {
            onSave({
                ...formData,
                course_id: courseId,
            });
            setFormData({
                title: "",
                description: "",
                points: 100,
                max_delivery_time: "",
            });
            onClose();
        }
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 "
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Nova Atividade</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título da Atividade *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    placeholder="Ex: Trabalho 01 - Prova"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Descreva o que os alunos devem fazer nesta atividade..."
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Star className="inline w-4 h-4 mr-1" />
                                        Pontuação *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) =>
                                            handleChange("points", parseInt(e.target.value) || 0)
                                        }
                                        placeholder="100"
                                        min="0"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="inline w-4 h-4 mr-1" />
                                        Prazo de Entrega
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.max_delivery_time}
                                        onChange={(e) =>
                                            handleChange("max_delivery_time", e.target.value)
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                                <div className="bg-white rounded border p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="text-blue-500" size={16} />
                                        <span className="font-medium text-gray-900">
                                            {formData.title || "Título da atividade"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {formData.description || "Descrição da atividade"}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>{formData.points || "0"} pontos</span>
                                        {formData.max_delivery_time && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    Prazo:{" "}
                                                    {new Date(
                                                        formData.max_delivery_time
                                                    ).toLocaleDateString("pt-BR")}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <Button type="submit" className="w-auto py-2 px-6">
                                    Criar Atividade
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewActivityModal;
