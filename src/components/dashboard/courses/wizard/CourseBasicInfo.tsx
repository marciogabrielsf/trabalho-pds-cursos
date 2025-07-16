import React from "react";
import Input from "@/components/ui/Input";
import { CourseWizardData } from "@/app/dashboard/teacher/create-course/page";

interface CourseBasicInfoProps {
    data: CourseWizardData;
    onChange: (data: Partial<CourseWizardData>) => void;
}

export default function CourseBasicInfo({ data, onChange }: CourseBasicInfoProps) {
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        onChange({
            [name]: name === "value" ? parseFloat(value) || 0 : value,
        });
    };

    return (
        <div className="p-6 text-black">
            <h3 className="text-xl font-semibold mb-6">Informações Básicas do Curso</h3>

            {/* Course Details */}
            <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-10 items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título{" "}
                            <span className="ml-1 text-xs text-gray-400">
                                {data.title.length}/60
                            </span>
                        </label>
                        <Input
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={handleInputChange}
                            placeholder="You course title"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL do Trailer
                        </label>
                        <Input
                            type="url"
                            name="trailer_url"
                            value={data.trailer_url}
                            onChange={handleInputChange}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL da Thumbnail
                        </label>
                        <Input
                            type="url"
                            name="thumbnail_url"
                            value={data.thumbnail_url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição do Curso
                    </label>
                    <textarea
                        name="description"
                        value={data.description}
                        onChange={handleInputChange}
                        placeholder="Enter you course descriptions"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoria
                        </label>
                        <select
                            name="category"
                            value={data.category}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Select...</option>
                            <option value="PROGRAMMING">Programação</option>
                            <option value="DESIGN">Design</option>
                            <option value="BUSINESS">Negócios</option>
                            <option value="MARKETING">Marketing</option>
                            <option value="PHOTOGRAPHY">Fotografia</option>
                            <option value="MUSIC">Música</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nível do curso
                        </label>
                        <select
                            name="difficulty"
                            value={data.difficulty}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Select...</option>
                            <option value="BEGINNER">Iniciante</option>
                            <option value="INTERMEDIATE">Intermediário</option>
                            <option value="ADVANCED">Avançado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço (R$)
                        </label>
                        <Input
                            type="number"
                            name="value"
                            value={data.value}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
