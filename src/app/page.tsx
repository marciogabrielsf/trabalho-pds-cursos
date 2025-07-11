"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "../components";
import { useAuthStore } from "../stores/authStore";

export default function Home() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        // Redirecionar para dashboard se autenticado
        if (isAuthenticated && user) {
            const dashboardPath =
                user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";
            router.push(dashboardPath);
        }
    }, [isAuthenticated, user, router]);

    // Se estiver autenticado, não mostrar a página de login
    if (isAuthenticated) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return <LoginPage />;
}
