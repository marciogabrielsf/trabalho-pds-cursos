import React from "react";
import { Download, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface AttachedFile {
    id: string;
    name: string;
    size: string;
    type: string;
}

interface LectureNotesProps {
    description: string;
    notes: string;
    attachedFiles: AttachedFile[];
    onDownload: (fileId: string) => void;
}

const LectureNotes: React.FC<LectureNotesProps> = ({
    description,
    notes,
    attachedFiles,
    onDownload,
}) => {
    const itemVariants = {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20,
            },
        },
    };

    return (
        <motion.div
            className="space-y-6"
            variants={itemVariants}
            initial="initial"
            animate="animate"
        >
            {/* Lectures Description */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lectures Description</h3>
                <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            {/* Lecture Notes */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lecture Notes</h3>
                <div className="prose max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notes}</div>
                </div>
            </div>

            {/* Attached Files */}
            {attachedFiles.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Attach Files ({attachedFiles.length.toString().padStart(2, "0")})
                    </h3>
                    <div className="space-y-3">
                        {attachedFiles.map((file) => (
                            <motion.div
                                key={file.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-center space-x-3">
                                    <FileText className="text-red-500" size={24} />
                                    <div>
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">{file.size}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDownload(file.id)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    <Download size={16} />
                                    <span className="text-sm font-medium">Download File</span>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default LectureNotes;
