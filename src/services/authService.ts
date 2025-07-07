interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

class AuthService {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erro no login");
        }

        return response.json();
    }

    async logout(): Promise<void> {
        const token = localStorage.getItem("authToken");

        if (token) {
            await fetch(`${this.baseUrl}/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        localStorage.removeItem("authToken");
    }

    async getCurrentUser(): Promise<LoginResponse["user"] | null> {
        const token = localStorage.getItem("authToken");

        if (!token) {
            return null;
        }

        try {
            const response = await fetch(`${this.baseUrl}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                localStorage.removeItem("authToken");
                return null;
            }

            return response.json();
        } catch {
            localStorage.removeItem("authToken");
            return null;
        }
    }
}

export const authService = new AuthService();
