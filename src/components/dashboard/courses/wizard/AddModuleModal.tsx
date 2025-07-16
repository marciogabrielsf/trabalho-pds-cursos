import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AddLessonModal from "./AddLessonModal";

interface ModuleData {
    title: string;
    description: string;
    lessons: {
        id: string;
        title: string;
        type: "VIDEO" | "QUIZ" | "TEXT";
        description: string;
        content: Record<string, unknown>;
        order: number;
    }[];
}

interface AddModuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (moduleData: ModuleData) => void;
    initialData?: ModuleData | null;
}

export default function AddModuleModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: AddModuleModalProps) {
    const [moduleData, setModuleData] = useState<ModuleData>({
        title: "",
        description: "",
        lessons: [],
    });
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<string | null>(null);

    // Update moduleData when initialData changes or when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setModuleData(initialData);
            } else {
                setModuleData({
                    title: "",
                    description: "",
                    lessons: [],
                });
            }
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(moduleData);
        setModuleData({
            title: "",
            description: "",
            lessons: [],
        });
    };

    const handleAddLesson = (lessonData: {
        title: string;
        type: "VIDEO" | "QUIZ" | "TEXT";
        description: string;
        content: Record<string, unknown>;
    }) => {
        const newLesson = {
            id: `new-lesson-${Date.now()}`,
            ...lessonData,
            order: moduleData.lessons.length + 1,
        };

        setModuleData((prev) => ({
            ...prev,
            lessons: [...prev.lessons, newLesson],
        }));
        setIsLessonModalOpen(false);
    };

    const handleEditLesson = (lessonId: string) => {
        setEditingLesson(lessonId);
        setIsLessonModalOpen(true);
    };

    const handleUpdateLesson = (lessonData: {
        title: string;
        type: "VIDEO" | "QUIZ" | "TEXT";
        description: string;
        content: Record<string, unknown>;
    }) => {
        if (!editingLesson) return;

        const updatedLessons = moduleData.lessons.map((lesson) =>
            lesson.id === editingLesson ? { ...lesson, ...lessonData } : lesson
        );

        setModuleData((prev) => ({
            ...prev,
            lessons: updatedLessons,
        }));
        setIsLessonModalOpen(false);
        setEditingLesson(null);
    };

    const handleDeleteLesson = (lessonId: string) => {
        const updatedLessons = moduleData.lessons.filter((lesson) => lesson.id !== lessonId);
        setModuleData((prev) => ({
            ...prev,
            lessons: updatedLessons,
        }));
    };

    const editingLessonData = editingLesson
        ? moduleData.lessons.find((lesson) => lesson.id === editingLesson)
        : null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Módulo" : "Adicionar Módulo"}</DialogTitle>
                    <DialogDescription>
                        Preencha as informações do módulo e adicione as aulas desejadas.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Module Title */}
                        <div className="space-y-2">
                            <Label htmlFor="module-title">Título do módulo</Label>
                            <Input
                                id="module-title"
                                type="text"
                                value={moduleData.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setModuleData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                placeholder="Coloque aqui o título da atividade"
                                required
                            />
                        </div>

                        {/* Module Description */}
                        <div className="space-y-2">
                            <Label htmlFor="module-description">Descrição do módulo</Label>
                            <textarea
                                id="module-description"
                                value={moduleData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setModuleData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Descreva o conteúdo do módulo..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows={3}
                                required
                            />
                        </div>

                        {/* Add Lesson Button */}
                        <button
                            type="button"
                            onClick={() => setIsLessonModalOpen(true)}
                            className="w-full bg-orange-100 text-orange-600 p-4 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center space-x-2"
                        >
                            <Plus size={20} />
                            <span>Adicionar Aula</span>
                        </button>

                        {/* Lessons List */}
                        <div className="space-y-3">
                            {moduleData.lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs">
                                            {lesson.order}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                {lesson.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">{lesson.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEditLesson(lesson.id)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-secondary hover:bg-purple-700">
                            {initialData ? "Salvar Alterações" : "Criar Módulo"}
                        </Button>
                    </DialogFooter>
                </form>

                {/* Add Lesson Modal */}
                <AddLessonModal
                    isOpen={isLessonModalOpen}
                    onClose={() => {
                        setIsLessonModalOpen(false);
                        setEditingLesson(null);
                    }}
                    onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson}
                    initialData={editingLessonData}
                />
            </DialogContent>
        </Dialog>
    );
}
