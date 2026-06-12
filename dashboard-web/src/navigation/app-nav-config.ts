import {
  AlertTriangle,
  Bell,
  LayoutDashboard,
  Layers,
  Monitor,
  Radio,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react"

export const appBrand = {
  name: "Dashboard Web",
  tagline: "Gestión de alertas",
  homeTo: "/",
} as const

export type AppNavLink = {
  title: string
  to: string
  icon: LucideIcon
  items?: { title: string; to: string }[]
}

export type AppNavGroup = {
  id: string
  label: string
  items: AppNavLink[]
}

const navGroups: AppNavGroup[] = [
  {
    id: "general",
    label: "General",
    items: [
      {
        title: "Dashboard",
        to: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "alertas",
    label: "Alertas",
    items: [
      {
        title: "Alertas",
        to: "/alerts",
        icon: Bell,
      },
      {
        title: "Reglas",
        to: "/alert-rules",
        icon: ShieldAlert,
      },
      {
        title: "Eventos",
        to: "/events",
        icon: Radio,
      },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    items: [
      {
        title: "Niveles de severidad",
        to: "/severity-levels",
        icon: AlertTriangle,
      },
      {
        title: "Canales de notificación",
        to: "/notification-channels",
        icon: Layers,
      },
      {
        title: "Sistemas cliente",
        to: "/client-systems",
        icon: Monitor,
      },
    ],
  },
]

const breadcrumbByPath: Record<string, { group?: string; page: string }> = {
  "/": { group: "General", page: "Dashboard" },
  "/alerts": { group: "Alertas", page: "Alertas" },
  "/alert-rules": { group: "Alertas", page: "Reglas" },
  "/events": { group: "Alertas", page: "Eventos" },
  "/severity-levels": {
    group: "Configuración",
    page: "Niveles de severidad",
  },
  "/notification-channels": {
    group: "Configuración",
    page: "Canales de notificación",
  },
  "/client-systems": {
    group: "Configuración",
    page: "Sistemas cliente",
  },
}

export function getNavGroups(): AppNavGroup[] {
  return navGroups;
}

export function getNavBreadcrumb(pathname: string) {
  const exact = breadcrumbByPath[pathname]
  if (exact) return exact

  for (const [path, crumb] of Object.entries(breadcrumbByPath)) {
    if (pathname.startsWith(`${path}/`)) return crumb
  }

  return { page: "Inicio" }
}
