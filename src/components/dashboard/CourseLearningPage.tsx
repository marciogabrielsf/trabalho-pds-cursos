import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings } from "lucide-react";
import Sidebar from "./Sidebar";
import CourseContents from "./CourseContents";
import LectureNotes from "./LectureNotes";
import TabNavigator from "./TabNavigator";
import Classroom from "./Classroom";
import { mockCourses } from "../../data/mockData";
import CourseDetailsHorizontal from "./CourseDetailsHorizontal";
import DashboardHeader from "./DashboardHeader";

// Mock data for course modules
const mockModules = [
    {
        id: "1",
        title: "Getting Started",
        moduleNumber: 1,
        lessonsCount: 4,
        duration: "45 min",
        completed: 1,
        total: 4,
        expanded: true,
        lessons: [
            { id: "1", title: "What is Webflow?", duration: "10 min", completed: true },
            {
                id: "2",
                title: "Sign up in Webflow",
                duration: "8 min",
                completed: false,
                current: true,
            },
            { id: "3", title: "Teaser of Webflow", duration: "12 min", completed: false },
            { id: "4", title: "Figma Introduction", duration: "15 min", completed: false },
        ],
    },
    {
        id: "2",
        title: "Secret of Good Design",
        moduleNumber: 2,
        lessonsCount: 20,
        duration: "2h 30min",
        completed: 0,
        total: 4,
        expanded: false,
        lessons: [
            { id: "5", title: "Design Principles", duration: "15 min", completed: false },
            { id: "6", title: "Color Theory", duration: "20 min", completed: false },
            { id: "7", title: "Typography", duration: "18 min", completed: false },
            { id: "8", title: "Layout and Composition", duration: "25 min", completed: false },
        ],
    },
    {
        id: "3",
        title: "Secret of Good Design",
        moduleNumber: 3,
        lessonsCount: 20,
        duration: "2h 30min",
        completed: 0,
        total: 4,
        expanded: false,
        lessons: [
            { id: "9", title: "Advanced Techniques", duration: "20 min", completed: false },
            { id: "10", title: "User Experience", duration: "25 min", completed: false },
            { id: "11", title: "Responsive Design", duration: "30 min", completed: false },
            { id: "12", title: "Final Project", duration: "40 min", completed: false },
        ],
    },
    {
        id: "4",
        title: "Secret of Good Design",
        moduleNumber: 4,
        lessonsCount: 20,
        duration: "2h 30min",
        completed: 0,
        total: 4,
        expanded: false,
        lessons: [
            { id: "13", title: "Portfolio Building", duration: "25 min", completed: false },
            { id: "14", title: "Client Communication", duration: "20 min", completed: false },
            { id: "15", title: "Design Systems", duration: "30 min", completed: false },
            { id: "16", title: "Course Completion", duration: "15 min", completed: false },
        ],
    },
];

const CourseLearningPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [modules, setModules] = useState(mockModules);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState("videos");
    const currentTime = "1:29";
    const totalTime = "8:15";

    const courseId = params.id as string;
    const course = mockCourses.find((c) => c.id === courseId);

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Curso não encontrado</h1>
                    <p className="text-gray-600 mb-4">
                        O curso que você está procurando não existe.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="text-orange-500 hover:text-orange-600"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    // Configurações de animação
    const springConfig = {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
    };

    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: springConfig,
        },
    };

    const handleToggleModule = (moduleId: string) => {
        setModules(
            modules.map((module) =>
                module.id === moduleId ? { ...module, expanded: !module.expanded } : module
            )
        );
    };

    const handleLessonClick = (moduleId: string, lessonId: string) => {
        console.log(`Clicked lesson ${lessonId} in module ${moduleId}`);
    };

    const handleLessonComplete = (moduleId: string, lessonId: string) => {
        setModules(
            modules.map((module) =>
                module.id === moduleId
                    ? {
                          ...module,
                          lessons: module.lessons.map((lesson) =>
                              lesson.id === lessonId
                                  ? { ...lesson, completed: !lesson.completed }
                                  : lesson
                          ),
                      }
                    : module
            )
        );
    };

    const handleDownload = (fileId: string) => {
        console.log(`Download file ${fileId}`);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "videos":
                return (
                    <div className="flex-1 flex">
                        {/* Main Content */}
                        <div className="flex-[0.7] flex flex-col">
                            {/* Video Player */}
                            <motion.div
                                className="bg-black relative"
                                variants={itemVariants}
                                style={{ aspectRatio: "16/9" }}
                            >
                                {/* Video placeholder */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center"
                                    style={{
                                        backgroundImage:
                                            "url('https://images.unsplash.com/photo-1494790108755-2616c056ca88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                                    <motion.button
                                        onClick={togglePlayPause}
                                        className="relative z-10 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-full p-4 transition-all duration-300"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {isPlaying ? (
                                            <Pause size={32} className="text-white" />
                                        ) : (
                                            <Play size={32} className="text-white ml-1" />
                                        )}
                                    </motion.button>
                                </div>

                                {/* Video Controls */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={togglePlayPause}
                                            className="text-white hover:text-gray-300 transition-colors"
                                        >
                                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                        </button>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <SkipBack size={20} />
                                        </button>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <SkipForward size={20} />
                                        </button>
                                        <div className="flex-1 mx-4">
                                            <div className="bg-white bg-opacity-30 rounded-full h-1">
                                                <div className="bg-white rounded-full h-1 w-1/4" />
                                            </div>
                                        </div>
                                        <span className="text-white text-sm">
                                            {currentTime} / {totalTime}
                                        </span>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <Volume2 size={20} />
                                        </button>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <Settings size={20} />
                                        </button>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <Maximize size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Lesson Content */}
                            <motion.div className="flex-1 p-6 " variants={itemVariants}>
                                <div className="max-w-4xl">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        2. Sign up in Webflow
                                    </h2>

                                    <LectureNotes
                                        description="We cover everything you need to build your first website. From creating your first page through to uploading your website to the internet. We'll use the world's most popular (and free) web design tool called Visual Studio Code. There are exercises files you can download and then work along with me. At the end of each video I have a downloadable version of where we are in the process so that you can compare your project with mine. This will allow you to see exactly where you might have a problem. We will delve into all the good stuff such as how to create your very own mobile burger menu from scratch learning some basic JavaScript and jQuery."
                                        notes="In sit aliquet ante. Curabitur mollis accumsan lorem, sed aliquam mauris finibus ut. Phasellus eget in in maximus sagittis. Mauris eget lorem ut justo elementum eleifend congue vitae ante. Praesent tempus, urna et auctor mattis, mauris lorem ut augue lorem, commodo elementum turpis lacus vel nisl. Mauris consequat odio sit amet mattis, a vestibulum augue ac tellus et.

Nullam non quam ut tellus finibus tellus non nec est. Aliquam nunc cursus ut efficitur tacinia.
• Morbi sit amet lorem tellus. Donec blandit fermentum blandit.
• Pellentesque lorem tellus, hendrerit quis lorem ut, dignissim consectetur tellus. Donec dignissim purus vel mi.
• Curabitur pretium placerat tellus ut cursus ut congue elit.
• Pellentesque lorem tellus, hendrerit quis lorem ut, dignissim consectetur tellus. Donec dignissim purus vel mi.
• Sed dignissim, libero ut lacinia aliquam, ante tellus tempor mauris, eget suscipit mauris eget quis lectus nunc.
• Sed dignissim, libero ut lacinia aliquam, ante tellus tempor mauris, eget suscipit mauris eget quis lectus nunc.

Donec congue placerat lorem ipsum congue."
                                        attachedFiles={[
                                            {
                                                id: "1",
                                                name: "Create account on webflow.pdf",
                                                size: "1.2 MB",
                                                type: "pdf",
                                            },
                                        ]}
                                        onDownload={handleDownload}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar - Course Contents */}
                        <motion.div
                            className="w-96 flex-[0.3]  bg-white border-l border-gray-200 p-6 "
                            variants={itemVariants}
                        >
                            <CourseContents
                                modules={modules}
                                progress={15}
                                onLessonClick={handleLessonClick}
                                onToggleModule={handleToggleModule}
                                onLessonComplete={handleLessonComplete}
                            />
                        </motion.div>
                    </div>
                );
            case "classroom":
                return (
                    <div className="flex-1 ">
                        <Classroom courseTitle={course.title} instructor={course.instructor} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeItem="my-courses" onItemClick={() => {}} />

            <motion.div
                className="flex-1 flex flex-col  h-screen overflow-y-auto"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                <DashboardHeader />

                <div className="p-6">
                    <CourseDetailsHorizontal course={course} />

                    {/* Tab Navigator */}
                    <motion.div variants={itemVariants}>
                        <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
                    </motion.div>

                    {/* Tab Content */}
                    {renderTabContent()}
                </div>
            </motion.div>
        </div>
    );
};

export default CourseLearningPage;
