import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
    id: string;
    name: string;
    email: string;
    role: "student" | "teacher";
    profilePicture?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: (user: User) => {
                set({ user, isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },

            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...userData } });
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
