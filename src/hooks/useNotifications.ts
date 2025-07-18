"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { NotificationService } from "@/services/notificationService";
import { WEBSOCKET_URL as WS_URL, NOTIFICATION_CONFIG } from "@/config/config";
import type { WebSocketMessage } from "@/types/notification";

const WEBSOCKET_URL = WS_URL;
const RECONNECT_ATTEMPTS = NOTIFICATION_CONFIG.reconnectAttempts;
const RECONNECT_DELAY = NOTIFICATION_CONFIG.reconnectDelay;

export const useNotifications = () => {
    const { user, isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [state, setState] = useState({
        isConnected: false,
        error: null as string | null,
    });

    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    // Query para buscar notificações do usuário
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ["notifications", user?.id, user?.role],
        queryFn: () =>
            user?.id ? NotificationService.getUserNotifications(user.id, user.role) : [],
        enabled: !!user?.id && isAuthenticated,
        staleTime: 1000 * 60, // 1 minuto
        refetchOnWindowFocus: true,
    });

    // Query para contagem de não lidas
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ["notifications-unread-count", user?.id, user?.role],
        queryFn: () => (user?.id ? NotificationService.getUnreadCount(user.id, user.role) : 0),
        enabled: !!user?.id && isAuthenticated,
        staleTime: 1000 * 30, // 30 segundos
        refetchInterval: 1000 * 60, // Revalida a cada minuto
    });

    // Mutations para ações de notificação
    const markAsReadMutation = useMutation({
        mutationFn: NotificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", user?.id, user?.role] });
            queryClient.invalidateQueries({
                queryKey: ["notifications-unread-count", user?.id, user?.role],
            });
        },
        onError: (error) => {
            console.error("Erro ao marcar como lida:", error);
            toast.error("Erro ao marcar notificação como lida");
        },
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: NotificationService.deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", user?.id, user?.role] });
            queryClient.invalidateQueries({
                queryKey: ["notifications-unread-count", user?.id, user?.role],
            });
            toast.success("Notificação removida");
        },
        onError: (error) => {
            console.error("Erro ao deletar notificação:", error);
            toast.error("Erro ao remover notificação");
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () =>
            user?.id ? NotificationService.markAllAsRead(user.id) : Promise.reject(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", user?.id, user?.role] });
            queryClient.invalidateQueries({
                queryKey: ["notifications-unread-count", user?.id, user?.role],
            });
            toast.success("Todas as notificações foram marcadas como lidas");
        },
        onError: (error) => {
            console.error("Erro ao marcar todas como lidas:", error);
            toast.error("Erro ao marcar todas como lidas");
        },
    });

    // Conectar automaticamente quando usuário estiver autenticado
    useEffect(() => {
        console.log("useNotifications useEffect triggered", {
            isAuthenticated,
            userId: user?.id,
            userRole: user?.role,
        });

        // Limpar conexão existente
        if (socketRef.current) {
            console.log("🧹 Limpando conexão WebSocket existente...");
            socketRef.current.close(1000, "Nova conexão");
            socketRef.current = null;
        }

        // Limpar timeout de reconexão
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (isAuthenticated && user?.id && user?.role) {
            const group = user.role === "teacher" ? "teachers" : "students";

            console.log("🔌 Configurando conexão WebSocket...", {
                userId: user.id,
                group,
                websocketUrl: WEBSOCKET_URL,
            });

            // Usar conectar ao grupo (preferencial) ou usuário específico
            const useGroupConnection = true; // Pode ser configurável

            let socketUrl: string;
            if (useGroupConnection) {
                socketUrl = `${WEBSOCKET_URL}/ws/${group}`;
            } else {
                socketUrl = `${WEBSOCKET_URL}/ws/user/${user.id}?group=${group}`;
            }

            console.log("🌐 URL final do WebSocket:", socketUrl);

            try {
                const socket = new WebSocket(socketUrl);

                socket.onopen = () => {
                    console.log("✅ WebSocket conectado com sucesso!");
                    setState((prev) => ({ ...prev, isConnected: true, error: null }));
                    setReconnectAttempts(0);

                    // Invalidar queries para sincronizar dados
                    queryClient.invalidateQueries({
                        queryKey: ["notifications", user.id, user.role],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["notifications-unread-count", user.id, user.role],
                    });
                };

                socket.onclose = (event) => {
                    console.log("❌ WebSocket desconectado:", {
                        code: event.code,
                        reason: event.reason,
                        wasClean: event.wasClean,
                    });
                    setState((prev) => ({ ...prev, isConnected: false }));

                    // Não tentar reconectar se foi uma desconexão manual (code 1000)
                    if (
                        event.code !== 1000 &&
                        reconnectAttempts < RECONNECT_ATTEMPTS &&
                        isAuthenticated
                    ) {
                        const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
                        console.log(
                            `🔄 Tentando reconectar em ${delay}ms (tentativa ${
                                reconnectAttempts + 1
                            }/${RECONNECT_ATTEMPTS})`
                        );

                        reconnectTimeoutRef.current = setTimeout(() => {
                            setReconnectAttempts((prev) => prev + 1);
                            // Re-executar o useEffect
                        }, delay);
                    }
                };

                socket.onerror = (error) => {
                    console.error("� Erro no WebSocket:", error);
                    setState((prev) => ({
                        ...prev,
                        isConnected: false,
                        error: "Erro de conexão com notificações",
                    }));
                };

                socket.onmessage = (event) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(event.data);
                        console.log("📢 Nova notificação recebida:", message);

                        // Invalidar queries para buscar dados atualizados
                        queryClient.invalidateQueries({
                            queryKey: ["notifications", user.id, user.role],
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["notifications-unread-count", user.id, user.role],
                        });

                        // Mostrar toast com sonner
                        toast(message.title, {
                            description: message.message,
                        });

                        // Notificação do browser se permitido
                        if (Notification.permission === "granted") {
                            new Notification(message.title, {
                                body: message.message,
                                icon: "/favicon.ico",
                            });
                        }
                    } catch (error) {
                        console.error("❌ Erro ao processar mensagem WebSocket:", error);
                    }
                };

                socketRef.current = socket;

                // Solicitar permissão para notificações do browser
                if ("Notification" in window && Notification.permission === "default") {
                    Notification.requestPermission().then((permission) => {
                        console.log("🔔 Permissão para notificações:", permission);
                    });
                }
            } catch (error) {
                console.error("💥 Erro ao criar WebSocket:", error);
                setState((prev) => ({
                    ...prev,
                    isConnected: false,
                    error: "Falha ao conectar com notificações",
                }));
            }
        } else {
            console.log("❌ Usuário não autenticado, não conectando WebSocket");
            setState((prev) => ({ ...prev, isConnected: false, error: null }));
            setReconnectAttempts(0);
        }

        // Cleanup function
        return () => {
            console.log("🧹 Cleanup do useEffect - fechando WebSocket");
            if (socketRef.current) {
                socketRef.current.close(1000, "Componente desmontado");
                socketRef.current = null;
            }
            setState((prev) => ({ ...prev, isConnected: false }));

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };
    }, [isAuthenticated, user?.id, user?.role, queryClient, reconnectAttempts]);

    return {
        // Estado
        notifications,
        unreadCount,
        isConnected: state.isConnected,
        isLoading,
        error: state.error,

        // Ações
        markAsRead: markAsReadMutation.mutate,
        deleteNotification: deleteNotificationMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,

        // Status das mutations
        isMarkingAsRead: markAsReadMutation.isPending,
        isDeleting: deleteNotificationMutation.isPending,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
    };
};
