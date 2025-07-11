import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { BarChart, BookOpen, FileStack, GraduationCap } from "lucide-react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import CourseHeader from "./CourseHeader";
import CourseTabs from "./CourseTabs";
import CourseDescription from "./CourseDescription";
import PurchasePanel from "./PurchasePanel";
import { PaymentOption } from "../ui/PaymentSelector";
import { mockCourses } from "../../data/mockData";

const CourseDetailsPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("description");

    const courseId = params.id as string;
    const course = mockCourses.find((c) => c.id === courseId);

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Curso não encontrado</h1>
                    <p className="text-gray-600 mb-4">
                        O curso que você está procurando não existe.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="text-orange-500 hover:text-orange-600"
                    >
                        Voltar
                    </button>
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

    const heroVariants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
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
                        <p className="text-gray-700">
                            Informações sobre {course.instructor} serão implementadas aqui.
                        </p>
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
                    {/* Breadcrumb */}
                    <motion.div
                        className="flex flex-col items-start space-x-2 mb-6 bg-black/90 p-10 rounded-xl text-white"
                        variants={heroVariants}
                    >
                        {/* <button
                            onClick={() => router.back()}
                            className="flex items-center space-x-2 "
                        >
                            <ArrowLeft size={20} />
                            <span>Voltar</span>
                        </button> */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3 items-center">
                                <span className="p-2 bg-white/30 rounded-xl font-semibold">
                                    {course.category}
                                </span>
                                <p>Por: {course.instructor}</p>
                            </div>
                            <h1 className=" font-semibold text-3xl">{course.title}</h1>
                            <div className="flex gap-3 text-[#9D9D9D] text-xs">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="text-highlight" />
                                    <span>{course.lessonsCount} Aulas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="text-highlight" />
                                    <span>{course.studentsCount} Alunos Matriculados</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BarChart className="text-highlight" />
                                    <span>{course.level}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileStack className="text-highlight" />
                                    <span>{course.lessonsCount} Aulas</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        variants={itemVariants}
                    >
                        {/* Main content - Video and course info */}
                        <div className="lg:col-span-2">
                            <motion.div variants={itemVariants}>
                                <CourseHeader />
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
                                    price={course.price}
                                    originalPrice={course.originalPrice}
                                    onPurchase={handlePurchase}
                                    studentsCount={course.studentsCount}
                                    lessonsCount={course.lessonsCount}
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
