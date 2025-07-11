import React from "react";
import { motion } from "framer-motion";

interface TabNavigatorProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "videos", label: "Vídeos aulas" },
        { id: "classroom", label: "Sala de Aula" },
    ];

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-6 py-4 font-medium text-sm transition-colors duration-200 relative ${
                            activeTab === tab.id
                                ? "text-orange-500 "
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                                layoutId="activeTab"
                                initial={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 30,
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabNavigator;
