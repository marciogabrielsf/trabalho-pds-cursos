import React from "react";
import { useAuthStore } from "@/stores/authStore";
import NotificationBadge from "./NotificationBadge";

const DashboardHeader: React.FC = () => {
    const { user } = useAuthStore();

    const today = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <header className="bg-white px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                            {(user?.name || "N").charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                            Bem-Vindo(a), {user?.name || "Usuário"}
                        </p>
                        <p className="text-xs text-gray-500">{today}</p>
                    </div>
                </div>
                {/* Perfil do usuário */}
                <div className="flex items-center space-x-2">
                    <NotificationBadge />
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
