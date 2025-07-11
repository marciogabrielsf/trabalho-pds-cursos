import React, { useState } from "react";
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
        <div className="flex">
            <Sidebar activeItem="courses" onItemClick={() => {}} />
            <div className="flex-1 bg-gray-50  overflow-scroll w-full h-screen">
                <DashboardHeader />

                <main className="px-6 pb-10">
                    {/* Breadcrumb */}
                    <div className="flex flex-col items-start space-x-2 mb-6 bg-black/90 p-10 rounded-xl text-white">
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
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main content - Video and course info */}
                        <div className="lg:col-span-2">
                            <CourseHeader />
                            <div className="mt-8">
                                <div className="bg-white rounded-lg p-6">
                                    <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />
                                    <div className="mt-6">{renderTabContent()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
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
                        </div>

                        {/* Sidebar - Purchase Panel */}
                    </div>

                    {/* Tabs section */}
                </main>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
