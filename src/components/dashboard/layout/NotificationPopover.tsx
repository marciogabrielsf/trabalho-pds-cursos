"use client";

import React from "react";
import { Bell, Check, X, CheckCheck, Wifi, WifiOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { parseNotificationDate } from "@/lib/dateUtils";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { useNotificationFilters } from "@/hooks/useNotificationFilters";
import type { Notification } from "@/types/notification";

interface NotificationPopoverContentProps {
    onClose?: () => void;
}

const NotificationPopoverContent: React.FC<NotificationPopoverContentProps> = () => {
    const {
        notifications,
        unreadCount,
        isConnected,
        isLoading,
        error,
        markAsRead,
        deleteNotification,
        markAllAsRead,
        isMarkingAsRead,
        isDeleting,
        isMarkingAllAsRead,
    } = useNotificationContext();

    const { filters, filteredNotifications, setShowAll, setShowUnread } =
        useNotificationFilters(notifications);

    // Ícones por tipo de notificação
    const getNotificationIcon = (type: Notification["type"]) => {
        const icons = {
            new_task: "📋",
            task_graded: "✅",
            new_delivery: "📤",
            deadline_warning: "⚠️",
            course_update: "📚",
        };
        return icons[type] || "🔔";
    };

    // Cores por tipo
    const getNotificationColor = (type: Notification["type"]) => {
        const colors = {
            new_task: "bg-blue-50 border-blue-200",
            task_graded: "bg-green-50 border-green-200",
            new_delivery: "bg-orange-50 border-orange-200",
            deadline_warning: "bg-red-50 border-red-200",
            course_update: "bg-purple-50 border-purple-200",
        };
        return colors[type] || "bg-gray-50 border-gray-200";
    };

    const handleMarkAsRead = (notificationId: number) => {
        markAsRead(notificationId);
    };

    const handleDelete = (notificationId: number) => {
        deleteNotification(notificationId);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    if (isLoading) {
        return (
            <div className="w-80 p-4">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Carregando notificações...</span>
                </div>
            </div>
        );
    }

    return (
        <div className=" max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">Notificações</h4>
                    <div className="flex items-center space-x-2">
                        {/* Status de conexão */}
                        <div className="flex items-center space-x-1">
                            {isConnected ? (
                                <Wifi size={14} className="text-green-500" />
                            ) : (
                                <WifiOff size={14} className="text-red-500" />
                            )}
                            <span
                                className={cn(
                                    "text-xs",
                                    isConnected ? "text-green-600" : "text-red-600"
                                )}
                            >
                                {isConnected ? "Online" : "Offline"}
                            </span>
                        </div>

                        {/* Counter */}
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {unreadCount} nova{unreadCount !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex space-x-2">
                    <button
                        onClick={setShowAll}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                            filters.showAll
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        Todas
                    </button>
                    <button
                        onClick={setShowUnread}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                            filters.showUnread
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        Não lidas
                    </button>
                </div>

                {/* Ação marcar todas como lidas */}
                {unreadCount > 0 && (
                    <div className="mt-3">
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={isMarkingAllAsRead}
                            className="w-full px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isMarkingAllAsRead ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600 mr-2" />
                                    Marcando...
                                </>
                            ) : (
                                <>
                                    <CheckCheck size={12} className="mr-1" />
                                    Marcar todas como lidas
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Error state */}
            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Lista de notificações */}
            <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <Bell size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                            {notifications.length === 0
                                ? "Nenhuma notificação ainda"
                                : "Nenhuma notificação encontrada"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "p-4 hover:bg-gray-50 transition-colors",
                                    !notification.is_read && "bg-blue-50/50",
                                    getNotificationColor(notification.type)
                                )}
                            >
                                <div className="flex items-start space-x-3">
                                    {/* Ícone */}
                                    <div className="flex-shrink-0 mt-1">
                                        <span className="text-lg">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h5
                                                    className={cn(
                                                        "text-sm font-medium text-gray-900 truncate",
                                                        !notification.is_read && "font-semibold"
                                                    )}
                                                >
                                                    {notification.title}
                                                </h5>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {formatDistanceToNow(
                                                        parseNotificationDate(
                                                            notification.created_at
                                                        ),
                                                        {
                                                            addSuffix: true,
                                                            locale: ptBR,
                                                        }
                                                    )}
                                                </p>
                                            </div>

                                            {/* Ações */}
                                            <div className="flex items-center space-x-1 ml-2">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() =>
                                                            handleMarkAsRead(notification.id)
                                                        }
                                                        disabled={isMarkingAsRead}
                                                        className="h-6 w-6 p-0 rounded hover:bg-green-100 flex items-center justify-center transition-colors"
                                                        title="Marcar como lida"
                                                    >
                                                        <Check
                                                            size={12}
                                                            className="text-green-600"
                                                        />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    disabled={isDeleting}
                                                    className="h-6 w-6 p-0 rounded hover:bg-red-100 flex items-center justify-center transition-colors"
                                                    title="Remover notificação"
                                                >
                                                    <X size={12} className="text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPopoverContent;
