import React from "react";
import { motion } from "framer-motion";
import { VideoLesson } from "@/types/lesson";

interface VideoLessonContentProps {
    lesson: VideoLesson;
    onLessonComplete: (moduleId: string, lessonId: string) => void;
}

const VideoLessonContent: React.FC<VideoLessonContentProps> = ({ lesson, onLessonComplete }) => {
    const handleVideoEnd = () => {
        onLessonComplete(lesson.moduleId?.toString() || "", lesson.id.toString());
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Video Player */}
            <div className="bg-black relative" style={{ aspectRatio: "16/9" }}>
                {lesson.content?.videoUrl ? (
                    <iframe
                        className="w-full h-full"
                        src={lesson.content.videoUrl}
                        title={lesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => {
                            // Adicionar listener para quando o vídeo terminar
                            const iframe = document.querySelector("iframe");
                            if (iframe) {
                                iframe.addEventListener("ended", handleVideoEnd);
                            }
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📹</div>
                            <p>Vídeo não disponível</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Lesson Info */}
            <div className="px-6 py-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {lesson.order}. {lesson.title}
                </h2>
                p
                {lesson.description && (
                    <p className="text-gray-600 mb-4 whitespace-pre-line">{lesson.description}</p>
                )}
                {/* Video Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Tipo: Vídeo Aula</span>
                    </div>
                    <button
                        onClick={handleVideoEnd}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        Marcar como concluído
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoLessonContent;
