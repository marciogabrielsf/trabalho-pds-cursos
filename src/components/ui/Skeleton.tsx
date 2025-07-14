import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    width?: string;
    height?: string;
    rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    width = "w-full",
    height = "h-4",
    rounded = "md",
}) => {
    const roundedClasses = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
    };

    return (
        <motion.div
            className={`bg-gray-200 ${width} ${height} ${roundedClasses[rounded]} ${className}`}
            animate={{
                opacity: [0.5, 1, 0.5],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

export default Skeleton;
