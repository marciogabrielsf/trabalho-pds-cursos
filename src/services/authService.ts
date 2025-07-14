import { Student } from "@/types/user";
import { api } from "./api";
import { LoginRequest } from "@/types/auth";

class AuthService {
    async studentLogin(data: LoginRequest): Promise<Student | null> {
        const response = await api.post("/student/login", data);
        return response.data;
    }

    // async getCurrentUser(): Promise<Student | null> {
    //     const token = localStorage.getItem("authToken");

    //     if (!token) {
    //         return null;
    //     }

    //     try {
    //         const response = await fetch(`${this.baseUrl}/auth/me`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (!response.ok) {
    //             localStorage.removeItem("authToken");
    //             return null;
    //         }

    //         return response.json();
    //     } catch {
    //         localStorage.removeItem("authToken");
    //         return null;
    //     }
    // }
}

export const authService = new AuthService();
