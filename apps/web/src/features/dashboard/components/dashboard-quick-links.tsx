'use client';

import Link from 'next/link';
import {
  Bell,
  Braces,
  Layers,
  Monitor,
  Plug,
  type LucideIcon,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type QuickLink = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  count?: number;
};

interface Props {
  clientSystemsCount?: number;
  channelsCount?: number;
  providersCount?: number;
  schemasCount?: number;
  isLoading?: boolean;
}

export function DashboardQuickLinks({
  clientSystemsCount,
  channelsCount,
  providersCount,
  schemasCount,
  isLoading,
}: Props) {
  const links: QuickLink[] = [
    {
      title: 'Solicitudes',
      description: 'Monitoreo y acciones operativas',
      href: '/notification-requests',
      icon: Bell,
    },
    {
      title: 'Sistemas cliente',
      description: 'Emisores registrados',
      href: '/client-systems',
      icon: Monitor,
      count: clientSystemsCount,
    },
    {
      title: 'Canales',
      description: 'Canales de notificación',
      href: '/notification-channels',
      icon: Layers,
      count: channelsCount,
    },
    {
      title: 'Proveedores',
      description: 'Integraciones de envío',
      href: '/notification-channel-providers',
      icon: Plug,
      count: providersCount,
    },
    {
      title: 'Schemas',
      description: 'Validación de payloads',
      href: '/payload-schemas',
      icon: Braces,
      count: schemasCount,
    },
  ];

  return (
    <section className="space-y-2">
      <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Accesos rápidos
      </h2>
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link key={link.href} href={link.href} className="group">
              <Card className="h-full border-border/60 bg-card py-0 shadow-sm transition-colors group-hover:border-border group-hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between gap-2 px-3.5 py-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-3.5" aria-hidden />
                  </div>
                  {isLoading && link.count !== undefined ? (
                    <Skeleton className="h-5 w-8" />
                  ) : link.count !== undefined ? (
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {link.count}
                    </span>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-0.5 px-3.5 pb-3 pt-0">
                  <CardTitle className="text-xs font-semibold">
                    {link.title}
                  </CardTitle>
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
