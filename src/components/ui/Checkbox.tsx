import React, { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = "", ...props }, ref) => {
        return (
            <div className="flex items-center">
                <input
                    ref={ref}
                    type="checkbox"
                    className={`
            w-4 h-4 
            text-orange-500 
            border-gray-300 rounded 
            focus:ring-orange-500 focus:ring-2
            ${className}
          `}
                    {...props}
                />
                <label className="ml-2 text-sm text-gray-700 select-none cursor-pointer">
                    {label}
                </label>
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
