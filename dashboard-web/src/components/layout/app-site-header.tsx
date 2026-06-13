"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelLeft } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { appBrand, getNavBreadcrumb } from "@/navigation/app-nav-config"
import { AppSearchForm } from "@/components/layout/app-search-form"
import { AppThemeToggle } from "@/components/layout/app-theme-toggle"

export function AppSiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const { group, page } = getNavBreadcrumb(pathname)

  return (
    <header className="sticky top-0 z-50 flex w-full shrink-0 items-center border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="size-8"
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label="Alternar menú lateral"
        >
          <PanelLeft className="size-4" aria-hidden />
        </Button>

        <Separator orientation="vertical" className="mr-1 hidden h-4 sm:block" />

        <Breadcrumb className="hidden min-w-0 flex-1 sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={appBrand.homeTo} />}>
                {appBrand.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {group ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{group}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{page}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <span className="min-w-0 flex-1 truncate text-sm font-medium sm:hidden">
          {page}
        </span>

        <div className="flex items-center gap-2 sm:ml-auto">
          <AppSearchForm className="hidden w-full sm:block sm:max-w-xs" />
          <AppThemeToggle />
        </div>
      </div>
    </header>
  )
}
