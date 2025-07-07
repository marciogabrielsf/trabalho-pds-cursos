import { useState } from "react";
import { LoginFormData } from "../types/auth";

interface UseAuthReturn {
    login: (data: LoginFormData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useAuth = (): UseAuthReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: LoginFormData): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // Aqui você faria a chamada real para sua API
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.senha,
                    rememberMe: data.lembrarDeMin,
                }),
            });

            if (!response.ok) {
                throw new Error("Credenciais inválidas");
            }

            const result = await response.json();

            // Salvar token ou dados do usuário conforme necessário
            if (result.token) {
                localStorage.setItem("authToken", result.token);
            }

            // Redirecionar ou atualizar estado global
            console.log("Login realizado com sucesso:", result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading,
        error,
    };
};
