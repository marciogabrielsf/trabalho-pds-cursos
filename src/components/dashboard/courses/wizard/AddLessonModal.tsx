import React, { useState, useEffect } from "react";
import { FileText, PlayCircle, HelpCircle, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface LessonData {
    title: string;
    type: "VIDEO" | "QUIZ" | "TEXT";
    description: string;
    content: Record<string, unknown>;
}

interface AddLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (lessonData: LessonData) => void;
    initialData?: LessonData | null;
}

export default function AddLessonModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: AddLessonModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [lessonType, setLessonType] = useState<"VIDEO" | "QUIZ" | "TEXT">("VIDEO");
    const [lessonData, setLessonData] = useState<LessonData>({
        title: "",
        type: "VIDEO",
        description: "",
        content: {},
    });

    // Quiz specific state
    const [quizQuestions, setQuizQuestions] = useState<
        {
            question: string;
            options: string[];
            correctAnswer: number;
        }[]
    >([]);

    // Update lessonData when initialData changes
    useEffect(() => {
        if (initialData) {
            setLessonData(initialData);
            setLessonType(initialData.type);

            // If it's a quiz, load the questions
            if (initialData.type === "QUIZ" && initialData.content.questions) {
                const questions = initialData.content.questions as Array<{
                    question: string;
                    options: string[];
                    correctAnswer: string;
                }>;

                setQuizQuestions(
                    questions.map((q) => ({
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.options.findIndex((opt) => opt === q.correctAnswer),
                    }))
                );
            }
        } else {
            setLessonData({
                title: "",
                type: "VIDEO",
                description: "",
                content: {},
            });
            setLessonType("VIDEO");
            setQuizQuestions([]);
        }
        setCurrentStep(1);
    }, [initialData]);

    const handleNext = () => {
        if (currentStep === 1) {
            setLessonData((prev) => ({ ...prev, type: lessonType }));
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const handleSubmit = () => {
        let content: Record<string, unknown> = {};

        switch (lessonType) {
            case "VIDEO":
                content = {
                    videoUrl: (lessonData.content as { videoUrl?: string })?.videoUrl || "",
                };
                break;
            case "QUIZ":
                content = {
                    questions: quizQuestions.map((q) => ({
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.options[q.correctAnswer],
                    })),
                };
                break;
            case "TEXT":
                content = {
                    text: (lessonData.content as { text?: string })?.text || "",
                };
                break;
        }

        onSubmit({
            ...lessonData,
            type: lessonType,
            content,
        });

        // Reset form
        setCurrentStep(1);
        setLessonType("VIDEO");
        setLessonData({
            title: "",
            type: "VIDEO",
            description: "",
            content: {},
        });
        setQuizQuestions([]);
    };

    const renderStepContent = () => {
        if (currentStep === 1) {
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            type="button"
                            onClick={() => setLessonType("VIDEO")}
                            className={`p-4 rounded-lg border-2 text-center transition-colors ${
                                lessonType === "VIDEO"
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <PlayCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <div className="text-sm font-medium">Add Aula Em Vídeo</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setLessonType("QUIZ")}
                            className={`p-4 rounded-lg border-2 text-center transition-colors ${
                                lessonType === "QUIZ"
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <div className="text-sm font-medium">Add Aula Em Quiz</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setLessonType("TEXT")}
                            className={`p-4 rounded-lg border-2 text-center transition-colors ${
                                lessonType === "TEXT"
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <div className="text-sm font-medium">Add Aula Em Texto</div>
                        </button>
                    </div>
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                            1
                        </div>
                        <span className="text-sm font-medium">Módulo</span>
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                            2
                        </div>
                        <span className="text-sm font-medium">
                            Aula{" "}
                            {lessonType === "VIDEO"
                                ? "vídeo"
                                : lessonType === "QUIZ"
                                ? "Quiz"
                                : "Texto"}
                        </span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título da aula
                        </label>
                        <Input
                            type="text"
                            value={lessonData.title}
                            onChange={(e) =>
                                setLessonData((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Coloque aqui o título da atividade"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição da aula
                        </label>
                        <textarea
                            value={lessonData.description}
                            onChange={(e) =>
                                setLessonData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Enter you course descriptions"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={4}
                        />
                    </div>

                    {lessonType === "VIDEO" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL do YouTube
                            </label>
                            <Input
                                type="url"
                                value={
                                    (lessonData.content as { videoUrl?: string })?.videoUrl || ""
                                }
                                onChange={(e) =>
                                    setLessonData((prev) => ({
                                        ...prev,
                                        content: { videoUrl: e.target.value },
                                    }))
                                }
                                placeholder="Cole aqui o link do YouTube (ex: https://www.youtube.com/watch?v=...)"
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Certifique-se de que o vídeo é público e acessível.
                            </p>
                        </div>
                    )}

                    {lessonType === "QUIZ" && (
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Perguntas do quiz</h4>
                            {quizQuestions.map((question, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 mb-4"
                                >
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pergunta
                                        </label>
                                        <Input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) => {
                                                const updated = [...quizQuestions];
                                                updated[index].question = e.target.value;
                                                setQuizQuestions(updated);
                                            }}
                                            placeholder="Escreva aqui a pergunta do quiz"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    checked={question.correctAnswer === optionIndex}
                                                    onChange={() => {
                                                        const updated = [...quizQuestions];
                                                        updated[index].correctAnswer = optionIndex;
                                                        setQuizQuestions(updated);
                                                    }}
                                                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                />
                                                <Input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const updated = [...quizQuestions];
                                                        updated[index].options[optionIndex] =
                                                            e.target.value;
                                                        setQuizQuestions(updated);
                                                    }}
                                                    placeholder={`Resposta ${String.fromCharCode(
                                                        65 + optionIndex
                                                    )}`}
                                                    className="flex-1"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    setQuizQuestions([
                                        ...quizQuestions,
                                        {
                                            question: "",
                                            options: ["", "", "", ""],
                                            correctAnswer: 0,
                                        },
                                    ])
                                }
                                className="w-full bg-orange-100 text-orange-600 p-3 rounded-lg hover:bg-orange-200 transition-colors"
                            >
                                Adicionar Pergunta
                            </button>
                        </div>
                    )}

                    {lessonType === "TEXT" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conteúdo da aula
                            </label>
                            <textarea
                                value={(lessonData.content as { text?: string })?.text || ""}
                                onChange={(e) =>
                                    setLessonData((prev) => ({
                                        ...prev,
                                        content: { text: e.target.value },
                                    }))
                                }
                                placeholder="Digite o conteúdo da aula em texto..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows={8}
                            />
                        </div>
                    )}
                </div>
            );
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Aula" : "Adicionar Aula"}</DialogTitle>
                    <DialogDescription>
                        {currentStep === 1
                            ? "Selecione o tipo de aula que deseja criar"
                            : "Preencha as informações da aula"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">{renderStepContent()}</div>

                <DialogFooter>
                    <div className="flex gap-3 w-full">
                        {currentStep === 2 && (
                            <Button type="button" variant="secondary" onClick={handleBack}>
                                <ArrowLeft />
                                Voltar
                            </Button>
                        )}

                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>

                        {currentStep === 1 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                CONTINUAR
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {initialData ? "Salvar Alterações" : "ADICIONAR AULA"}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
