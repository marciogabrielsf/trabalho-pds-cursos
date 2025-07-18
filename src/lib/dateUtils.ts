/**
 * Utilitários para formatação e manipulação de datas
 * Lida com conversões de timezone UTC para local
 */

/**
 * Converte uma string de data UTC para um objeto Date no timezone local
 * @param dateString - String de data (assumida como UTC se não tiver 'Z')
 * @returns Date object ajustado para o timezone local
 */
export const parseUTCDate = (dateString: string): Date => {
    // Se a string já tem 'Z' no final, está em UTC
    // Se não tem, assumimos que é UTC e adicionamos 'Z'
    const utcString = dateString.includes("Z") ? dateString : dateString + "Z";
    return new Date(utcString);
};

/**
 * Corrige o fuso horário de notificações que vêm da API
 * Força interpretação como UTC e converte para timezone local brasileiro (UTC-3)
 * @param dateString - String de data da notificação
 * @returns Date object correto para o timezone brasileiro
 */
export const parseNotificationDate = (dateString: string): Date => {
    // Remove qualquer indicador de timezone e força como UTC
    const cleanDateString = dateString.replace(/[+-]\d{2}:\d{2}$/g, "").replace("Z", "");

    // Cria data interpretando como UTC
    const utcDate = new Date(cleanDateString + "Z");

    // Se a data é inválida, tenta com a string original
    if (isNaN(utcDate.getTime())) {
        return new Date(dateString);
    }

    return utcDate;
};

/**
 * Formata uma data para o padrão brasileiro (dd de mmmm)
 * @param dateString - String de data UTC
 * @returns Data formatada em português brasileiro
 */
export const formatDateBR = (dateString: string): string => {
    const date = parseUTCDate(dateString);
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
    });
};

/**
 * Formata o horário para o padrão brasileiro (HH:mm)
 * @param dateString - String de data UTC
 * @returns Horário formatado (HH:mm)
 */
export const formatTimeBR = (dateString: string): string => {
    const date = parseUTCDate(dateString);
    return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Formata data e hora completa para o padrão brasileiro
 * @param dateString - String de data UTC
 * @returns Data e hora formatadas (dd/mm/aaaa HH:mm)
 */
export const formatDateTimeBR = (dateString: string): string => {
    const date = parseUTCDate(dateString);
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Formata data relativa (há X minutos, há X horas, etc.)
 * @param dateString - String de data UTC
 * @returns Texto relativo da data
 */
export const formatRelativeTime = (dateString: string): string => {
    const date = parseUTCDate(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
        return "Agora mesmo";
    } else if (diffInMinutes < 60) {
        return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
    } else if (diffInHours < 24) {
        return `há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    } else if (diffInDays < 7) {
        return `há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;
    } else {
        return formatDateBR(dateString);
    }
};
