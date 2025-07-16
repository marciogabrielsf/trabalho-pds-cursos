"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { TeacherSidebar } from "@/components/dashboard/layout";
import {
    ArrowLeft,
    ArrowRight,
    Book,
    DollarSign,
    PlayCircle,
    FileText,
    HelpCircle,
    Edit,
    Plus,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CourseBasicInfo from "@/components/dashboard/courses/wizard/CourseBasicInfo";
import { useUpdateCourse } from "@/hooks/useTeacherQuery";
import { useCourseByIdQuery, useCourseModulesQuery } from "@/hooks/useCourseQuery";
import {
    useAddModuleToCourse,
    useTeacherModules,
    useCreateModule,
    useCreateLesson,
    useUpdateModule,
    useUpdateLesson,
} from "@/hooks/useModuleQuery";
import ExistingModules from "@/components/dashboard/courses/wizard/ExistingModules";
import NewModules from "@/components/dashboard/courses/wizard/NewModules";
import { CourseWizardData } from "@/types/courseWizard";
import { Lesson } from "@/types/lesson";

type ModuleOrderItem = CourseWizardData["moduleOrder"][0];
type NewModuleItem = CourseWizardData["newModules"][0];

const steps = [
    { id: 1, title: "Informações básicas", description: "Editar informações do curso" },
    { id: 2, title: "Módulos existentes", description: "Gerenciar módulos existentes" },
    { id: 3, title: "Novos módulos", description: "Adicionar novos módulos" },
    { id: 4, title: "Currículo do curso", description: "Revisar alterações" },
];

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [wizardData, setWizardData] = useState<CourseWizardData>({
        title: "",
        description: "",
        value: 0,
        trailer_url: "",
        thumbnail_url: "",
        difficulty: "BEGINNER",
        category: "PROGRAMMING",
        selectedModules: [],
        newModules: [],
        moduleOrder: [],
    });

    const courseId = Number(params.id);
    const updateCourseMutation = useUpdateCourse();
    const { mutateAsync: addModuleToCourseAsync } = useAddModuleToCourse();
    const { mutateAsync: createModuleAsync } = useCreateModule();
    const { mutateAsync: createLessonAsync } = useCreateLesson();
    const { mutateAsync: updateModuleAsync } = useUpdateModule();
    const { mutateAsync: updateLessonAsync } = useUpdateLesson();
    const { data: existingModules = [] } = useTeacherModules(user?.id || 0);

    console.log("existing modules ", wizardData);

    // Buscar dados básicos do curso
    const {
        data: courseInfo,
        isLoading: courseInfoLoading,
        error: courseInfoError,
    } = useCourseByIdQuery(courseId);

    // Buscar módulos existentes do curso
    const {
        data: courseModules = [],
        isLoading: courseModulesLoading,
        error: courseModulesError,
    } = useCourseModulesQuery(courseId);

    // Carregar dados do curso quando disponível
    useEffect(() => {
        if (courseInfo && courseModules && !courseInfoLoading && !courseModulesLoading) {
            // Mapear módulos existentes do curso como "new" para permitir edição
            const newModules = courseModules.map((m) => ({
                id: `course-module-${m.id}`,
                title: m.title,
                description: m.description,
                lessons:
                    m.lessons?.map((lesson) => {
                        // Usar o conteúdo real da aula se disponível
                        let content: Record<string, unknown> = {};

                        // Verificar se a aula tem conteúdo
                        const lessonWithContent = lesson as Lesson & {
                            content?: Record<string, unknown>;
                        };
                        if (lessonWithContent.content) {
                            content = lessonWithContent.content;
                        } else {
                            // Fallback para conteúdo padrão se não houver conteúdo
                            switch (lesson.type) {
                                case "VIDEO":
                                    content = { videoUrl: "" };
                                    break;
                                case "QUIZ":
                                    content = { questions: [] };
                                    break;
                                case "TEXT":
                                    content = { text: "" };
                                    break;
                            }
                        }

                        return {
                            id: `lesson-${lesson.id}`,
                            title: lesson.title,
                            type: lesson.type as "VIDEO" | "QUIZ" | "TEXT",
                            description: lesson.description || "",
                            content: content,
                            order: lesson.order,
                        };
                    }) || [],
            }));

            const moduleOrder = courseModules.map((m) => ({
                id: `course-module-${m.id}`,
                type: "new" as const,
            }));

            const existingModuleIds = courseModules.map((m) => m.id);

            console.log("existingModuleIds");

            setWizardData({
                title: courseInfo.title || "",
                description: courseInfo.description || "",
                value: courseInfo.value || 0,
                trailer_url: courseInfo.trailer_url || "",
                thumbnail_url: courseInfo.thumbnail_url || "",
                difficulty: (courseInfo.difficulty as CourseWizardData["difficulty"]) || "BEGINNER",
                category: (courseInfo.category as CourseWizardData["category"]) || "PROGRAMMING",
                selectedModules: existingModuleIds, // Módulos externos disponíveis para adicionar
                newModules: newModules, // Módulos do curso (editáveis)
                moduleOrder: moduleOrder, // Ordem dos módulos do curso
            });

            setIsLoading(false);
        }
    }, [courseInfo, courseModules, courseInfoLoading, courseModulesLoading]);

    // Preparar dados para API
    const prepareDataForAPI = useMemo(() => {
        return {
            // Dados básicos do curso
            courseData: {
                title: wizardData.title,
                description: wizardData.description,
                value: wizardData.value,
                teacher_id: user?.id || 1,
                trailer_url: wizardData.trailer_url,
                thumbnail_url: wizardData.thumbnail_url,
                difficulty: wizardData.difficulty,
                category: wizardData.category,
            },

            // Módulos existentes com ordem sequencial
            existingModulesData: wizardData.moduleOrder
                .filter((item: ModuleOrderItem) => item.type === "existing")
                .map((item: ModuleOrderItem) => {
                    const orderIndex = wizardData.moduleOrder.findIndex(
                        (orderItem: ModuleOrderItem) => orderItem.id === item.id
                    );
                    return {
                        module_id: item.originalId!,
                        order: orderIndex + 1,
                    };
                }),

            // Novos módulos para criar com ordem sequencial
            newModulesData: wizardData.moduleOrder
                .filter((item: ModuleOrderItem) => item.type === "new")
                .filter((item: ModuleOrderItem) => !item.id.startsWith("course-module-")) // Só módulos realmente novos
                .map((item: ModuleOrderItem) => {
                    const orderIndex = wizardData.moduleOrder.findIndex(
                        (orderItem: ModuleOrderItem) => orderItem.id === item.id
                    );
                    const moduleData = wizardData.newModules.find(
                        (m: NewModuleItem) => m.id === item.id
                    );
                    return {
                        title: moduleData?.title || "",
                        description: moduleData?.description || "",
                        order: orderIndex + 1,
                        lessons: moduleData?.lessons || [],
                    };
                }),

            // Módulos do curso para atualizar
            courseModulesData: wizardData.moduleOrder
                .filter((item: ModuleOrderItem) => item.type === "new")
                .filter((item: ModuleOrderItem) => item.id.startsWith("course-module-")) // Módulos do curso
                .map((item: ModuleOrderItem) => {
                    const orderIndex = wizardData.moduleOrder.findIndex(
                        (orderItem: ModuleOrderItem) => orderItem.id === item.id
                    );
                    const moduleData = wizardData.newModules.find(
                        (m: NewModuleItem) => m.id === item.id
                    );
                    const originalId = parseInt(item.id.replace("course-module-", ""));
                    return {
                        id: originalId,
                        title: moduleData?.title || "",
                        description: moduleData?.description || "",
                        order: orderIndex + 1,
                        lessons: moduleData?.lessons || [],
                    };
                }),

            // Estatísticas do curso
            stats: {
                totalModules: wizardData.moduleOrder.length,
                existingModules: wizardData.selectedModules.length,
                newModules: wizardData.moduleOrder.filter(
                    (item: ModuleOrderItem) =>
                        item.type === "new" && !item.id.startsWith("course-module-")
                ).length,
                courseModules: wizardData.moduleOrder.filter(
                    (item: ModuleOrderItem) =>
                        item.type === "new" && item.id.startsWith("course-module-")
                ).length,
                totalLessons: wizardData.newModules.reduce(
                    (acc: number, module: NewModuleItem) => acc + module.lessons.length,
                    0
                ),
                moduleOrder: wizardData.moduleOrder,
            },
        };
    }, [wizardData, user?.id]);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = async () => {
        try {
            const apiData = prepareDataForAPI;

            // 1. Atualizar informações básicas do curso
            await updateCourseMutation.mutateAsync({
                courseId,
                courseData: apiData.courseData,
            });

            // 2. Adicionar novos módulos existentes ao curso (se houver)
            for (const moduleData of apiData.existingModulesData) {
                await addModuleToCourseAsync({
                    course_id: courseId,
                    module_id: moduleData.module_id,
                    order: moduleData.order,
                });
            }

            // 3. Atualizar módulos do curso existentes
            for (const courseModuleData of apiData.courseModulesData) {
                // Atualizar o módulo
                await updateModuleAsync({
                    moduleId: courseModuleData.id,
                    moduleData: {
                        title: courseModuleData.title,
                        description: courseModuleData.description,
                        teacher_id: user?.id || 1,
                    },
                });

                // Atualizar as aulas do módulo
                for (const lessonData of courseModuleData.lessons) {
                    const originalLessonId = parseInt(lessonData.id.replace("lesson-", ""));
                    await updateLessonAsync({
                        lessonId: originalLessonId,
                        lessonData: {
                            title: lessonData.title,
                            type: lessonData.type,
                            description: lessonData.description,
                            content: lessonData.content,
                            order: lessonData.order,
                            id_module: courseModuleData.id,
                        },
                    });
                }
            }

            // 4. Criar novos módulos e suas aulas
            for (const newModuleData of apiData.newModulesData) {
                // Criar o módulo
                const createdModule = await createModuleAsync({
                    title: newModuleData.title,
                    description: newModuleData.description,
                    teacher_id: user?.id || 1,
                });

                // Adicionar o módulo ao curso
                await addModuleToCourseAsync({
                    course_id: courseId,
                    module_id: createdModule.id,
                    order: newModuleData.order,
                });

                // Criar as aulas do módulo
                for (const lessonData of newModuleData.lessons) {
                    await createLessonAsync({
                        title: lessonData.title,
                        type: lessonData.type,
                        description: lessonData.description,
                        content: lessonData.content,
                        order: lessonData.order,
                        id_module: createdModule.id,
                    });
                }
            }

            console.log("Dados para API:", apiData);
            console.log("Curso atualizado com sucesso!");
            alert("Curso atualizado com sucesso!");
            router.push(`/dashboard/teacher/course/${courseId}`);
        } catch (error) {
            alert("Erro ao atualizar curso. Tente novamente.");
            console.error("Error updating course:", error);
        }
    };

    const updateWizardData = (data: Partial<CourseWizardData>) => {
        setWizardData((prev: CourseWizardData) => ({ ...prev, ...data }));
    };

    // Loading state
    if (isLoading || courseInfoLoading || courseModulesLoading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <TeacherSidebar />
                <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Carregando curso...
                            </h1>
                            <p className="text-gray-600">
                                Aguarde enquanto carregamos as informações do curso.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (courseInfoError || courseModulesError) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <TeacherSidebar />
                <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Erro ao carregar curso
                            </h1>
                            <p className="text-gray-600 mb-4">
                                Não foi possível carregar as informações do curso.
                            </p>
                            <button
                                onClick={() => router.push("/dashboard/teacher")}
                                className="text-orange-500 hover:text-orange-600"
                            >
                                Voltar para o Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <CourseBasicInfo data={wizardData} onChange={updateWizardData} />;
            case 2:
                return <ExistingModules data={wizardData} onChange={updateWizardData} />;
            case 3:
                return <NewModules data={wizardData} onChange={updateWizardData} />;
            case 4:
                return (
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-6 flex items-center">
                            <Edit className="w-6 h-6 mr-2 text-orange-500" />
                            Resumo das Alterações
                        </h3>

                        {/* Informações Básicas */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Book className="w-5 h-5 mr-2" />
                                Informações Básicas
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Título</p>
                                    <p className="font-medium">{wizardData.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Categoria</p>
                                    <p className="font-medium">{wizardData.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Dificuldade</p>
                                    <p className="font-medium">{wizardData.difficulty}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 flex items-center">
                                        <DollarSign className="w-4 h-4 mr-1" />
                                        Valor
                                    </p>
                                    <p className="font-medium">R$ {wizardData.value.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">Descrição</p>
                                <p className="text-gray-800">{wizardData.description}</p>
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600">Total de Módulos</p>
                                        <p className="text-2xl font-bold text-blue-800">
                                            {prepareDataForAPI.stats.totalModules}
                                        </p>
                                    </div>
                                    <Book className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-600">Módulos do Curso</p>
                                        <p className="text-2xl font-bold text-green-800">
                                            {prepareDataForAPI.stats.courseModules}
                                        </p>
                                    </div>
                                    <Edit className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-600">Novos Módulos</p>
                                        <p className="text-2xl font-bold text-purple-800">
                                            {prepareDataForAPI.stats.newModules}
                                        </p>
                                    </div>
                                    <Plus className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-orange-600">Total de Aulas</p>
                                        <p className="text-2xl font-bold text-orange-800">
                                            {prepareDataForAPI.stats.totalLessons}
                                        </p>
                                    </div>
                                    <PlayCircle className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>

                        {/* Estrutura do Curso */}
                        <div className="bg-white border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-4">
                                Estrutura Atualizada do Curso
                            </h4>
                            <div className="space-y-3">
                                {prepareDataForAPI.stats.moduleOrder.map(
                                    (item: ModuleOrderItem, index: number) => {
                                        const moduleData =
                                            item.type === "existing"
                                                ? existingModules.find(
                                                      (m) => m.id === item.originalId
                                                  )
                                                : wizardData.newModules.find(
                                                      (m) => m.id === item.id
                                                  );

                                        if (!moduleData) return null;

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h5 className="font-medium text-gray-900">
                                                            {moduleData.title}
                                                        </h5>{" "}
                                                        {item.type === "existing" && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                Existente
                                                            </span>
                                                        )}
                                                        {item.type === "new" &&
                                                            item.id.startsWith(
                                                                "course-module-"
                                                            ) && (
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                    Curso
                                                                </span>
                                                            )}
                                                        {item.type === "new" &&
                                                            !item.id.startsWith(
                                                                "course-module-"
                                                            ) && (
                                                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                                    Novo
                                                                </span>
                                                            )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {moduleData.description}
                                                    </p>
                                                    {item.type === "new" && (
                                                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                                            <span className="flex items-center">
                                                                <PlayCircle className="w-3 h-3 mr-1" />
                                                                {moduleData.lessons?.filter(
                                                                    (l) => l.type === "VIDEO"
                                                                ).length || 0}{" "}
                                                                vídeos
                                                            </span>
                                                            <span className="flex items-center">
                                                                <HelpCircle className="w-3 h-3 mr-1" />
                                                                {moduleData.lessons?.filter(
                                                                    (l) => l.type === "QUIZ"
                                                                ).length || 0}{" "}
                                                                quizzes
                                                            </span>
                                                            <span className="flex items-center">
                                                                <FileText className="w-3 h-3 mr-1" />
                                                                {moduleData.lessons?.filter(
                                                                    (l) => l.type === "TEXT"
                                                                ).length || 0}{" "}
                                                                textos
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {/* Dados para API (Debug) */}
                        {process.env.NODE_ENV === "development" && (
                            <div className="mt-6 bg-gray-100 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Dados para API (Debug)
                                </h4>
                                <pre className="text-xs text-gray-600 overflow-x-auto">
                                    {JSON.stringify(prepareDataForAPI, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <TeacherSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push(`/dashboard/teacher/course/${courseId}`)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Editando Curso</h1>
                                <p className="text-gray-600 text-sm">
                                    {courseInfo?.title || "Carregando..."}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Edit size={16} />
                            <span>MODO EDIÇÃO</span>
                        </div>
                    </div>
                </header>

                {/* Steps Progress */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex items-center ${
                                    index < steps.length - 1 ? "flex-1" : ""
                                }`}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                            currentStep >= step.id
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-200 text-gray-600"
                                        }`}
                                    >
                                        {step.id}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                            {step.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {step.description}
                                        </div>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 mx-4">
                                        <div
                                            className={`h-0.5 ${
                                                currentStep > step.id
                                                    ? "bg-orange-500"
                                                    : "bg-gray-200"
                                            }`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="mx-auto">
                        <div className="bg-white rounded-lg shadow-sm">{renderStepContent()}</div>

                        {/* Navigation */}
                        <div className="flex justify-end mt-6">
                            <div className="flex min-w-xl gap-5">
                                <Button
                                    variant="secondary"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className="flex items-center space-x-2"
                                >
                                    <ArrowLeft size={16} />
                                    <span>Voltar</span>
                                </Button>

                                {currentStep < steps.length ? (
                                    <Button
                                        onClick={handleNext}
                                        className="flex items-center space-x-2"
                                    >
                                        <span>Continuar</span>
                                        <ArrowRight size={16} />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleFinish}
                                        disabled={updateCourseMutation.isPending}
                                        className="bg-orange-600 hover:bg-orange-700"
                                    >
                                        {updateCourseMutation.isPending
                                            ? "Salvando..."
                                            : "Salvar Alterações"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
