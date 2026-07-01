"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { AppNavGroup, AppNavLink } from "@/navigation/app-nav-config"

type AppNavMainProps = {
  groups: AppNavGroup[]
}

const navItemClassName = cn(
  "h-8 gap-2.5 rounded-md px-2.5 text-[13px] font-medium text-sidebar-foreground/75",
  "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
  "data-active:bg-primary/10 data-active:text-primary data-active:font-medium",
  "data-active:[&_svg]:text-primary",
  "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
)

function NavLinkItem({ item }: { item: AppNavLink }) {
  const pathname = usePathname()
  const hasSubItems = Boolean(item.items?.length)
  const isActive =
    pathname === item.to || pathname.startsWith(`${item.to}/`)

  if (!hasSubItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={isActive}
          className={navItemClassName}
          render={<Link href={item.to} />}
        >
          <item.icon className="size-4 shrink-0 opacity-80" aria-hidden />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={isActive}
          className={navItemClassName}
          render={<Link href={item.to} />}
        >
          <item.icon className="size-4 shrink-0 opacity-80" aria-hidden />
          <span>{item.title}</span>
        </SidebarMenuButton>
        <CollapsibleTrigger
          render={
            <SidebarMenuAction className="data-[state=open]:rotate-90">
              <ChevronRight aria-hidden />
              <span className="sr-only">Expandir</span>
            </SidebarMenuAction>
          }
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton render={<Link href={subItem.to} />}>
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AppNavMain({ groups }: AppNavMainProps) {
  return (
    <>
      {groups.map((group, index) => (
        <SidebarGroup
          key={group.id}
          className={cn(
            "px-1.5 py-0",
            index > 0 && "mt-4 border-t border-sidebar-border/40 pt-4",
          )}
        >
          <SidebarGroupLabel className="mb-1 h-6 px-2.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-sidebar-foreground/45">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {group.items.map((item) => (
              <NavLinkItem key={`${group.id}-${item.to}`} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
