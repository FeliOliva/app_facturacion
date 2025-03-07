// src/app/layout.tsx


import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider } from "@/context/AuthContext"; // Importa el AuthProvider
import { monserrat } from "@/components/ui/font";
import { Header } from "@/components/ui/header";

export const metadata: Metadata = {
  title: "Mi familia verdulería",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${monserrat.className} antialiased`}>
        <AuthProvider>
          <SidebarProvider defaultOpen={false}>
              {/* Sidebar en el lado izquierdo */}
              <AppSidebar />

              {/* Contenido principal */}
              <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 h-full overflow-auto p-4">
                  {children}
                </main>
              </div>

          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
