import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    Palette,
    Code2,
    Camera,
    TrendingUp,
    BarChart3,
    Beaker,
} from "lucide-react";
import { Category } from "@/stores/courseStore";

interface CategoriesProps {
    categories: Category[];
    selectedCategory: string | null;
    onCategorySelect: (categoryId: string | null) => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
    "art-design": <Palette className="w-6 h-6" />,
    development: <Code2 className="w-6 h-6" />,
    photography: <Camera className="w-6 h-6" />,
    marketing: <TrendingUp className="w-6 h-6" />,
    business: <BarChart3 className="w-6 h-6" />,
    science: <Beaker className="w-6 h-6" />,
};

const Categories: React.FC<CategoriesProps> = ({
    categories,
    selectedCategory,
    onCategorySelect,
}) => {
    return (
        <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Top Categorias</h2>
                    <p className="text-sm text-gray-600">Explore essas categorias populares</p>
                </div>

                <div className="flex space-x-2">
                    <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                        <ChevronRight size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() =>
                            onCategorySelect(selectedCategory === category.id ? null : category.id)
                        }
                        className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 border group ${
                            selectedCategory === category.id && "-translate-y-3 shadow-lg"
                        }`}
                    >
                        <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors bg-highlight`}
                        >
                            <div className={"text-white"}>
                                {iconMap[category.icon] || <Code2 className="w-6 h-6" />}
                            </div>
                        </div>

                        <h3
                            className={`
              font-bold text-sm mb-1 transition-colors
              ${selectedCategory === category.id ? "text-highlight" : "text-gray-900"}
            `}
                        >
                            {category.name}
                        </h3>

                        <p className={`text-xs transition-colors text-gray-500`}>
                            {category.coursesCount} Cursos
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Categories;
