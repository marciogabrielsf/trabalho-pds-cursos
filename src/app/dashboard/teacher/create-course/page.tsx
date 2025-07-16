"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { TeacherSidebar } from "@/components/dashboard/layout";
import {
    ArrowLeft,
    ArrowRight,
    Book,
    Clock,
    Users,
    DollarSign,
    PlayCircle,
    FileText,
    HelpCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CourseBasicInfo from "@/components/dashboard/courses/wizard/CourseBasicInfo";
import { useCreateCourse } from "@/hooks/useTeacherQuery";
import {
    useAddModuleToCourse,
    useTeacherModules,
    useCreateModule,
    useCreateLesson,
} from "@/hooks/useModuleQuery";
import ExistingModules from "@/components/dashboard/courses/wizard/ExistingModules";
import NewModules from "@/components/dashboard/courses/wizard/NewModules";
import { CourseWizardData } from "@/types/courseWizard";

const steps = [
    { id: 1, title: "Informações básicas", description: "Informações do curso" },
    { id: 2, title: "Módulos existentes", description: "Selecione módulos existentes" },
    { id: 3, title: "Novos módulos", description: "Crie novos módulos" },
    { id: 4, title: "Currículo do curso", description: "Finalize o currículo" },
];

export default function CreateCoursePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);
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

    const createCourseMutation = useCreateCourse();
    const addModuleToCourse = useAddModuleToCourse();
    const createModule = useCreateModule();
    const createLesson = useCreateLesson();
    const { data: existingModules = [] } = useTeacherModules(user?.id || 0);

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
                .filter((item) => item.type === "existing")
                .map((item) => {
                    const orderIndex = wizardData.moduleOrder.findIndex(
                        (orderItem) => orderItem.id === item.id
                    );
                    return {
                        module_id: item.originalId!,
                        order: orderIndex + 1,
                    };
                }),

            // Novos módulos para criar com ordem sequencial
            newModulesData: wizardData.moduleOrder
                .filter((item) => item.type === "new")
                .map((item) => {
                    const orderIndex = wizardData.moduleOrder.findIndex(
                        (orderItem) => orderItem.id === item.id
                    );
                    const moduleData = wizardData.newModules.find((m) => m.id === item.id);
                    return {
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
                newModules: wizardData.newModules.length,
                totalLessons: wizardData.newModules.reduce(
                    (acc, module) => acc + module.lessons.length,
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

            // 1. Criar o curso
            const course = await createCourseMutation.mutateAsync(apiData.courseData);

            // 2. Adicionar módulos existentes ao curso (na ordem correta)
            for (const moduleData of apiData.existingModulesData) {
                await addModuleToCourse.mutateAsync({
                    course_id: course.id,
                    module_id: moduleData.module_id,
                    order: moduleData.order,
                });
            }

            // 3. Criar novos módulos e suas aulas
            for (const newModuleData of apiData.newModulesData) {
                // Criar o módulo
                const createdModule = await createModule.mutateAsync({
                    title: newModuleData.title,
                    description: newModuleData.description,
                    teacher_id: user?.id || 1,
                });

                // Adicionar o módulo ao curso
                await addModuleToCourse.mutateAsync({
                    course_id: course.id,
                    module_id: createdModule.id,
                    order: newModuleData.order,
                });

                // Criar as aulas do módulo
                for (const lessonData of newModuleData.lessons) {
                    await createLesson.mutateAsync({
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
            console.log("Curso criado com sucesso!");
            alert("Curso criado com sucesso!");
            router.push("/dashboard/teacher");
        } catch (error) {
            alert("Erro ao criar curso. Tente novamente.");
            console.error("Error creating course:", error);
        }
    };

    const updateWizardData = (data: Partial<CourseWizardData>) => {
        setWizardData((prev) => ({ ...prev, ...data }));
    };

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
                        <h3 className="text-xl font-semibold mb-6">Resumo do Curso</h3>

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
                                        <p className="text-sm text-green-600">Módulos Existentes</p>
                                        <p className="text-2xl font-bold text-green-800">
                                            {prepareDataForAPI.stats.existingModules}
                                        </p>
                                    </div>
                                    <Users className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-secondary">Novos Módulos</p>
                                        <p className="text-2xl font-bold text-purple-800">
                                            {prepareDataForAPI.stats.newModules}
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-purple-500" />
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
                            <h4 className="font-semibold text-gray-900 mb-4">Estrutura do Curso</h4>
                            <div className="space-y-3">
                                {prepareDataForAPI.stats.moduleOrder.map((item, index) => {
                                    const moduleData =
                                        item.type === "existing"
                                            ? existingModules.find((m) => m.id === item.originalId)
                                            : wizardData.newModules.find((m) => m.id === item.id);

                                    if (!moduleData) return null;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h5 className="font-medium text-gray-900">
                                                        {moduleData.title}
                                                    </h5>
                                                    {item.type === "existing" && (
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            Existente
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
                                })}
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
                                onClick={() => router.push("/dashboard/teacher")}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Bem-Vindo, Prof. {user?.name}
                                </h1>
                                <p className="text-gray-600 text-sm">Terça, 15 de Julho de 2025</p>
                            </div>
                        </div>

                        <div className="text-sm text-gray-500">CRIANDO NOVO CURSO</div>
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
                                                ? "bg-secondary text-white"
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
                                                    ? "bg-secondary"
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
                                        disabled={createCourseMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {createCourseMutation.isPending
                                            ? "Criando..."
                                            : "Concluir Curso"}
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
