export * from "./useCourseQuery";
export * from "./useTeacherQuery";
export * from "./useModuleQuery";
export * from "./useLessonQuery";
export * from "./useCourseEdit";
export * from "./useCourseEditAPI";
export * from "./useCourseEditSave";
export * from "./useWizardSteps";
export * from "./useStatusDialog";
export * from "./useCommentQuery";
export * from "./useTaskQuery";
export * from "./useNotifications";
export * from "./useNotificationFilters";

import { useAuthStore } from "@/stores/authStore";

export const useAuthLocal = () => {
    const { user, isAuthenticated, login, logout, updateUser } = useAuthStore();

    return {
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
    };
};
