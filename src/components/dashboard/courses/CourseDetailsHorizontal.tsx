import { Course } from "@/types/course";
import { CourseLearningData } from "@/types/course";
import { motion } from "framer-motion";
import { BarChart, BookOpen, FileStack, GraduationCap } from "lucide-react";
import React from "react";

type CourseDetailsHorizontalProps = {
    course?: Course;
    courseLearningData?: CourseLearningData;
};

export default function CourseDetailsHorizontal({
    course,
    courseLearningData,
}: CourseDetailsHorizontalProps) {
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

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "begineer":
                return "Fácil";
            case "intermediate":
                return "Intermediário";
            case "advanced":
                return "Avançado";
        }
    };

    // Use dados do courseLearningData se disponível, senão use course
    const courseData = courseLearningData || course;
    if (!courseData) return null;

    const lessonsCount = courseLearningData
        ? courseLearningData.course_data.modules.reduce(
              (acc, module) => acc + module.lesson_quantity,
              0
          )
        : course?.lessonsCount || 0;

    const teacherName =
        courseLearningData?.teacher_name || course?.teacher?.name || course?.teacher_name;

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
                    <span className="capitalize p-2 bg-white/30 rounded-xl font-semibold">
                        {courseData.category}
                    </span>
                    <p>Por: {teacherName}</p>
                </div>
                <h1 className=" font-semibold text-3xl">{courseData.title}</h1>
                <div className="flex gap-3 text-[#9D9D9D] text-xs">
                    <div className="flex items-center gap-2">
                        <BookOpen className="text-highlight" />
                        <span>{lessonsCount} Aulas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="text-highlight" />
                        <span>{course?.studentsCount || 0} Alunos Matriculados</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart className="text-highlight" />
                        <span>{getDifficultyLabel(courseData.difficulty || "begineer")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileStack className="text-highlight" />
                        <span>{lessonsCount} Aulas</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
