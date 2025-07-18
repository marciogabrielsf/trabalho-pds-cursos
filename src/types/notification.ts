export interface Notification {
    id: number;
    title: string;
    message: string;
    type: "new_task" | "task_graded" | "new_delivery" | "deadline_warning" | "course_update";
    is_read: boolean;
    user_id?: number;
    course_id?: number;
    created_at: string;
}

export interface WebSocketMessage {
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    notification_id?: number;
}

export interface NotificationFilters {
    showAll: boolean;
    showUnread: boolean;
    type?: Notification["type"];
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface SendNotificationRequest {
    title: string;
    message: string;
    data?: Record<string, unknown>;
}

export interface NotificationConnectionOptions {
    userId: number;
    group?: "students" | "teachers";
    reconnectAttempts?: number;
    reconnectDelay?: number;
}
