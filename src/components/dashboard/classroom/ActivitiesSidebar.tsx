import React from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Clock,
    Award,
    Users,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Plus,
} from "lucide-react";
import { Task } from "@/types/activity";

interface ActivitiesSidebarProps {
    activities: Task[];
    onActivityClick?: (activityId: number) => void;
    onNewActivity?: () => void;
    userRole?: "student" | "teacher";
}

const ActivitiesSidebar: React.FC<ActivitiesSidebarProps> = ({
    activities,
    onActivityClick,
    onNewActivity,
    userRole = "student",
}) => {
    const getActivityIcon = (type?: string) => {
        switch (type) {
            case "assignment":
                return <Award className="text-green-500" size={20} />;
            case "presentation":
                return <Users className="text-blue-500" size={20} />;
            case "project":
                return <FileText className="text-orange-500" size={20} />;
            default:
                return <FileText className="text-gray-500" size={20} />;
        }
    };

    const getActivityTypeLabel = (type?: string) => {
        switch (type) {
            case "assignment":
                return "Prova";
            case "presentation":
                return "Apresentação";
            case "project":
                return "Projeto";
            case "quiz":
                return "Quiz";
            default:
                return "Atividade";
        }
    };

    const getActivityStatusIcon = (status?: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="text-green-500" size={16} />;
            case "late":
                return <AlertCircle className="text-red-500" size={16} />;
            default:
                return <Clock className="text-orange-500" size={16} />;
        }
    };

    return (
        <div className="w-80 bg-white shadow-lg border-l border-gray-200 p-6">
            <div className="sticky top-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Atividades</h3>
                </div>

                <div className="space-y-3">
                    {activities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            icon={getActivityIcon()}
                            typeLabel={getActivityTypeLabel()}
                            statusIcon={getActivityStatusIcon()}
                            onClick={() => onActivityClick?.(activity.id)}
                        />
                    ))}
                </div>

                {/* Botão Nova Atividade para Professor */}
                {userRole === "teacher" && onNewActivity && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={onNewActivity}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-white rounded-full hover:bg-purple-700 transition-colors font-medium"
                        >
                            <Plus size={20} />
                            Nova Atividade
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ActivityCardProps {
    activity: Task;
    icon: React.ReactNode;
    typeLabel: string;
    statusIcon: React.ReactNode;
    onClick: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, icon, typeLabel, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
                {icon}
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{typeLabel}</p>
                </div>
            </div>
            <ChevronRight className="text-gray-400" size={16} />
        </div>
    </motion.div>
);

export default ActivitiesSidebar;
