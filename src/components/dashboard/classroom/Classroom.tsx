"use client";
import React, { useState } from "react";
import ClassroomPost from "./ClassroomPost";
import ActivitiesSidebar from "./ActivitiesSidebar";
import NewCommentForm from "./NewCommentForm";
import TeacherActivityPage from "./TeacherActivityPage";
import StudentActivityPage from "./StudentActivityPage";
import NewActivityModal from "./NewActivityModal";
import { useCommentsByCourse } from "@/hooks/useCommentQuery";
import {
    useTasksByCourse,
    useDeliveriesByTask,
    useStudentDeliveryForTask,
    useCreateTask,
} from "@/hooks/useTaskQuery";
import { useAuthStore } from "@/stores/authStore";
import { TaskCreate } from "@/types/activity";

interface ClassroomProps {
    courseId: number;
}

const Classroom: React.FC<ClassroomProps> = ({ courseId }) => {
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const { userRole, user } = useAuthStore();

    const {
        data: comments,
        isLoading: commentsLoading,
        error: commentsError,
    } = useCommentsByCourse(courseId);
    const { data: tasks = [], isLoading: tasksLoading } = useTasksByCourse(courseId);
    const { data: deliveries = [] } = useDeliveriesByTask(selectedTaskId || 0);

    const studentId = user?.id || 0;
    const { data: studentDelivery } = useStudentDeliveryForTask(
        selectedTaskId || 0,
        userRole === "student" ? studentId : 0
    );

    const createTaskMutation = useCreateTask();

    if (commentsLoading || tasksLoading) {
        return (
            <div className="flex bg-gray-50 min-h-screen items-center justify-center">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

    if (commentsError) {
        return (
            <div className="flex bg-gray-50 min-h-screen items-center justify-center">
                <div className="text-lg text-red-600">Erro ao carregar dados</div>
            </div>
        );
    }

    const handleTaskClick = (taskId: number) => {
        setSelectedTaskId(taskId);
    };

    const handleBackToClassroom = () => {
        setSelectedTaskId(null);
    };

    const handleAddComment = (postId: string, commentContent: string) => {
        console.log("Add comment:", postId, commentContent);
    };

    const handleNewTask = () => {
        setShowNewTaskModal(true);
    };

    const handleSaveTask = (newTaskData: TaskCreate) => {
        if (user?.id) {
            createTaskMutation.mutate({
                taskData: newTaskData,
                teacherId: user.id,
            });
            setShowNewTaskModal(false);
        }
    };

    if (selectedTaskId) {
        const selectedTask = tasks.find((task) => task.id === selectedTaskId);
        if (!selectedTask) return null;

        if (userRole === "teacher") {
            return (
                <TeacherActivityPage
                    activity={selectedTask}
                    submissions={deliveries}
                    onBack={handleBackToClassroom}
                />
            );
        } else {
            return (
                <StudentActivityPage
                    activity={selectedTask}
                    onBack={handleBackToClassroom}
                    hasSubmitted={!!studentDelivery}
                    submissionFile={studentDelivery?.file_url?.split("/").pop() || ""}
                    submittedAt={studentDelivery?.created_at}
                    grade={studentDelivery?.grade}
                    feedback={studentDelivery?.feedback}
                />
            );
        }
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="flex-1 max-w-4xl mx-auto p-6 space-y-6">
                <NewCommentForm courseId={courseId} />
                <div className="space-y-4">
                    {comments &&
                        comments.map((comment) => (
                            <ClassroomPost
                                key={comment.id}
                                comment={comment}
                                onAddComment={handleAddComment}
                            />
                        ))}
                </div>
            </div>
            <ActivitiesSidebar
                activities={tasks}
                onActivityClick={handleTaskClick}
                onNewActivity={userRole === "teacher" ? handleNewTask : undefined}
                userRole={userRole || "student"}
            />

            <NewActivityModal
                isOpen={showNewTaskModal}
                onClose={() => setShowNewTaskModal(false)}
                onSave={handleSaveTask}
                courseId={courseId}
            />
        </div>
    );
};

export default Classroom;
