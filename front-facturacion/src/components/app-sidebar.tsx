import { UserRound , Home, ShoppingBasket , CircleDollarSign , HandCoins } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mi Familia Verduleria</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
    </Sidebar>
    
  )
}
