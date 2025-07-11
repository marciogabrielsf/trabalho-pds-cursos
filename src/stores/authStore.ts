import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

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
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: async (email: string, password: string): Promise<boolean> => {
                try {
                    // Simular autenticação - aqui você faria a chamada para a API
                    // Por agora, vamos aceitar qualquer email/senha válidos
                    if (email && password && password.length >= 6) {
                        // Simular resposta da API
                        const mockUser: User = {
                            id: Math.random().toString(36).substr(2, 9),
                            name: email.split('@')[0], // Usar parte do email como nome
                            email: email,
                            role: email.includes('teacher') ? 'teacher' : 'student',
                            profilePicture: undefined,
                        };

                        // Salvar email no cookie
                        setCookie('user-email', email, {
                            maxAge: 30 * 24 * 60 * 60, // 30 dias
                            httpOnly: false,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                        });

                        // Salvar dados do usuário no cookie
                        setCookie('user-data', JSON.stringify(mockUser), {
                            maxAge: 30 * 24 * 60 * 60, // 30 dias
                            httpOnly: false,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                        });

                        set({ user: mockUser, isAuthenticated: true });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Erro no login:', error);
                    return false;
                }
            },

            logout: () => {
                // Remover cookies
                deleteCookie('user-email');
                deleteCookie('user-data');
                set({ user: null, isAuthenticated: false });
            },

            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...userData };
                    // Atualizar cookie com novos dados
                    setCookie('user-data', JSON.stringify(updatedUser), {
                        maxAge: 30 * 24 * 60 * 60, // 30 dias
                        httpOnly: false,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                    });
                    set({ user: updatedUser });
                }
            },

            checkAuth: () => {
                try {
                    const userEmail = getCookie('user-email');
                    const userData = getCookie('user-data');
                    
                    if (userEmail && userData) {
                        const user = JSON.parse(userData as string) as User;
                        set({ user, isAuthenticated: true });
                    } else {
                        set({ user: null, isAuthenticated: false });
                    }
                } catch (error) {
                    console.error('Erro ao verificar autenticação:', error);
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
