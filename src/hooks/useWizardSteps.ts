import { useState } from "react";

const steps = [
    { id: 1, title: "Informações básicas", description: "Editar informações do curso" },
    { id: 2, title: "Módulos existentes", description: "Gerenciar módulos existentes" },
    { id: 3, title: "Novos módulos", description: "Adicionar novos módulos" },
    { id: 4, title: "Currículo do curso", description: "Revisar alterações" },
];

export function useWizardSteps() {
    const [currentStep, setCurrentStep] = useState(1);

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
