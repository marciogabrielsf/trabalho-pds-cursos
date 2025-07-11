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
} from "lucide-react";

interface Activity {
    id: string;
    title: string;
    type: "assignment" | "presentation" | "project";
    status: "pending" | "completed" | "late";
    dueDate?: string;
    description?: string;
}

interface ActivitiesSidebarProps {
    activities: Activity[];
    onActivityClick?: (activityId: string) => void;
}

const ActivitiesSidebar: React.FC<ActivitiesSidebarProps> = ({ activities, onActivityClick }) => {
    const getActivityIcon = (type: string) => {
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

    const getActivityTypeLabel = (type: string) => {
        switch (type) {
            case "assignment":
                return "Prova";
            case "presentation":
                return "Apresentação";
            case "project":
                return "Projeto";
            default:
                return "Atividade";
        }
    };

    const getActivityStatusIcon = (status: string) => {
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades</h3>

                <div className="space-y-3">
                    {activities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            icon={getActivityIcon(activity.type)}
                            typeLabel={getActivityTypeLabel(activity.type)}
                            statusIcon={getActivityStatusIcon(activity.status)}
                            onClick={() => onActivityClick?.(activity.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

interface ActivityCardProps {
    activity: Activity;
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
