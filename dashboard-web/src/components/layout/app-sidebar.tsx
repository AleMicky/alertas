"use client"

import * as React from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import {
  appBrand,
  getNavGroupsForSession,
} from "@/navigation/app-nav-config"
import { AppNavMain } from "@/components/layout/app-nav-main"
import { AppNavUser } from "@/components/layout/app-nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, isAuthenticated, isLoading } = useAuth()

  const navGroups = React.useMemo(
    () => getNavGroupsForSession(isAuthenticated, user?.roles),
    [isAuthenticated, user?.roles],
  )

  const navUser = React.useMemo(
    () => ({
      name: user?.nombreCompleto ?? user?.userName ?? "Usuario",
      email: user?.userName ?? "sin sesión",
      avatar: "",
    }),
    [user?.nombreCompleto, user?.userName],
  )

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href={appBrand.homeTo} />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" aria-hidden />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{appBrand.name}</span>
                <span className="truncate text-xs">{appBrand.tagline}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isLoading ? (
          <SidebarGroup>
            <SidebarGroupContent className="px-2 py-4 text-xs text-muted-foreground">
              Cargando menú…
            </SidebarGroupContent>
          </SidebarGroup>
        ) : navGroups.length > 0 ? (
          <AppNavMain groups={navGroups} />
        ) : (
          <SidebarGroup>
            <SidebarGroupContent className="px-2 py-4 text-xs leading-relaxed text-muted-foreground">
              No hay módulos visibles para tu usuario. Contacta al
              administrador si necesitas acceso.
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60">
        {isAuthenticated ? (
          <AppNavUser user={navUser} />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/login" />}>
                <span>Iniciar sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
