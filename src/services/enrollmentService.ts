import { CreateEnrollmentRequest, CreateEnrollmentResponse } from "@/types/enrollment";
import { PaymentMethod } from "@/types/payment";
import { api } from "./api";
import { AxiosError } from "axios";

export const enrollmentService = {
    async createEnrollment(
        data: CreateEnrollmentRequest,
        method: PaymentMethod
    ): Promise<CreateEnrollmentResponse> {
        try {
            const response = await api.post(`/enrollment/?method=${method}`, data);
            return response.data;
        } catch (error) {
            console.error("Erro no serviço de matrícula:", error);
            if (error instanceof AxiosError && error.response) {
                console.error("Dados da resposta de erro:", error.response.data);
                console.error("Status da resposta de erro:", error.response.status);
            }
            throw error;
        }
    },
};
