import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { authService } from "@/services/authService";
import { Student } from "@/types/user";

interface AuthState {
    user: Student | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (userData: Partial<Student>) => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: async (email: string, password: string): Promise<boolean> => {
                try {
                    if (email && password && password.length >= 6) {
                        const user = await authService.studentLogin({
                            email,
                            password,
                        });

                        // Salvar email no cookie
                        setCookie("user-email", email, {
                            maxAge: 30 * 24 * 60 * 60, // 30 dias
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                        });

                        // // Salvar dados do usuário no cookie
                        setCookie("user-data", JSON.stringify(user), {
                            maxAge: 30 * 24 * 60 * 60, // 30 dias
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                        });

                        set({ user, isAuthenticated: true });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Erro no login:", error);
                    return false;
                }
            },

            logout: () => {
                // Remover cookies
                deleteCookie("user-email");
                deleteCookie("user-data");
                set({ user: null, isAuthenticated: false });
            },

            updateUser: (userData: Partial<Student>) => {
                const currentUser = get().user;
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...userData };
                    // Atualizar cookie com novos dados
                    setCookie("user-data", JSON.stringify(updatedUser), {
                        maxAge: 30 * 24 * 60 * 60, // 30 dias
                        httpOnly: false,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                    });
                    set({ user: updatedUser });
                }
            },

            checkAuth: () => {
                try {
                    const userEmail = getCookie("user-email");
                    const userData = getCookie("user-data");

                    if (userEmail && userData) {
                        const user = JSON.parse(userData as string) as Student;
                        set({ user, isAuthenticated: true });
                    } else {
                        set({ user: null, isAuthenticated: false });
                    }
                } catch (error) {
                    console.error("Erro ao verificar autenticação:", error);
                    set({ user: null, isAuthenticated: false });
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
