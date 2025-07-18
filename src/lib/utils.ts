import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Re-export das funções de data para facilitar o uso
export {
    parseUTCDate,
    formatDateBR,
    formatTimeBR,
    formatDateTimeBR,
    formatRelativeTime,
} from "./dateUtils";
