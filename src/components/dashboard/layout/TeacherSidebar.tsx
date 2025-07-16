import React from "react";
import { BookOpen, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/config/config";
import { useAuthStore } from "@/stores/authStore";

interface TeacherSidebarProps {
    activeItem?: string;
    onItemClick?: (item: string) => void;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ activeItem = "courses", onItemClick }) => {
    const router = useRouter();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const menuItems = [
        {
            id: "courses",
            label: "Painel de Cursos",
            icon: BookOpen,
            isActive: activeItem === "courses",
            path: "/dashboard/teacher",
        },
        {
            id: "my-courses",
            label: "Meus Cursos",
            icon: User,
            isActive: activeItem === "my-courses",
            path: "/dashboard/teacher/my-courses",
        },
    ];

    const handleItemClick = (item: (typeof menuItems)[0]) => {
        router.push(item.path);
        onItemClick?.(item.id);
    };

    return (
        <aside className="min-w-64 bg-white border-r border-gray-200 h-screen shadow-md">
            <div className="p-6 h-full flex flex-col">
                {/* Logo */}
                <div className="flex items-center space-x-2 mb-8">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-xl font-bold text-secondary">{APP_NAME}</span>
                </div>

                <div className="flex flex-col justify-between h-full">
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            VISÃO GERAL
                        </h3>

                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        className={`
                                            w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors
                                            ${
                                                item.isActive
                                                    ? " text-secondary "
                                                    : "text-gray-600 hover:bg-gray-50 "
                                            }
                                        `}
                                    >
                                        <Icon
                                            size={20}
                                            className={
                                                item.isActive ? "text-secondary" : "text-gray-400"
                                            }
                                        />
                                        <span className="font-normal">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div>
                        {/* Configuração */}
                        <div className="pt-4 border-gray-200">
                            <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                                <Settings className="text-gray-400" />
                                <span className="font-medium">Configuração</span>
                            </button>
                        </div>

                        {/* Seção Sair */}
                        <div className="pt-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut />
                                <span className="font-medium">Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default TeacherSidebar;
