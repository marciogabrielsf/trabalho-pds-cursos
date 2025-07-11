import React from "react";

export interface PaymentOption {
    id: string;
    title: string;
    description: string;
    installments?: string;
    discount?: string;
    price: number;
    originalPrice?: number;
}

interface PaymentSelectorProps {
    options: PaymentOption[];
    selectedOption: string | null;
    onSelect: (optionId: string) => void;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({ options, selectedOption, onSelect }) => {
    return (
        <div className="space-y-3">
            {options.map((option) => (
                <div
                    key={option.id}
                    className={`
            border rounded-lg p-4 cursor-pointer transition-all duration-200
            ${
                selectedOption === option.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
            }
          `}
                    onClick={() => onSelect(option.id)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${
                    selectedOption === option.id
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300"
                }
              `}
                            >
                                {selectedOption === option.id && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>

                            <div>
                                <div className="font-medium text-gray-900">{option.title}</div>
                                <div className="text-sm text-gray-600">{option.description}</div>
                                {option.installments && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        {option.installments}
                                    </div>
                                )}
                                {option.discount && (
                                    <div className="text-xs text-green-600 mt-1">
                                        {option.discount}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            {option.originalPrice && (
                                <div className="text-sm text-gray-400 line-through">
                                    R$ {option.originalPrice.toFixed(2)}
                                </div>
                            )}
                            <div className="font-bold text-gray-900">
                                R$ {option.price.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PaymentSelector;
