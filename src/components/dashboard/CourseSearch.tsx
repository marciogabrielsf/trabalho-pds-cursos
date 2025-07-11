import { Search } from "lucide-react";
import React from "react";

type CourseSearchProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
};

export default function CourseSearch({ searchQuery, setSearchQuery }: CourseSearchProps) {
    return (
        <div className=" flex items-center justify-center bg-secondary mx-6 rounded-xl p-6 py-10 relative overflow-hidden">
            <div className="relative z-10 flex items-center flex-col">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Aprimore suas habilidades com cursos profissionais
                </h1>
                <p className="text-purple-100 mb-6">CURSOS ONLINE</p>

                <div className="w-full relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Pesquise seu curso aqui"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-gray-500 bg-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    />
                </div>
            </div>
        </div>
    );
}
