"use client";

import { UserRound, Home, ShoppingBasket, CircleDollarSign, HandCoins, LogOut} from "lucide-react";
import { useAuthContext } from "../context/AuthContext"; // Importar el hook de autenticación
import { useRouter } from "next/navigation"; // Importar el hook de navegación

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: UserRound,
  },
  {
    title: "Productos",
    href: "/productos",
    icon: ShoppingBasket,
  },
  {
    title: "Pagos",
    href: "/pagos",
    icon: HandCoins,
  },
  {
    title: "Ventas",
    href: "/ventas",
    icon: CircleDollarSign,
  }
];

const footerItems = [
  {
    title: "Cerrar sesion",
    icon: LogOut,
  }
];

export function AppSidebar() {
  const { logout, token } = useAuthContext();
  const router = useRouter(); // Usamos useRouter para redirigir

  const handleLogout = () => {
    logout(); // Ejecuta el logout
    router.push("/login"); // Redirige a la página de login
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mi Familia Verduleria</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="my-1">
                  <SidebarMenuButton asChild className="flex items-center space-x-4 text-lg rounded-lg transition">
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
        {token && ( // Solo mostrar el logout si hay un token
            <SidebarMenuItem key={footerItems[0].title}>
              <SidebarMenuButton asChild>
                <button onClick={handleLogout} className="flex items-center space-x-4 text-lg rounded-lg">
                  <LogOut />
                  <span>{footerItems[0].title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
