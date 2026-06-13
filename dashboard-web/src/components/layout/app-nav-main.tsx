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
import type { AppNavGroup, AppNavLink } from "@/navigation/app-nav-config"

type AppNavMainProps = {
  groups: AppNavGroup[]
}

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
          render={<Link href={item.to} />}
        >
          <item.icon aria-hidden />
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
          render={<Link href={item.to} />}
        >
          <item.icon aria-hidden />
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
      {groups.map((group) => (
        <SidebarGroup key={group.id} className="px-2 py-1">
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider uppercase text-sidebar-foreground/55">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <NavLinkItem key={`${group.id}-${item.to}`} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
