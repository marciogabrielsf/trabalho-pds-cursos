import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        const baseClasses = `
      w-full px-4 py-3 
      border border-gray-300 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
      placeholder:text-gray-400
      text-black
      transition-all duration-200
      ${error ? "border-red-500 focus:ring-red-500" : ""}
    `;

        return (
            <div className="flex flex-col">
                {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
                <input ref={ref} className={`${baseClasses} ${className}`} {...props} />
                {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
