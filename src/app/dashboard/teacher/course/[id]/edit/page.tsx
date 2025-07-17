"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { TeacherSidebar } from "@/components/dashboard/layout";
import { ArrowLeft, ArrowRight, Edit } from "lucide-react";
import Button from "@/components/ui/Button";
import { StatusDialog } from "@/components/ui/StatusDialog";
import CourseBasicInfo from "@/components/dashboard/courses/wizard/CourseBasicInfo";
import ExistingModules from "@/components/dashboard/courses/wizard/ExistingModules";
import NewModules from "@/components/dashboard/courses/wizard/NewModules";
import CourseEditSummary from "@/components/dashboard/courses/wizard/CourseEditSummary";
import {
    CourseEditLoading,
    CourseEditError,
} from "@/components/dashboard/courses/wizard/CourseEditStates";
import { useCourseEdit, useCourseEditAPI, useWizardSteps, useStatusDialog } from "@/hooks";
import { useUpdateCompleteCourse } from "@/hooks/useTeacherQuery";

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = Number(params.id);

    // Custom hooks para gerenciar estado e lógica
    const {
        wizardData,
        updateWizardData,
        isLoading,
        error,
        courseInfo,
        navigateBack,
        navigateToTeacherDashboard,
        user,
    } = useCourseEdit(courseId);

    const { currentStep, steps, handleNext, handleBack, canGoNext, canGoBack, isLastStep } =
        useWizardSteps();
    const apiData = useCourseEditAPI(wizardData, user?.id || 1);
    const updateCompleteCourse = useUpdateCompleteCourse();
    const { dialogState, closeDialog, showSuccess, showError } = useStatusDialog();

    // Estados de carregamento e erro
    if (isLoading) {
        return <CourseEditLoading />;
    }

    if (error) {
        return <CourseEditError onRetry={navigateToTeacherDashboard} />;
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
                return <CourseEditSummary wizardData={wizardData} apiData={apiData} />;
            default:
                return null;
        }
    };

    const handleFinish = () => {
        updateCompleteCourse.mutate(
            { courseId, courseData: apiData },
            {
                onSuccess: () => {
                    showSuccess(
                        "Curso Atualizado com Sucesso!",
                        "Todas as alterações foram salvas. Você será redirecionado para o painel do curso.",
                        {
                            label: "Ir para o Curso",
                            onClick: () => {
                                closeDialog();
                                router.push(`/dashboard/teacher/course/${courseId}`);
                            },
                        }
                    );
                },
                onError: (error) => {
                    console.error("Erro ao salvar curso:", error);
                    showError(
                        "Erro ao Salvar Curso",
                        "Ocorreu um erro ao tentar salvar as alterações. Por favor, tente novamente.",
                        {
                            label: "Tentar Novamente",
                            onClick: () => {
                                closeDialog();
                                handleFinish();
                            },
                        },
                        {
                            label: "Cancelar",
                            onClick: closeDialog,
                        }
                    );
                },
            }
        );
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
                                onClick={navigateBack}
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
                                    disabled={!canGoBack}
                                    className="flex items-center space-x-2"
                                >
                                    <ArrowLeft size={16} />
                                    <span>Voltar</span>
                                </Button>

                                {!isLastStep ? (
                                    <Button
                                        onClick={handleNext}
                                        disabled={!canGoNext}
                                        className="flex items-center space-x-2"
                                    >
                                        <span>Continuar</span>
                                        <ArrowRight size={16} />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleFinish}
                                        disabled={updateCompleteCourse.isPending}
                                        className="bg-orange-600 hover:bg-orange-700"
                                    >
                                        {updateCompleteCourse.isPending
                                            ? "Salvando..."
                                            : "Salvar Alterações"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Status Dialog */}
            <StatusDialog
                isOpen={dialogState.isOpen}
                onClose={closeDialog}
                type={dialogState.type}
                title={dialogState.title}
                description={dialogState.description}
                primaryAction={dialogState.primaryAction}
                secondaryAction={dialogState.secondaryAction}
            />
        </div>
    );
}
