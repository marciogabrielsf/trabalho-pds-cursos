import { Category } from "@/stores/courseStore";

// Mantendo as categorias como mock para uso na interface
export const mockCategories: Category[] = [
    {
        id: "art-design",
        name: "Art & Design",
        icon: "art-design",
        coursesCount: 5,
        apiValue: "DESIGN",
    },
    {
        id: "programming",
        name: "Programming",
        icon: "programming",
        coursesCount: 5,
        apiValue: "PROGRAMMING",
    },
    {
        id: "photography",
        name: "Photography",
        icon: "photography",
        coursesCount: 5,
        apiValue: "PHOTOGRAPHY",
    },
    {
        id: "marketing",
        name: "Marketing",
        icon: "marketing",
        coursesCount: 5,
        apiValue: "MARKETING",
    },
    {
        id: "business",
        name: "Business",
        icon: "business",
        coursesCount: 5,
        apiValue: "BUSINESS",
    },
    {
        id: "science",
        name: "Science",
        icon: "science",
        coursesCount: 5,
        apiValue: "MUSIC", // Temporário - ajustar quando houver categoria Science na API
    },
];
