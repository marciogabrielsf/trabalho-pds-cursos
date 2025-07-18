"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/types/notification";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    markAsRead: (id: number) => void;
    deleteNotification: (id: number) => void;
    markAllAsRead: () => void;
    isMarkingAsRead: boolean;
    isDeleting: boolean;
    isMarkingAllAsRead: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const notificationData = useNotifications();

    return (
        <NotificationContext.Provider value={notificationData}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotificationContext must be used within a NotificationProvider");
    }
    return context;
};
