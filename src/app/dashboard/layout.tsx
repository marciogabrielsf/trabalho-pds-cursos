"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Verificar autenticação
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return children;
}
