import React from "react";
import { Play } from "lucide-react";

const CourseHeader: React.FC = () => {
    return (
        <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-8 h-8 text-highlight ml-1" />
                </div>
            </div>
        </div>
    );
};

export default CourseHeader;
