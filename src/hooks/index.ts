export * from "./useCourseQuery";
export * from "./useLessonQuery";

// Hook simplificado para autenticação local (baseado no Zustand)
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
