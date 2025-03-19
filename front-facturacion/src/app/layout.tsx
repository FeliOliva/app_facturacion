"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { monserrat } from "@/components/ui/font";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/ui/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Obtiene la ruta actual
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (pathname !== "/login") {
        router.replace("/login");
      }
    } else {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, [router, pathname]);

  if (loading) {
    return (
      <html lang="es">
        <body className={`${monserrat.className} antialiased`}>
          <div className="flex items-center justify-center h-screen">
            <p>Cargando...</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body className={`${monserrat.className} antialiased`}>
        <title>Mi familia Verduleria</title>
        <AuthProvider>
          {isAuthenticated || pathname === "/login" ? (
            <SidebarProvider defaultOpen={false}>
              {isAuthenticated && <AppSidebar />}
              <div className="flex flex-col flex-1">
                {isAuthenticated && <Header />}
                <main className="flex-1 h-full overflow-auto p-4">{children}</main>
              </div>
            </SidebarProvider>
          ) : null}
        </AuthProvider>
      </body>
    </html>
  );
}