import React from "react";
import { Bell } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const DashboardHeader: React.FC = () => {
    const { user } = useAuthStore();

    const today = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <header className="bg-white  px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                            {(user?.name || "N").charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                            Bem-Vinda, {user?.name || "Natália Ruth"}
                        </p>
                        <p className="text-xs text-gray-500">{today}</p>
                    </div>
                </div>
                {/* Perfil do usuário */}
                <div className="flex items-center p-2 bg-[#F9F9F9] rounded-lg">
                    <button className=" text-highlight  transition-colors">
                        <Bell size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
