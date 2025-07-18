export const APP_NAME = "CURSED";

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

// Notification Configuration
export const NOTIFICATION_CONFIG = {
    reconnectAttempts: 5,
    reconnectDelay: 1000, // 1 segundo inicial
    toastDurations: {
        new_task: 5000,
        task_graded: 4000,
        new_delivery: 4000,
        deadline_warning: 6000,
        course_update: 3000,
    },
};
