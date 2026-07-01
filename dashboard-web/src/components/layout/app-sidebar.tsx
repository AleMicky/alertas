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
      <SidebarHeader className="border-b border-sidebar-border/50 px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto gap-2.5 rounded-lg px-2 py-1.5 hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1.5!"
              render={<Link href={appBrand.homeTo} />}
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Bell className="size-3.5" aria-hidden />
              </div>
              <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-[13px] font-semibold tracking-tight text-sidebar-foreground">
                  {appBrand.name}
                </span>
                <span className="truncate text-[11px] text-sidebar-foreground/55">
                  {appBrand.tagline}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-1 py-3">
        <AppNavMain groups={navGroups} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
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
