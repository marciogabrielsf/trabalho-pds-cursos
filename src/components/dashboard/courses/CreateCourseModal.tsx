import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (courseData: CourseFormData) => void;
    isLoading?: boolean;
}

export interface CourseFormData {
    title: string;
    description: string;
    value: number;
    teacher_id: number;
    trailer_url: string;
    thumbnail_url: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    category: "PROGRAMMING" | "DESIGN" | "BUSINESS" | "MARKETING" | "PHOTOGRAPHY" | "MUSIC";
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<CourseFormData>({
        title: "",
        description: "",
        value: 0,
        teacher_id: 1, // TODO: Get from auth store
        trailer_url: "",
        thumbnail_url: "",
        difficulty: "BEGINNER",
        category: "PROGRAMMING",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "value" ? parseFloat(value) || 0 : value,
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Criar Novo Curso</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título do Curso
                        </label>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Ex: Desenvolvimento Web com React"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Descreva o conteúdo do seu curso..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preço (R$)
                            </label>
                            <Input
                                type="number"
                                name="value"
                                value={formData.value}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoria
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            >
                                <option value="PROGRAMMING">Programação</option>
                                <option value="DESIGN">Design</option>
                                <option value="BUSINESS">Negócios</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="PHOTOGRAPHY">Fotografia</option>
                                <option value="MUSIC">Música</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dificuldade
                        </label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        >
                            <option value="BEGINNER">Iniciante</option>
                            <option value="INTERMEDIATE">Intermediário</option>
                            <option value="ADVANCED">Avançado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL do Trailer
                        </label>
                        <Input
                            type="url"
                            name="trailer_url"
                            value={formData.trailer_url}
                            onChange={handleInputChange}
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL da Thumbnail
                        </label>
                        <Input
                            type="url"
                            name="thumbnail_url"
                            value={formData.thumbnail_url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Criando..." : "Criar Curso"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourseModal;
