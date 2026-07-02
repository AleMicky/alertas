import {
  Braces,
  Bell,
  LayoutDashboard,
  Layers,
  Plug,
  Monitor,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react"

export const appBrand = {
  name: "MS Alertas",
  tagline: "Notificación",
  homeTo: "/",
} as const

export type AppNavLink = {
  title: string
  to: string
  icon: LucideIcon
  roles?: string[]
  items?: { title: string; to: string }[]
}

export type AppNavGroup = {
  id: string
  label: string
  roles?: string[]
  items: AppNavLink[]
}

const navGroups: AppNavGroup[] = [
  {
    id: "inicio",
    label: "Inicio",
    items: [
      {
        title: "Dashboard",
        to: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Solicitudes de notificación",
        to: "/notification-requests",
        icon: Bell,
      },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    items: [
      {
        title: "Canales de notificación",
        to: "/notification-channels",
        icon: Layers,
      },
      {
        title: "Proveedores de canal",
        to: "/notification-channel-providers",
        icon: Plug,
      },
      {
        title: "Schemas de payload",
        to: "/payload-schemas",
        icon: Braces,
      },
      {
        title: "Sistemas cliente",
        to: "/client-systems",
        icon: Monitor,
      },
    ],
  },
  {
    id: "administracion",
    label: "Administración",
    roles: ["ADMIN"],
    items: [
      {
        title: "Usuarios",
        to: "/users",
        icon: Users,
        roles: ["ADMIN"],
      },
      {
        title: "Roles",
        to: "/roles",
        icon: Shield,
        roles: ["ADMIN"],
      },
    ],
  },
]

const breadcrumbByPath: Record<string, { group?: string; page: string }> = {
  "/": { group: "Inicio", page: "Dashboard" },
  "/notification-requests": {
    group: "Inicio",
    page: "Solicitudes de notificación",
  },
  "/notification-channels": {
    group: "Configuración",
    page: "Canales de notificación",
  },
  "/notification-channel-providers": {
    group: "Configuración",
    page: "Proveedores de canal",
  },
  "/payload-schemas": {
    group: "Configuración",
    page: "Schemas de payload",
  },
  "/client-systems": {
    group: "Configuración",
    page: "Sistemas cliente",
  },
  "/users": {
    group: "Administración",
    page: "Usuarios",
  },
  "/roles": {
    group: "Administración",
    page: "Roles",
  },
  "/profile": { group: "Cuenta", page: "Perfil" },
  "/login": { page: "Iniciar sesión" },
}

function canAccess(roles: string[] | undefined, userRoles: string[]) {
  if (!roles?.length) return true
  return roles.some((role) => userRoles.includes(role))
}

export function getNavGroups(userRoles: string[] = []): AppNavGroup[] {
  return navGroups
    .filter((group) => canAccess(group.roles, userRoles))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccess(item.roles, userRoles)),
    }))
    .filter((group) => group.items.length > 0)
}

export function getNavBreadcrumb(pathname: string) {
  const exact = breadcrumbByPath[pathname]
  if (exact) return exact

  for (const [path, crumb] of Object.entries(breadcrumbByPath)) {
    if (pathname.startsWith(`${path}/`)) return crumb
  }

  return { page: "Inicio" }
}
