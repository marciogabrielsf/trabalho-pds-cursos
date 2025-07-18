export type PaymentMethod = "pix" | "billet" | "credit_card";
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export interface Payment {
    id: number;
    enrollment_id: number;
    amount: number;
    payment_date: string;
    method: PaymentMethod;
    status: PaymentStatus;
}

export interface PaymentRequest {
    enrollment_id: number;
}

export interface PaymentResponse {
    id: number;
    enrollment_id: number;
    amount: number;
    payment_date: string;
    method: string;
    status: string;
}
