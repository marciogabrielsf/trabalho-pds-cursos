import { PaymentResponse } from "@/types/payment";
import { api } from "./api";

export const paymentService = {
    async markAsPaid(paymentId: number): Promise<PaymentResponse> {
        try {
            const response = await api.post(`/payment/${paymentId}/pay`);
            return response.data;
        } catch (error) {
            console.error("Erro no serviço de pagamento:", error);
            throw error;
        }
    },
};
