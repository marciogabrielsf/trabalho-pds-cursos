import React from "react";

interface CourseTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const CourseTabs: React.FC<CourseTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "description", label: "Descrição" },
        { id: "curriculum", label: "Currículo" },
        { id: "instructor", label: "Autor" },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                  activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default CourseTabs;
