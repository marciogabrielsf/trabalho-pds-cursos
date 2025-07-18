import { api } from "@/services/api";
import type { Notification, SendNotificationRequest } from "@/types/notification";

export class NotificationService {
    // Buscar notificações do usuário (estudante ou professor)
    static async getUserNotifications(userId: number, userRole?: string): Promise<Notification[]> {
        try {
            let response;
            if (userRole === "teacher") {
                response = await api.get(`/notifications/teacher/${userId}`);
            } else {
                response = await api.get(`/notifications/user/${userId}`);
            }
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
            throw error;
        }
    }

    // Buscar notificações específicas de teacher
    static async getTeacherNotifications(teacherId: number): Promise<Notification[]> {
        try {
            const response = await api.get(`/notifications/teacher/${teacherId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar notificações do professor:", error);
            throw error;
        }
    }

    // Buscar contagem de não lidas (com suporte a teacher)
    static async getUnreadCount(userId: number, userRole?: string): Promise<number> {
        try {
            let response;
            if (userRole === "teacher") {
                response = await api.get(`/notifications/teacher/${userId}/count`);
            } else {
                response = await api.get(`/notifications/user/${userId}/count`);
            }
            return response.data.count || 0;
        } catch (error) {
            console.error("Erro ao buscar contagem de não lidas:", error);
            throw error;
        }
    }

    // Marcar notificação como lida
    static async markAsRead(notificationId: number): Promise<void> {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
            throw error;
        }
    }

    // Deletar notificação
    static async deleteNotification(notificationId: number): Promise<void> {
        try {
            await api.delete(`/notifications/${notificationId}`);
        } catch (error) {
            console.error("Erro ao deletar notificação:", error);
            throw error;
        }
    }

    // Marcar todas como lidas
    static async markAllAsRead(userId: number): Promise<void> {
        try {
            await api.put(`/notifications/user/${userId}/mark-all-read`);
        } catch (error) {
            console.error("Erro ao marcar todas como lidas:", error);
            throw error;
        }
    }

    // Enviar notificação para usuário
    static async sendToUser(userId: number, notification: SendNotificationRequest): Promise<void> {
        try {
            await api.post(`/ws/send-to-user/${userId}`, notification);
        } catch (error) {
            console.error("Erro ao enviar notificação para usuário:", error);
            throw error;
        }
    }

    // Enviar notificação para grupo
    static async sendToGroup(
        group: "students" | "teachers",
        notification: SendNotificationRequest
    ): Promise<void> {
        try {
            await api.post(`/ws/send-to-group/${group}`, notification);
        } catch (error) {
            console.error("Erro ao enviar notificação para grupo:", error);
            throw error;
        }
    }
}
