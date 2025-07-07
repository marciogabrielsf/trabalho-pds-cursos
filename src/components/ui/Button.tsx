import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    isLoading = false,
    children,
    className = "",
    disabled,
    ...props
}) => {
    const baseClasses = `
    w-full py-3 px-6 
    rounded-2xl font-bold 
    transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2 cursor-pointer
  `;

    const variantClasses = {
        primary: `
      bg-highlight text-white 
      hover:bg-orange-600 
      focus:ring-orange-500
    `,
        secondary: `
      bg-gray-100 text-gray-700 border border-gray-300
      hover:bg-gray-200 
      focus:ring-gray-500
    `,
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
};

export default Button;
