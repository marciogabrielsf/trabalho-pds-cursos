"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode } from "react";

interface QueryProviderProps {
    children: ReactNode;
}
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Configurações padrão para queries
            staleTime: 60 * 1000, // 1 minuto
            gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            // Configurações padrão para mutations
            retry: 1,
        },
    },
});

export default function QueryProvider({ children }: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* React Query DevTools - apenas em desenvolvimento */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
