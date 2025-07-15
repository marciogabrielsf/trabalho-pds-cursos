import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import CourseHeader from "./CourseHeader";
import CourseTabs from "./CourseTabs";
import CourseDescription from "./CourseDescription";
import PurchasePanel from "./PurchasePanel";
import CourseDetailsHorizontal from "./CourseDetailsHorizontal";
import { PaymentOption } from "@/components/ui/PaymentSelector";
import { DashboardHeader, Sidebar } from "@/components";
import { useCourseByIdQuery } from "@/hooks/useCourseQuery";

const CourseDetailsPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("description");

    const courseId = Number(params.id);
    const { data: course, isLoading, error, isError } = useCourseByIdQuery(courseId);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex bg-white">
                <Sidebar activeItem="courses" onItemClick={() => {}} />
                <div className="flex-1 bg-gray-50 overflow-scroll w-full h-screen">
                    <DashboardHeader />
                    <main className="px-6 pb-10">
                        <div className="min-h-screen flex items-center justify-center">
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
                    </main>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !course) {
        return (
            <div className="flex bg-white">
                <Sidebar activeItem="courses" onItemClick={() => {}} />
                <div className="flex-1 bg-gray-50 overflow-scroll w-full h-screen">
                    <DashboardHeader />
                    <main className="px-6 pb-10">
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {error?.message || "Curso não encontrado"}
                                </h1>
                                <p className="text-gray-600 mb-4">
                                    {error?.message
                                        ? "Ocorreu um erro ao carregar o curso."
                                        : "O curso que você está procurando não existe."}
                                </p>
                                <button
                                    onClick={() => router.back()}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const handlePurchase = (paymentOption: PaymentOption) => {
        console.log("Compra realizada:", { course, paymentOption });
        alert(
            `Compra realizada com sucesso!\nCurso: ${course.title}\nForma de pagamento: ${paymentOption.title}`
        );
    };

    // Configurações de animação
    const springConfig = {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
    };

    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: springConfig,
        },
    };

    const slideInVariants = {
        initial: { opacity: 0, x: -30 },
        animate: {
            opacity: 1,
            x: 0,
            transition: springConfig,
        },
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "description":
                return (
                    <CourseDescription
                        description={course.description}
                        requirements={[
                            "Acesso a um computador com conexão à internet estável",
                            "Não é necessário conhecimento prévio",
                            "Vontade de aprender e praticar",
                        ]}
                    />
                );
            case "curriculum":
                return (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Currículo do Curso</h3>
                        <p className="text-gray-700">
                            Conteúdo do currículo será implementado aqui.
                        </p>
                    </div>
                );
            case "instructor":
                return (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre o Instrutor</h3>
                        <p className="text-gray-700">Autor: {course.teacher?.name}</p>
                        <p className="text-gray-700">E-mail: {course.teacher?.email}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex bg-white">
            <Sidebar activeItem="courses" onItemClick={() => {}} />
            <motion.div
                className="flex-1 bg-gray-50 overflow-scroll w-full h-screen"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                <motion.div variants={slideInVariants}>
                    <DashboardHeader />
                </motion.div>

                <main className="px-6 pb-10">
                    <CourseDetailsHorizontal course={course} />
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        variants={itemVariants}
                    >
                        {/* Main content - Video and course info */}
                        <div className="lg:col-span-2">
                            <motion.div variants={itemVariants}>
                                <CourseHeader trailer_url={course.trailer_url} />
                            </motion.div>
                            <motion.div className="mt-8" variants={itemVariants}>
                                <div className="bg-white rounded-lg p-6">
                                    <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />
                                    <div className="mt-6">{renderTabContent()}</div>
                                </div>
                            </motion.div>
                        </div>
                        <motion.div className="lg:col-span-1" variants={itemVariants}>
                            <div className="sticky top-6">
                                <PurchasePanel
                                    price={course.value || 0}
                                    onPurchase={handlePurchase}
                                    studentsCount={10}
                                    lessonsCount={10}
                                    modulesCount={4}
                                    level="Iniciante e Intermediário"
                                />
                            </div>
                        </motion.div>

                        {/* Sidebar - Purchase Panel */}
                    </motion.div>
                    {/* Tabs section */}
                </main>
            </motion.div>
        </div>
    );
};

export default CourseDetailsPage;
