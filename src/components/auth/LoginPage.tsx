"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import LoginIllustration from "./LoginIllustration";
import { LoginFormData } from "@/types/auth";
import { useAuthStore } from "@/stores/authStore";

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            const success = await login(data.email, data.senha);

            if (success) {
                // O middleware irá redirecionar automaticamente
                // mas podemos forçar o redirecionamento aqui também
                router.refresh();
            } else {
                setLoginError("Email ou senha inválidos. Verifique suas credenciais.");
            }
        } catch (error) {
            console.error("Erro no login:", error);
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
                                    Entre na sua conta
                                </h1>
                                <p className="text-gray-600">
                                    Bem-vindo de volta! Por favor, insira seus dados.
                                </p>
                            </div>

                            {loginError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{loginError}</p>
                                </div>
                            )}

                            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

                            <div className="mt-6 text-center text-sm text-gray-500">
                                <p>
                                    <strong>Dica:</strong> Use qualquer email válido e uma senha com
                                    pelo menos 6 caracteres.
                                </p>
                                <p className="mt-1">
                                    Emails contendo &quot;teacher&quot; serão redirecionados para o
                                    dashboard do professor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
