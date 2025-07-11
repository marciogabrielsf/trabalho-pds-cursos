import React from "react";

interface CourseDescriptionProps {
    description: string;
    requirements: string[];
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ description, requirements }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Descrição</h3>
                <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Course requirements</h3>
                <ul className="space-y-2">
                    {requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{requirement}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CourseDescription;
