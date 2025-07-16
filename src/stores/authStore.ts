import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { authService } from "@/services/authService";
import { Student, Teacher } from "@/types/user";

interface AuthState {
    user: Student | Teacher | null;
    isAuthenticated: boolean;
    userRole: "student" | "teacher" | null;
    login: (email: string, password: string) => Promise<boolean>;
    teacherLogin: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (userData: Partial<Student | Teacher>) => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            userRole: null,

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

                        // Salvar dados do usuário no cookie
                        setCookie("user-data", JSON.stringify(user), {
                            maxAge: 30 * 24 * 60 * 60, // 30 dias
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                        });

                        // Salvar role no cookie
                        setCookie("user-role", "student", {
                            maxAge: 30 * 24 * 60 * 60, // 30 dias
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                        });

                        set({ user, isAuthenticated: true, userRole: "student" });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Erro no login:", error);
                    return false;
                }
            },

            teacherLogin: async (email: string, password: string): Promise<boolean> => {
                try {
                    if (email && password && password.length >= 6) {
                        const user = await authService.teacherLogin({
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

                        // Salvar dados do usuário no cookie
                        setCookie("user-data", JSON.stringify(user), {
                            maxAge: 30 * 24 * 60 * 60, // 30 dias
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                        });

                        // Salvar role no cookie
                        setCookie("user-role", "teacher", {
                            maxAge: 30 * 24 * 60 * 60, // 30 dias
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                        });

                        set({ user, isAuthenticated: true, userRole: "teacher" });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Erro no login do professor:", error);
                    return false;
                }
            },

            logout: () => {
                // Remover cookies
                deleteCookie("user-email");
                deleteCookie("user-data");
                deleteCookie("user-role");
                set({ user: null, isAuthenticated: false, userRole: null });
            },

            updateUser: (userData: Partial<Student | Teacher>) => {
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
                    const userRole = getCookie("user-role");

                    if (userEmail && userData && userRole) {
                        const user = JSON.parse(userData as string) as Student | Teacher;
                        set({
                            user,
                            isAuthenticated: true,
                            userRole: userRole as "student" | "teacher",
                        });
                    } else {
                        set({ user: null, isAuthenticated: false, userRole: null });
                    }
                } catch (error) {
                    console.error("Erro ao verificar autenticação:", error);
                    set({ user: null, isAuthenticated: false, userRole: null });
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
