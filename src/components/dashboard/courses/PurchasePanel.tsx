import React, { useState } from "react";
import { ChevronDown, ChevronUp, Users, Clock, BarChart, NotepadText } from "lucide-react";
import PaymentSelector, { PaymentOption } from "@/components/ui/PaymentSelector";
import { Button } from "@/components/ui";

interface PurchasePanelProps {
    price: number;
    originalPrice?: number;
    onPurchase: (paymentOption: PaymentOption) => void;
    studentsCount?: number;
    lessonsCount?: number;
    modulesCount?: number;
    level?: string;
}

const PurchasePanel: React.FC<PurchasePanelProps> = ({
    price,
    originalPrice,
    onPurchase,
    studentsCount = 60,
    lessonsCount = 20,
    modulesCount = 4,
    level = "Iniciante e Intermediário",
}) => {
    // Estado
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [showFormasPagamento, setShowFormasPagamento] = useState(true);
    const [showOutrasFormas, setShowOutrasFormas] = useState(false);

    const paymentOptions: PaymentOption[] = [
        {
            id: "credit-card",
            title: `1x de R$${price.toFixed(2)} sem juros`,
            description: "Cartão de crédito",
            price: price,
            originalPrice: price,
        },
        {
            id: "credit-installments-2x",
            title: `2x de R$${(price / 2).toFixed(2)} sem juros`,
            description: "Cartão de crédito",
            price: price,
            installments: `2x de R$${(price / 2).toFixed(2)} sem juros`,
        },
        {
            id: "credit-installments-3x",
            title: `3x de R$${(price / 3).toFixed(2)} sem juros`,
            description: "Cartão de crédito",
            price: price,
            installments: `3x de R$${(price / 3).toFixed(2)} sem juros`,
        },
    ];

    const getFinalPrice = () => {
        if (selectedPayment === "pix") {
            return price * 0.97; // 3% de desconto no PIX
        }
        return price;
    };

    const getDiscountAmount = () => {
        if (selectedPayment === "pix") {
            return price * 0.03; // 3% de desconto
        }
        return 0;
    };

    const isCardPayment = () => {
        return selectedPayment && paymentOptions.some((opt) => opt.id === selectedPayment);
    };

    const handlePaymentSelect = (optionId: string) => {
        setSelectedPayment(optionId);
    };

    const handleOtherPaymentSelect = (paymentType: string) => {
        setSelectedPayment(paymentType);
    };

    const handlePurchase = () => {
        let option;

        if (selectedPayment === "pix") {
            option = {
                id: "pix",
                title: "Pix copia e cola",
                description: "PIX",
                price: getFinalPrice(),
                originalPrice: price,
            };
        } else if (selectedPayment === "boleto") {
            option = {
                id: "billet",
                title: "Boleto a vista",
                description: "Boleto",
                price: price,
                originalPrice: price,
            };
        } else {
            // Para pagamentos com cartão, mapear para credit_card
            const foundOption = paymentOptions.find((opt) => opt.id === selectedPayment);
            if (foundOption) {
                option = {
                    ...foundOption,
                    id: "credit-card", // Mapear todos os pagamentos de cartão para credit-card
                };
            }
        }

        if (option) {
            onPurchase(option);
        }
    };

    const renderPriceSection = () => (
        <div className="flex items-center justify-between mb-6">
            <div>
                {originalPrice && (
                    <div className="text-lg text-gray-400 line-through">
                        R${originalPrice.toFixed(2)}
                    </div>
                )}
                <div className="text-3xl font-bold text-gray-900">R${price.toFixed(2)}</div>
            </div>
            <div className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-md text-sm font-semibold">
                3% OFF NO PIX
            </div>
        </div>
    );

    const renderCourseInfo = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                    <BarChart className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Nível do curso</span>
                </div>
                <span className="text-gray-600">{level}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Alunos matriculados</span>
                </div>
                <span className="text-gray-600">{studentsCount}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Aulas</span>
                </div>
                <span className="text-gray-600">{lessonsCount}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                    <NotepadText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Módulos</span>
                </div>
                <span className="text-gray-600">{modulesCount}</span>
            </div>
        </div>
    );

    const renderCardForm = () => (
        <div className="mt-4 space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                    type="text"
                    placeholder="Nome do cartão"
                    className="w-full placeholder:text-gray-400 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do cartão
                </label>
                <input
                    type="text"
                    placeholder="**** **** **** ****"
                    className="w-full placeholder:text-gray-400 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MM / YY</label>
                    <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full placeholder:text-gray-400 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input
                        type="text"
                        placeholder="Código de segurança"
                        className="w-full placeholder:text-gray-400 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
            </div>
        </div>
    );

    const renderCreditCardSection = () => (
        <div className="mt-6">
            <button
                onClick={() => setShowFormasPagamento(!showFormasPagamento)}
                className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg text-left font-medium text-gray-900 text-sm"
            >
                <span>Pagamento no cartão de crédito</span>
                {showFormasPagamento ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showFormasPagamento && (
                <div className="mt-4">
                    <PaymentSelector
                        options={paymentOptions}
                        selectedOption={selectedPayment}
                        onSelect={handlePaymentSelect}
                    />
                    {isCardPayment() && renderCardForm()}
                </div>
            )}
        </div>
    );

    const renderOtherPaymentOptions = () => (
        <div className="mt-4">
            <button
                onClick={() => setShowOutrasFormas(!showOutrasFormas)}
                className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg text-left font-medium text-gray-900 text-sm"
            >
                <span>Outras formas de pagamento</span>
                {showOutrasFormas ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showOutrasFormas && (
                <div className="mt-4 space-y-3">
                    <button
                        onClick={() => handleOtherPaymentSelect("boleto")}
                        className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                            selectedPayment === "boleto"
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <span className="text-gray-700">Boleto a vista</span>
                        <div className="text-right">
                            <div className="text-gray-900 font-medium">R${price.toFixed(2)}</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleOtherPaymentSelect("pix")}
                        className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                            selectedPayment === "pix"
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <span className="text-gray-700">Pix copia e cola</span>
                        <div className="text-right">
                            <div className="text-gray-900 font-medium">
                                R${(price * 0.97).toFixed(2)}
                            </div>
                            <div className="text-xs text-orange-600">3% OFF</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );

    const renderOrderSummary = () => (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do pedido</h3>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">
                        R${originalPrice?.toFixed(2) || price.toFixed(2)}
                    </span>
                </div>
                {getDiscountAmount() > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Desconto PIX:</span>
                        <span className="text-red-600">-R${getDiscountAmount().toFixed(2)}</span>
                    </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">R${getFinalPrice().toFixed(2)} BRA</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit shadow-lg">
            {renderPriceSection()}

            <hr className="my-4" />

            {renderCourseInfo()}

            <hr className="my-4" />

            {renderCreditCardSection()}

            {renderOtherPaymentOptions()}

            {renderOrderSummary()}

            <div className="mt-6">
                <Button
                    onClick={handlePurchase}
                    disabled={!selectedPayment}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
                >
                    Concluir Pagamento
                </Button>
            </div>
        </div>
    );
};

export default PurchasePanel;
