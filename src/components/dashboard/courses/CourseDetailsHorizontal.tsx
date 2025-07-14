import { Course } from "@/types/course";
import { motion } from "framer-motion";
import { BarChart, BookOpen, FileStack, GraduationCap } from "lucide-react";
import React from "react";

type CourseDetailsHorizontalProps = {
    course: Course;
};

export default function CourseDetailsHorizontal({ course }: CourseDetailsHorizontalProps) {
    const springConfig = {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
    };

    const heroVariants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: springConfig,
        },
    };

    return (
        <motion.div
            className="flex flex-col items-start space-x-2 mb-6 bg-black/90 p-10 rounded-xl text-white"
            variants={heroVariants}
        >
            {/* <button
                            onClick={() => router.back()}
                            className="flex items-center space-x-2 "
                        >
                            <ArrowLeft size={20} />
                            <span>Voltar</span>
                        </button> */}
            <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                    <span className="p-2 bg-white/30 rounded-xl font-semibold">
                        {course.category}
                    </span>
                    <p>Por: {course.teacher.name}</p>
                </div>
                <h1 className=" font-semibold text-3xl">{course.title}</h1>
                <div className="flex gap-3 text-[#9D9D9D] text-xs">
                    <div className="flex items-center gap-2">
                        <BookOpen className="text-highlight" />
                        <span>{1} Aulas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="text-highlight" />
                        <span>{10} Alunos Matriculados</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart className="text-highlight" />
                        {/* <span>{course.level}</span> */}
                        <span>Iniciante</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileStack className="text-highlight" />
                        <span>{12} Aulas</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
