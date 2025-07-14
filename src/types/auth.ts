export interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    isLoading?: boolean;
}

export interface LoginFormData {
    email: string;
    senha: string;
    lembrarDeMin: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}
