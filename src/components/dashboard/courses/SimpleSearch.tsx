import { Search } from "lucide-react";
import React from "react";

type SimpleSearchProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export default function SimpleSearch({
    value,
    onChange,
    placeholder = "Pesquisar...",
}: SimpleSearchProps) {
    return (
        <div className="relative">
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
            />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
        </div>
    );
}
