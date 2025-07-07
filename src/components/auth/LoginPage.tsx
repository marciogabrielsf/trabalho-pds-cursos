"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import LoginIllustration from "./LoginIllustration";
import { LoginFormData } from "@/types/auth";

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true);

        // Simular chamada para API
        try {
            console.log("Dados de login:", data);

            // Aqui você faria a integração com sua API
            // const response = await api.login(data);

            // Simular delay da API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Redirecionar ou atualizar estado após login bem-sucedido
            alert("Login realizado com sucesso!");
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro no login. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full h-full bg-white   overflow-hidden">
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

                            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
