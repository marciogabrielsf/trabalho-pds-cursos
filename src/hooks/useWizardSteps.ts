import { useState } from "react";
import { WizardStep } from "@/types/courseWizard";

const defaultEditSteps: WizardStep[] = [
    { id: 1, title: "Informações básicas", description: "Editar informações do curso" },
    { id: 2, title: "Módulos existentes", description: "Gerenciar módulos existentes" },
    { id: 3, title: "Novos módulos", description: "Adicionar novos módulos" },
    { id: 4, title: "Currículo do curso", description: "Revisar alterações" },
];

const defaultCreateSteps: WizardStep[] = [
    { id: 1, title: "Informações básicas", description: "Informações do curso" },
    { id: 2, title: "Módulos existentes", description: "Selecione módulos existentes" },
    { id: 3, title: "Novos módulos", description: "Crie novos módulos" },
    { id: 4, title: "Currículo do curso", description: "Finalize o currículo" },
];

export function useWizardSteps(customSteps?: WizardStep[], mode: "edit" | "create" = "edit") {
    const [currentStep, setCurrentStep] = useState(1);

    const steps = customSteps || (mode === "create" ? defaultCreateSteps : defaultEditSteps);

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

    const canGoNext = currentStep < steps.length;
    const canGoBack = currentStep > 1;
    const isLastStep = currentStep === steps.length;

    return {
        currentStep,
        steps,
        handleNext,
        handleBack,
        canGoNext,
        canGoBack,
        isLastStep,
    };
}
