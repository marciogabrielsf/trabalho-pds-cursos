import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { enrollmentService } from "@/services/enrollmentService";
import { paymentService } from "@/services/paymentService";
import { PaymentMethod } from "@/types/payment";
import { useAuthStore } from "@/stores/authStore";

interface UsePurchaseOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const usePurchase = (options?: UsePurchaseOptions) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAuthStore();

    const purchaseMutation = useMutation({
        mutationFn: async ({
            courseId,
            paymentMethod,
        }: {
            courseId: number;
            paymentMethod: PaymentMethod;
            amount: number;
        }) => {
            if (!user) {
                throw new Error("Usuário não autenticado");
            }

            setIsProcessing(true);

            try {
                // Primeiro, criar a matrícula
                const enrollmentData = {
                    student_id: user.id,
                    course_id: courseId,
                };

                const enrollment = await enrollmentService.createEnrollment(
                    enrollmentData,
                    paymentMethod
                );

                const payment = await paymentService.markAsPaid(enrollment.payment_id);

                return { enrollment, payment };
            } finally {
                setIsProcessing(false);
            }
        },
        onSuccess: () => {
            options?.onSuccess?.();
        },
        onError: (error) => {
            setIsProcessing(false);
            options?.onError?.(error as Error);
        },
    });

    return {
        purchase: purchaseMutation.mutate,
        isLoading: purchaseMutation.isPending || isProcessing,
        error: purchaseMutation.error,
        isSuccess: purchaseMutation.isSuccess,
        reset: purchaseMutation.reset,
    };
};
