"use client";

import { useState, useMemo } from "react";
import type { Notification, NotificationFilters } from "@/types/notification";

export const useNotificationFilters = (notifications: Notification[]) => {
    const [filters, setFilters] = useState<NotificationFilters>({
        showAll: true,
        showUnread: false,
    });

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            if (filters.showUnread && notification.is_read) return false;
            if (filters.type && notification.type !== filters.type) return false;
            return true;
        });
    }, [notifications, filters]);

    const setShowAll = () => {
        setFilters({ showAll: true, showUnread: false });
    };

    const setShowUnread = () => {
        setFilters({ showAll: false, showUnread: true });
    };

    const setTypeFilter = (type: Notification["type"] | undefined) => {
        setFilters((prev) => ({ ...prev, type }));
    };

    const clearFilters = () => {
        setFilters({ showAll: true, showUnread: false });
    };

    return {
        filters,
        filteredNotifications,
        setShowAll,
        setShowUnread,
        setTypeFilter,
        clearFilters,
    };
};
