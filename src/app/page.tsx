"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "../components";
import { useAuthStore } from "../stores/authStore";

export default function Home() {
    const router = useRouter();
    const { isAuthenticated, login } = useAuthStore();

    useEffect(() => {
        // Simular login automático para demonstração
        if (!isAuthenticated) {
            login({
                id: "1",
                name: "Natália Ruth",
                email: "natalia@email.com",
                role: "student",
            });
        }
    }, [isAuthenticated, login]);

    useEffect(() => {
        // Redirecionar para dashboard se autenticado
        if (isAuthenticated) {
            router.push("/dashboard/student");
        }
    }, [isAuthenticated, router]);

    return <LoginPage />;
}
