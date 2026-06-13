"use client"

import type { ReactNode } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppSiteHeader } from "@/components/layout/app-site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

type AppShellLayoutProps = {
  children: ReactNode
}

export function AppShellLayout({ children }: AppShellLayoutProps) {
  return (
    <TooltipProvider delay={0}>
      <div className="[--header-height:--spacing(14)]">
        <SidebarProvider className="flex min-h-svh w-full flex-col">
          <AppSiteHeader />

          <div className="flex flex-1">
            <AppSidebar />

            <SidebarInset className="overflow-hidden bg-muted/20">
              <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
