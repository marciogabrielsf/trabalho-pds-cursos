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
import { Course } from "@/types/course";
import { CheckCircle } from "lucide-react";

interface PurchaseSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course;
    onGoToCourse: () => void;
}

const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
    isOpen,
    onClose,
    course,
    onGoToCourse,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="flex justify-center mb-4"
                    >
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </motion.div>
                    <DialogTitle className="text-xl font-bold text-gray-900 text-center">
                        Compra Realizada com Sucesso!
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-center">
                        Parabéns! Você agora tem acesso completo ao curso.
                    </DialogDescription>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <h4 className="font-semibold text-green-800 mb-2">
                            Você está matriculado em:
                        </h4>
                        <p className="text-green-700 font-medium">{course.title}</p>
                        <p className="text-sm text-green-600 mt-1">Acesso liberado imediatamente</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">📚 Próximos passos:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Acesse o conteúdo do curso a qualquer momento</li>
                            <li>• Acompanhe seu progresso no dashboard</li>
                            <li>• Participe das atividades e discussões</li>
                            <li>• Entre em contato com o instrutor quando precisar</li>
                        </ul>
                    </div>
                </motion.div>

                <DialogFooter className="gap-2">
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Fechar
                    </Button>
                    <Button
                        onClick={onGoToCourse}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                        Acessar Curso
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PurchaseSuccessModal;
