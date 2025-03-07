import { UserRound, Home, ShoppingBasket, CircleDollarSign, HandCoins, LogOut} from "lucide-react"

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
  }
]

const footerItems = [
  {
    title: "Cerrar sesion",
    href: "/logout",
    icon: LogOut,
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mi Familia Verduleria</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="my-1">
                  <SidebarMenuButton asChild className="flex items-center space-x-4 text-lg rounded-lg transition" >
                    <a href={item.href} >
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
            {footerItems.map((footerItems) => (
              <SidebarMenuItem key={footerItems.title}>
                <SidebarMenuButton asChild>
                  <a href={footerItems.href}>
                    <footerItems.icon />
                    <span>{footerItems.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
