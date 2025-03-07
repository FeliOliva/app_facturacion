"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/clientes": "Clientes",
    "/productos": "Productos",
    "/pagos": "Pagos",
    "/ventas": "Ventas",
    "/login": "Inicio de sesión",
    "/": "Inicio",
  };

  const currentPageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <header className="flex items-center bg-white shadow-md px-4 py-2">
      <SidebarTrigger />
      <h1 className="ml-4 text-xl font-semibold">{currentPageTitle}</h1>
    </header>
  );
}
