import React from "react";

type CourseHeaderProps = {
    trailer_url?: string;
};

const CourseHeader: React.FC<CourseHeaderProps> = ({ trailer_url }) => {
    return (
        <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl overflow-hidden">
            <iframe
                className="w-full h-full"
                src={trailer_url || "https://www.youtube.com/embed/dQw4w9WgXcQ?si=BosetgPbu-0kDSpu"}
            ></iframe>{" "}
        </div>
    );
};

export default CourseHeader;
