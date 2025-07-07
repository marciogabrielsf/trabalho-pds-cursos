import { create } from "zustand";

export interface Category {
    id: string;
    name: string;
    icon: string;
    coursesCount: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    rating: number;
    studentsCount: number;
    lessonsCount: number;
    duration: string;
    price: number;
    originalPrice?: number;
    thumbnail: string;
    category: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    isEnrolled?: boolean;
    progress?: number;
}

interface CourseState {
    categories: Category[];
    courses: Course[];
    featuredCourses: Course[];
    searchQuery: string;
    selectedCategory: string | null;

    setCategories: (categories: Category[]) => void;
    setCourses: (courses: Course[]) => void;
    setFeaturedCourses: (courses: Course[]) => void;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (categoryId: string | null) => void;
    getFilteredCourses: () => Course[];
}

export const useCourseStore = create<CourseState>((set, get) => ({
    categories: [],
    courses: [],
    featuredCourses: [],
    searchQuery: "",
    selectedCategory: null,

    setCategories: (categories) => set({ categories }),
    setCourses: (courses) => set({ courses }),
    setFeaturedCourses: (courses) => set({ featuredCourses: courses }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

    getFilteredCourses: () => {
        const { courses, searchQuery, selectedCategory } = get();

        return courses.filter((course) => {
            const matchesSearch =
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || course.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    },
}));
