import { CourseCategory } from "@/types/course";

export interface Category {
    id: string;
    name: string;
    icon: string;
    coursesCount: number;
    apiValue: CourseCategory; // Mapeamento para o valor da API
}

// Mapeamento entre as categorias da UI e os valores da API
export const categoryMapping: Record<string, CourseCategory> = {
    programming: "PROGRAMMING",
    "art-design": "DESIGN",
    photography: "PHOTOGRAPHY",
    marketing: "MARKETING",
    business: "BUSINESS",
    science: "MUSIC", // Temporário - ajustar conforme necessário
};

// Mapeamento reverso: da API para UI
export const apiToCategoryMapping: Record<CourseCategory, string> = {
    PROGRAMMING: "programming",
    DESIGN: "art-design",
    PHOTOGRAPHY: "photography",
    MARKETING: "marketing",
    BUSINESS: "business",
    MUSIC: "science", // Temporário - ajustar conforme necessário
};
