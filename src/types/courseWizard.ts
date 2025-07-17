// Types shared between create and edit course pages
import { CourseDifficulty, CourseCategory } from "./course";
import { LessonType } from "./lesson";

export interface WizardStep {
    id: number;
    title: string;
    description: string;
}

export interface CourseWizardData {
    // Step 1: Basic Info
    title: string;
    description: string;
    value: number;
    trailer_url: string;
    thumbnail_url: string;
    difficulty: CourseDifficulty;
    category: CourseCategory;

    // Step 2: Existing Modules
    selectedModules: number[];

    // Step 3: New Modules
    newModules: {
        id: string;
        title: string;
        description: string;
        lessons: {
            id: string;
            title: string;
            type: LessonType;
            description: string;
            content: Record<string, unknown>;
            order: number;
        }[];
    }[];

    // Module order - maintains the order of all modules (existing + new)
    moduleOrder: Array<{
        id: string;
        type: "existing" | "new";
        originalId?: number; // for existing modules
    }>;
}
