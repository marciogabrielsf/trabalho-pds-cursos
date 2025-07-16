"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "./LoginForm";
import LoginIllustration from "./LoginIllustration";
import { LoginFormData } from "@/types/auth";
import { useAuthStore } from "@/stores/authStore";

const TeacherLoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const { teacherLogin } = useAuthStore();
    const router = useRouter();

    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            const success = await teacherLogin(data.email, data.senha);

            if (success) {
                // O middleware irá redirecionar automaticamente para /dashboard/teacher
                router.refresh();
            } else {
                setLoginError("Email ou senha inválidos. Verifique suas credenciais.");
            }
        } catch (error) {
            console.error("Erro no login do professor:", error);
            setLoginError("Erro interno. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full h-full bg-white overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                    {/* Lado esquerdo - Ilustração */}
                    <div className="hidden lg:block">
                        <LoginIllustration />
                    </div>

                    {/* Lado direito - Formulário */}
                    <div className="flex items-center justify-center p-8 lg:p-12 col-span-2">
                        <div className="w-full max-w-md">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Portal do Professor
                                </h1>
                                <p className="text-gray-600">
                                    Bem-vindo de volta! Acesse sua conta de professor.
                                </p>
                            </div>

                            {loginError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{loginError}</p>
                                </div>
                            )}

                            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

                            {/* Link para login do estudante */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600 text-sm">
                                    É estudante?{" "}
                                    <Link
                                        href="/"
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Faça login aqui
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherLoginPage;
