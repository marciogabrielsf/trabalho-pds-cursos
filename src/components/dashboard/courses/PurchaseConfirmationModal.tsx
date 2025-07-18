import React from "react";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { PaymentOption } from "@/components/ui/PaymentSelector";
import { Course } from "@/types/course";

interface PurchaseConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    course: Course;
    paymentOption: PaymentOption;
    isLoading: boolean;
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    course,
    paymentOption,
    isLoading,
}) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        Confirmar Compra
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Confirme os detalhes da sua compra antes de finalizar.
                    </DialogDescription>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Informações do Curso */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Curso</h4>
                        <p className="text-gray-700">{course.title}</p>
                        <p className="text-sm text-gray-500">
                            {course.studentsCount} alunos • {course.lessonsCount} aulas
                        </p>
                    </div>

                    {/* Informações do Pagamento */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Pagamento</h4>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Forma de pagamento:</span>
                            <span className="font-medium">{paymentOption.title}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Valor total:</span>
                            <span className="font-bold text-lg text-orange-600">
                                {formatPrice(paymentOption.price)}
                            </span>
                        </div>
                        {paymentOption.discount && (
                            <div className="mt-2 text-sm">
                                <span className="text-gray-500 line-through">
                                    {formatPrice(paymentOption.originalPrice || course.value || 0)}
                                </span>
                                <span className="text-green-600 ml-2">
                                    {paymentOption.discount}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Termos */}
                    <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded">
                        <p>
                            ⚠️ Ao confirmar esta compra, você concorda com nossos termos de uso e
                            política de privacidade. O acesso ao curso será liberado imediatamente
                            após a confirmação do pagamento.
                        </p>
                    </div>
                </motion.div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processando...
                            </div>
                        ) : (
                            "Confirmar Compra"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PurchaseConfirmationModal;
