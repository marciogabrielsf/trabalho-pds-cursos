import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers";
import { AuthInitializer } from "@/components/auth";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sistema de Cursos Online",
    description: "Plataforma de gestão de cursos com conteúdo modular",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${inter.className} antialiased`}>
                <QueryProvider>
                    <NotificationProvider>
                        <AuthInitializer>
                            <Toaster
                                position="top-center"
                                toastOptions={{
                                    style: {
                                        color: "#000000",
                                    },
                                }}
                                theme="light"
                            />
                            {children}
                        </AuthInitializer>
                    </NotificationProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
