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
      <div className="[--header-height:--spacing(12)]">
        <SidebarProvider className="flex min-h-svh w-full flex-col">
          <AppSiteHeader />

          <div className="flex flex-1">
            <AppSidebar />

            <SidebarInset className="overflow-hidden bg-[var(--shell-bg)]">
              <div className="flex flex-1 flex-col overflow-auto">
                <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5 md:px-8 md:py-7">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
