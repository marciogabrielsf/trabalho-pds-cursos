import React from "react";
import { motion } from "framer-motion";
import Skeleton from "../../ui/Skeleton";

interface CourseSkeletonProps {
    count?: number;
}

const CourseSkeleton: React.FC<CourseSkeletonProps> = ({ count = 6 }) => {
    const skeletonItems = Array.from({ length: count }, (_, index) => (
        <motion.div
            key={index}
            className="bg-white rounded-3xl p-4 border border-gray-100"
            transition={{
                duration: 0.3,
            }}
        >
            {/* Image skeleton */}
            <div className="mb-4">
                <Skeleton height="h-32" rounded="lg" />
            </div>

            {/* Title skeleton */}
            <div className="mb-2">
                <Skeleton height="h-5" width="w-3/4" />
            </div>

            {/* Description skeleton */}
            <div className="mb-3 space-y-2">
                <Skeleton height="h-3" width="w-full" />
                <Skeleton height="h-3" width="w-5/6" />
            </div>

            {/* Instructor skeleton */}
            <div className="flex items-center mb-3">
                <Skeleton height="h-6" width="w-6" rounded="full" className="mr-2" />
                <Skeleton height="h-3" width="w-24" />
            </div>

            {/* Price and rating skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Skeleton height="h-4" width="w-16" />
                    <Skeleton height="h-3" width="w-8" />
                </div>
                <Skeleton height="h-6" width="w-20" rounded="full" />
            </div>
        </motion.div>
    ));

    return (
        <div className="px-6 py-4">
            <div className="mb-6">
                <Skeleton height="h-6" width="w-48" className="mb-2" />
                <Skeleton height="h-4" width="w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {skeletonItems}
            </div>
        </div>
    );
};

export default CourseSkeleton;
