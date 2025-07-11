import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers";
import { AuthInitializer } from "@/components/auth";

const InterFont = Inter({
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
            <body className={`${InterFont.className} antialiased`}>
                <QueryProvider>
                    <AuthInitializer>{children}</AuthInitializer>
                </QueryProvider>
            </body>
        </html>
    );
}
