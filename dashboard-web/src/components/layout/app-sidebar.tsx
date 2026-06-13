"use client"

import * as React from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"

import {
  appBrand,
  getNavGroups,
} from "@/navigation/app-nav-config"
import { AppNavMain } from "@/components/layout/app-nav-main"
import { AppNavUser } from "@/components/layout/app-nav-user"
import { useAuth } from "@/providers/auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const navGroups = React.useMemo(
    () => getNavGroups(user?.roles ?? []),
    [user?.roles],
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
        <AppNavMain groups={navGroups} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60">
        <AppNavUser
          user={{
            name: user?.fullName ?? "Usuario",
            email: user?.email ?? user?.username ?? "",
            avatar: "",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
