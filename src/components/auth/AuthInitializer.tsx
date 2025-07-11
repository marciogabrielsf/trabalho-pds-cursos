"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

interface AuthInitializerProps {
    children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        // Verificar autenticação ao carregar a aplicação
        checkAuth();
    }, [checkAuth]);

    return <>{children}</>;
};
