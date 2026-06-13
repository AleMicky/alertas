"use client"

import * as React from "react"
import Link from "next/link"
import { Bell } from "lucide-react"

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
      <SidebarHeader className="border-b border-sidebar-border/60 p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="relative overflow-hidden rounded-none px-3 py-4 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:py-2"
              render={<Link href={appBrand.homeTo} />}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-sidebar-primary/15 via-transparent to-transparent"
              />
              <div className="relative flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-sidebar-primary/25">
                <Bell className="size-4" aria-hidden />
              </div>
              <div className="relative grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight">
                  {appBrand.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {appBrand.tagline}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
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
