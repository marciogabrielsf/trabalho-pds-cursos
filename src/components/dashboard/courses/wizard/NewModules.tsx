import React, { useState, useMemo } from "react";
import { CourseWizardData } from "@/app/dashboard/teacher/create-course/page";
import { Plus, Edit, Trash2, Menu } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useTeacherModules } from "@/hooks/useModuleQuery";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddModuleModal from "./AddModuleModal";
import AddLessonModal from "./AddLessonModal";

interface LessonData {
    id: string;
    title: string;
    type: "VIDEO" | "QUIZ" | "TEXT";
    description: string;
    content: Record<string, unknown>;
    order: number;
}

interface ModuleData {
    id: string;
    title: string;
    description: string;
    lessons: LessonData[];
}

// Tipo unificado para módulos existentes e novos
interface UnifiedModuleData {
    id: string;
    title: string;
    description: string;
    lessons: LessonData[];
    isExisting: boolean;
    originalId?: number; // Para módulos existentes
}

interface NewModulesProps {
    data: CourseWizardData;
    onChange: (data: Partial<CourseWizardData>) => void;
}

// Componente para aula sortável
function SortableLesson({
    lesson,
    onEdit,
    onDelete,
}: {
    lesson: LessonData;
    onEdit: (lessonId: string) => void;
    onDelete: (lessonId: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: lesson.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
            <button
                {...attributes}
                {...listeners}
                className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
                <Menu size={16} />
            </button>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">
                {lesson.type}
            </span>
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onEdit(lesson.id)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <Edit size={14} />
                </button>
                <button
                    onClick={() => onDelete(lesson.id)}
                    className="text-red-400 hover:text-red-600"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

// Componente para módulo sortável
function SortableModule({
    module,
    index,
    onEdit,
    onDelete,
    onUpdateLessons,
    onEditLesson,
    onDeleteLesson,
    isExisting = false,
}: {
    module: ModuleData;
    index: number;
    onEdit: (moduleId: string) => void;
    onDelete: (moduleId: string) => void;
    onUpdateLessons: (moduleId: string, lessons: LessonData[]) => void;
    onEditLesson: (moduleId: string, lessonId: string) => void;
    onDeleteLesson: (moduleId: string, lessonId: string) => void;
    isExisting?: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: module.id,
        disabled: false, // Permitir drag para todos os módulos
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const lessonSensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleLessonDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = module.lessons.findIndex(
                (lesson: LessonData) => lesson.id === active.id
            );
            const newIndex = module.lessons.findIndex(
                (lesson: LessonData) => lesson.id === over?.id
            );

            const newLessons = arrayMove(module.lessons, oldIndex, newIndex);
            onUpdateLessons(module.id, newLessons);
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <button
                        {...attributes}
                        {...listeners}
                        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">
                            Sections {String(index + 1).padStart(2, "0")}:
                        </span>
                        <span className="font-medium text-gray-900">{module.title}</span>
                        {isExisting && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Existente
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEdit(module.id)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(module.id)}
                        className="text-red-400 hover:text-red-600"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Lessons */}
            <div className="ml-6 space-y-2">
                <DndContext
                    sensors={lessonSensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleLessonDragEnd}
                >
                    <SortableContext
                        items={module.lessons.map((lesson: LessonData) => lesson.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {module.lessons.map((lesson: LessonData) => (
                            <SortableLesson
                                key={lesson.id}
                                lesson={lesson}
                                onEdit={() => onEditLesson(module.id, lesson.id)}
                                onDelete={() => onDeleteLesson(module.id, lesson.id)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}

export default function NewModules({ data, onChange }: NewModulesProps) {
    const { user } = useAuthStore();
    const { data: existingModules = [] } = useTeacherModules(user?.id || 0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<string | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<{
        moduleId: string;
        lessonId: string;
    } | null>(null);

    // Combinar módulos existentes selecionados com novos módulos baseado na ordem
    const allModules: UnifiedModuleData[] = useMemo(() => {
        console.log("Building allModules with order:", data.moduleOrder);

        return data.moduleOrder
            .map((orderItem) => {
                if (orderItem.type === "existing" && orderItem.originalId) {
                    const existingModule = existingModules.find(
                        (m) => m.id === orderItem.originalId
                    );
                    if (!existingModule) {
                        console.log(
                            "Could not find existing module with ID:",
                            orderItem.originalId
                        );
                        return null;
                    }

                    return {
                        id: orderItem.id,
                        title: existingModule.title,
                        description: existingModule.description,
                        lessons:
                            existingModule.lessons?.map((lesson) => ({
                                id: `existing-lesson-${lesson.id}`,
                                title: lesson.title,
                                type: lesson.type,
                                description: lesson.description || "",
                                content: {},
                                order: lesson.order,
                            })) || [],
                        isExisting: true,
                        originalId: orderItem.originalId,
                    };
                } else if (orderItem.type === "new") {
                    const newModule = data.newModules.find((m) => m.id === orderItem.id);
                    if (!newModule) {
                        console.log("Could not find new module with ID:", orderItem.id);
                        return null;
                    }

                    return {
                        ...newModule,
                        isExisting: false,
                    };
                }
                return null;
            })
            .filter((module): module is UnifiedModuleData => module !== null);
    }, [data.moduleOrder, data.newModules, existingModules]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddModule = (moduleData: {
        title: string;
        description: string;
        lessons: LessonData[];
    }) => {
        const newModule = {
            id: Date.now().toString(),
            ...moduleData,
        };

        const newModules = [...data.newModules, newModule];
        const moduleOrder = [
            ...data.moduleOrder,
            {
                id: newModule.id,
                type: "new" as const,
            },
        ];

        onChange({
            newModules,
            moduleOrder,
        });
        setIsModalOpen(false);
    };

    const handleEditModule = (moduleId: string) => {
        // Só permite editar módulos novos, não existentes
        if (moduleId.startsWith("existing-")) {
            return; // Não permite editar módulos existentes
        }
        setEditingModule(moduleId);
        setIsModalOpen(true);
    };

    const handleUpdateModule = (moduleData: {
        title: string;
        description: string;
        lessons: LessonData[];
    }) => {
        if (!editingModule) return;

        const updatedModules = data.newModules.map((mod) =>
            mod.id === editingModule ? { ...mod, ...moduleData } : mod
        );

        onChange({ newModules: updatedModules });
        setIsModalOpen(false);
        setEditingModule(null);
    };

    const handleDeleteModule = (moduleId: string) => {
        if (moduleId.startsWith("existing-")) {
            // Remover módulo existente da seleção
            const originalId = parseInt(moduleId.replace("existing-", ""));
            const updatedSelectedModules = data.selectedModules.filter((id) => id !== originalId);
            const updatedModuleOrder = data.moduleOrder.filter(
                (order) => !(order.type === "existing" && order.originalId === originalId)
            );
            onChange({ selectedModules: updatedSelectedModules, moduleOrder: updatedModuleOrder });
        } else {
            // Remover módulo novo
            const updatedModules = data.newModules.filter((mod) => mod.id !== moduleId);
            const updatedModuleOrder = data.moduleOrder.filter(
                (order) => !(order.type === "new" && order.id === moduleId)
            );
            onChange({ newModules: updatedModules, moduleOrder: updatedModuleOrder });
        }
    };

    const handleUpdateLessons = (moduleId: string, lessons: LessonData[]) => {
        const updatedModules = data.newModules.map((mod) =>
            mod.id === moduleId ? { ...mod, lessons } : mod
        );
        onChange({ newModules: updatedModules });
    };

    const handleEditLesson = (moduleId: string, lessonId: string) => {
        setEditingLesson({ moduleId, lessonId });
        setIsLessonModalOpen(true);
    };

    const handleDeleteLesson = (moduleId: string, lessonId: string) => {
        const updatedModules = data.newModules.map((mod) => {
            if (mod.id === moduleId) {
                return {
                    ...mod,
                    lessons: mod.lessons.filter((lesson) => lesson.id !== lessonId),
                };
            }
            return mod;
        });
        onChange({ newModules: updatedModules });
    };

    const handleUpdateLesson = (lessonData: {
        title: string;
        type: "VIDEO" | "QUIZ" | "TEXT";
        description: string;
        content: Record<string, unknown>;
    }) => {
        if (!editingLesson) return;

        const updatedModules = data.newModules.map((mod) => {
            if (mod.id === editingLesson.moduleId) {
                return {
                    ...mod,
                    lessons: mod.lessons.map((lesson) =>
                        lesson.id === editingLesson.lessonId ? { ...lesson, ...lessonData } : lesson
                    ),
                };
            }
            return mod;
        });

        onChange({ newModules: updatedModules });
        setIsLessonModalOpen(false);
        setEditingLesson(null);
    };

    function handleModuleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            console.log("Dragging:", active.id, "to:", over?.id);

            const oldIndex = allModules.findIndex((module) => module.id === active.id);
            const newIndex = allModules.findIndex((module) => module.id === over?.id);

            if (oldIndex === -1 || newIndex === -1) {
                return;
            }

            const reorderedModules = arrayMove(allModules, oldIndex, newIndex);

            // Atualizar a ordem dos módulos
            const newModuleOrder = reorderedModules.map((module) => {
                if (module.isExisting && module.originalId) {
                    return {
                        id: module.id,
                        type: "existing" as const,
                        originalId: module.originalId,
                    };
                } else {
                    return {
                        id: module.id,
                        type: "new" as const,
                    };
                }
            });

            console.log("New module order:", newModuleOrder);

            onChange({
                moduleOrder: newModuleOrder,
            });
        }
    }

    const editingModuleData = editingModule
        ? data.newModules.find((mod) => mod.id === editingModule)
        : null;

    const editingLessonData = editingLesson
        ? data.newModules
              .find((mod) => mod.id === editingLesson.moduleId)
              ?.lessons.find((lesson) => lesson.id === editingLesson.lessonId)
        : null;

    return (
        <div className="p-6 text-black">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Organizar módulos do curso</h3>
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-orange-100 text-orange-600 p-4 rounded-lg hover:bg-orange-200 transition-colors mb-6 flex items-center justify-center space-x-2"
            >
                <Plus size={20} />
                <span>Add Módulo</span>
            </button>

            {/* Modules List with Drag and Drop */}
            <div className="space-y-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleModuleDragEnd}
                >
                    <SortableContext
                        items={allModules.map((module) => module.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {allModules.map((module, index) => (
                            <SortableModule
                                key={`${module.id}-${index}`}
                                module={module}
                                index={index}
                                onEdit={handleEditModule}
                                onDelete={handleDeleteModule}
                                onUpdateLessons={handleUpdateLessons}
                                onEditLesson={handleEditLesson}
                                onDeleteLesson={handleDeleteLesson}
                                isExisting={module.isExisting}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {allModules.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhum módulo criado
                    </h3>
                    <p className="text-gray-600">
                        Clique em &quot;Add Módulo&quot; para criar seu primeiro módulo, ou
                        selecione módulos existentes na etapa anterior.
                    </p>
                </div>
            )}

            {/* Add Module Modal */}
            <AddModuleModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingModule(null);
                }}
                onSubmit={editingModule ? handleUpdateModule : handleAddModule}
                initialData={editingModuleData}
            />

            {/* Edit Lesson Modal */}
            <AddLessonModal
                isOpen={isLessonModalOpen}
                onClose={() => {
                    setIsLessonModalOpen(false);
                    setEditingLesson(null);
                }}
                onSubmit={handleUpdateLesson}
                initialData={editingLessonData}
            />
        </div>
    );
}
